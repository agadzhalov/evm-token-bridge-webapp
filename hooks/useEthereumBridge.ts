import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { Contract, ethers } from "ethers";
import { useState } from "react";
import { BaseToken } from "../contracts/types";
import useEthereumBridgeContract from "./useEthereumBridgeContract";
import usePermitSignature from "./usePermitSignature";
import BASE_TOKEN_ABI from "../contracts/BaseToken.json";

const useEthereumBridge = (bridgeAddress: string) => {
    const contract = useEthereumBridgeContract(bridgeAddress);
    const { library, chainId } = useWeb3React<Web3Provider>();
    const { getPermitSignature } = usePermitSignature();

    const [txHash, setTxHash] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
    const [error, setError] = useState<any | undefined>();
    const [metaMaskLoading, setIsMetaMaskLoading] = useState<boolean | undefined>(false);

    const depositERC20 = async(networkToBridgeId: number, account: string, tokenAddres: string, name: string, symbol: string, amount: string) => {
        setIsMetaMaskLoading(true);
        try {
            const owner = await library.getSigner();
            const deadline = ethers.constants.MaxUint256;
            const token =  new Contract(tokenAddres, BASE_TOKEN_ABI, library.getSigner(account));
            const {v, r, s} = await getPermitSignature(owner, token, bridgeAddress, amount, deadline);
            const tx = await contract.lock(tokenAddres, amount, deadline, v, r, s);
            setIsMetaMaskLoading(false);
            setIsLoading(true);
            setTxHash(tx.hash);
            await tx.wait();
            upadteLocalStorage(tx.hash, account, tokenAddres, name, symbol, amount, 
            getNetworkName(chainId), getNetworkName(networkToBridgeId), tx.hash); // from goerli to mumbai
            setError(null);
        } catch (error) {
            console.log(error)
            setIsMetaMaskLoading(false);
            setError(error);
        } finally {
            setIsMetaMaskLoading(false);
            setIsLoading(false);
        }
    }

    const [txHashClaim, setTxHashClaim] = useState<string | undefined>();
    const [isClaimLoading, setIsClaimLoading] = useState<boolean | undefined>(false);
    const [claimError, setClaimError] = useState<any | undefined>();

    const unlockEthereumTokens = async(id: string, sourceToken: string, amount: string) => {
        setIsMetaMaskLoading(true);
        try {
            const tx = await contract.unlock(sourceToken, amount);
            setIsMetaMaskLoading(false);
            setIsClaimLoading(true);
            setTxHashClaim(tx.hash);
            await tx.wait();
            
            claimLocalStorage(id, tx.hash);
        } catch (error) {
            console.log(error);
            setIsMetaMaskLoading(false);
            setClaimError(error);
        } finally {
            setIsClaimLoading(false);
            setIsMetaMaskLoading(false);
        }
    }

    return { depositERC20, txHash, isLoading, error, metaMaskLoading, 
        unlockEthereumTokens, txHashClaim, isClaimLoading, claimError };
}

const upadteLocalStorage = (txHash: string, account: string, tokenAddres: string, name: string, symbol: string, 
    amount: string, fromChain: string, toChainName: string, transferFromSourceTxHash: string) => {
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
        "name": name,
        "symbol": symbol,
        "token": tokenAddres,
        "amount": amount,
        "claimed": false,
        "transferTxHash": transferFromSourceTxHash,
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

export default useEthereumBridge;