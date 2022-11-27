import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useState } from "react";
import { BaseToken } from "../contracts/types";
import useEthereumBridgeContract from "./useEthereumBridgeContract";
import usePolygonBridgeContract from "./usePolygonBridgeContract";

const usePolygonBridge = (bridgeAddress: string) => {
    const { library, chainId } = useWeb3React<Web3Provider>();
    const contract = usePolygonBridgeContract(bridgeAddress);

    const [txHashClaim, setTxHashClaim] = useState<string | undefined>();
    const [isClaimLoading, setIsClaimLoading] = useState<boolean | undefined>(false);
    const [claimError, setClaimError] = useState<any | undefined>();

    const claimPolygonTokens = async(id: string, account: string, tokenAddres: string, amount: string, tokenName: string, tokenSymobl: string) => {
        const owner = await library.getSigner();
        try {
            
            const messageHash = ethers.utils.solidityKeccak256(['string'], ["signed message to claim tokens"]);
            const arrayfiedHash = ethers.utils.arrayify(messageHash);
            const signature = await owner.signMessage(arrayfiedHash);
            
            const sig = ethers.utils.splitSignature(signature);
            const tx = await contract.claimTokens(tokenAddres, tokenName, tokenSymobl, amount, messageHash, sig.v, sig.r, sig.s);
            setIsClaimLoading(true);
            setTxHashClaim(tx.hash);
            await tx.wait();
            
            claimLocalStorage(id, account, amount, amount);
            const getTargetTokenTx = await contract.getTargetTokenFromSource(tokenAddres);
        } catch (error) {
            console.log(error);
            setClaimError(error);
        } finally {
            setIsClaimLoading(false);
        }
    }
    
    return { claimPolygonTokens, txHashClaim, isClaimLoading, claimError  };
}


const claimLocalStorage = (id: string, account: string, tokenAddres: string, amount: string) => {
    let store = JSON.parse(localStorage.getItem("transferToken"));
    store.map(record => {
        if (record.id == id) {
            record.claimed = true;
        }
    });
    localStorage.setItem("transferToken", JSON.stringify(store));
    window.dispatchEvent(new Event("localStorageEvent"));
}

export default usePolygonBridge;