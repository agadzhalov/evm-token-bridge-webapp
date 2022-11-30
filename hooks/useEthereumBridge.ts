import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { BaseToken } from "../contracts/types";
import useEthereumBridgeContract from "./useEthereumBridgeContract";

const useEthereumBridge = (bridgeAddress: string) => {
    const contract = useEthereumBridgeContract(bridgeAddress);
    const { library, chainId } = useWeb3React<Web3Provider>();

    const [txHash, setTxHash] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
    const [error, setError] = useState<any | undefined>();
    
    const depositERC20 = async(networkToBridgeId: number, account: string, tokenAddres: string, name: string, symbol: string, amount: string) => {
        try {
            const tx = await contract.lock(tokenAddres, amount);
            setIsLoading(true);
            setTxHash(tx.hash);
            await tx.wait();
            upadteLocalStorage(tx.hash, account, tokenAddres, name, symbol, amount, getNetworkName(chainId), getNetworkName(networkToBridgeId)); // from goerli to mumbai
            setError(null);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }

    const [txHashClaim, setTxHashClaim] = useState<string | undefined>();
    const [isClaimLoading, setIsClaimLoading] = useState<boolean | undefined>(false);
    const [claimError, setClaimError] = useState<any | undefined>();

    const claimEthereumTokens = async(id: string, sourceToken: string, amount: string) => {
        try {
            const tx = await contract.unlock(sourceToken, amount);
            setIsClaimLoading(true);
            setTxHashClaim(tx.hash);
            await tx.wait();
            
            claimLocalStorage(id);
        } catch (error) {
            console.log(error);
            setClaimError(error);
        } finally {
            setIsClaimLoading(false);
        }
    }

    return { depositERC20, txHash, isLoading, error,
        claimEthereumTokens, txHashClaim, isClaimLoading, claimError };
}

const upadteLocalStorage = (txHash: string, account: string, tokenAddres: string, name: string, symbol: string, amount: string, fromChain: string, toChainName: string) => {
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
        "claimed": false
    });
    localStorage.setItem("transferToken", JSON.stringify(store));
}

const claimLocalStorage = (id: string) => {
    let store = JSON.parse(localStorage.getItem("transferToken"));
    store.map(record => {
        if (record.id == id) {
            record.claimed = true;
        }
    });
    localStorage.setItem("transferToken", JSON.stringify(store));
    window.dispatchEvent(new Event("localStorageEvent"));
}

const getNetworkName = (chainId: any) => {
    return chainId == 5 ? "goerli" : chainId == 80001 ? "mumbai" : "Other/Unknown";
}

export default useEthereumBridge;