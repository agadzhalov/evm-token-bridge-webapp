import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { Contract, ethers } from "ethers";
import { useState } from "react";
import { BaseToken } from "../contracts/types";
import useApproveToken from "./useApproveToken";
import useEthereumBridgeContract from "./useEthereumBridgeContract";
import usePolygonBridgeContract from "./usePolygonBridgeContract";
import BASE_TOKEN_ABI from "../contracts/BaseToken.json";
import usePermitSignature from "./usePermitSignature";

const usePolygonBridge = (bridgeAddress: string) => {
    const { library, chainId } = useWeb3React<Web3Provider>();
    const { getPermitSignature } = usePermitSignature();
    const contract = usePolygonBridgeContract(bridgeAddress);

    const [txHashClaim, setTxHashClaim] = useState<string | undefined>();
    const [isClaimLoading, setIsClaimLoading] = useState<boolean | undefined>(false);
    const [claimError, setClaimError] = useState<any | undefined>();

    const claimPolygonTokens = async(id: string, tokenAddress: string, amount: string, tokenName: string, tokenSymobl: string) => {
        try {
            const owner = await library.getSigner();
            const messageHash = ethers.utils.solidityKeccak256(['string'], ["signed message to claim tokens"]);
            const arrayfiedHash = ethers.utils.arrayify(messageHash);
            const signature = await owner.signMessage(arrayfiedHash);
            
            const sig = ethers.utils.splitSignature(signature);
            const tx = await contract.claimTokens(tokenAddress, tokenName, tokenSymobl, amount, messageHash, sig.v, sig.r, sig.s);
            setIsClaimLoading(true);
            setTxHashClaim(tx.hash);
            await tx.wait();
            
            claimLocalStorage(id, tx.hash);
        } catch (error) {
            console.log(error);
            setClaimError(error);
        } finally {
            setIsClaimLoading(false);
        }
    }
    
    const [txHashSend, setTxHashSend] = useState<string | undefined>();
    const [isSendLoading, setIsSendLoading] = useState<boolean | undefined>(false);
    const [sendError, setSendError] = useState<any | undefined>();

    const sendERC20 = async(account: string, tokenAddres: string, name: string, symbol: string, amount: string, networkToBridge: number) => {
        try {
            const owner = await library.getSigner();
            const sourceToken = await contract.getSourceTokenFromTarget(tokenAddres);

            const deadline = ethers.constants.MaxUint256;
            const token =  new Contract(tokenAddres, BASE_TOKEN_ABI, library.getSigner(account));
            const {v, r, s} = await getPermitSignature(owner, token, bridgeAddress, amount, deadline);

            const tx = await contract.destroyTokens(tokenAddres, amount, deadline, v, r, s);
            setIsSendLoading(true);
            setTxHashSend(tx.hash);
            await tx.wait();
            upadteLocalStorage(tx.hash, account, sourceToken, name, symbol, amount, 
            getNetworkName(chainId), getNetworkName(networkToBridge), tx.hash); // from goerli to mumbai
            setSendError(null);
        } catch (error) {
            setSendError(error);
        } finally {
            setIsSendLoading(false);
        }
    }

    return { claimPolygonTokens, txHashClaim, isClaimLoading, claimError,
    sendERC20, txHashSend, isSendLoading, sendError  };
}

const upadteLocalStorage = (txHash: string, account: string, tokenAddres: string, name: string, symbol: string, 
    amount: string, fromChain: string, toChainName: string, transferTx: string) => {
    if (localStorage.getItem("transferToken") == null) {
        localStorage.setItem("transferToken", "[]");
    }
    let store = JSON.parse(localStorage.getItem("transferToken"));
    console.log(account, tokenAddres, amount)
    store.push({
        "id": txHash,
        "from": fromChain,
        "to": toChainName,
        "account": account,
        "name": name.substring(1),
        "symbol": symbol.substring(1),
        "token": tokenAddres,
        "amount": amount,
        "claimed": false,
        "transferTxHash": transferTx,
        "claimTxHash": null
    });
    localStorage.setItem("transferToken", JSON.stringify(store));
}

const claimLocalStorage = (id: string, claimTxHash: string) => {
    let store = JSON.parse(localStorage.getItem("transferToken"));
    store.map(record => {
        if (record.id == id) {
            record.claimed = true;
            record.claimTxHash = claimTxHash;
        }
    });
    localStorage.setItem("transferToken", JSON.stringify(store));
    window.dispatchEvent(new Event("localStorageEvent"));
}

const getNetworkName = (chainId: any) => {
    return chainId == 5 ? "goerli" : chainId == 80001 ? "mumbai" : "Other/Unknown";
}

export default usePolygonBridge;