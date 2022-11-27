import { useState } from "react";
import { BaseToken } from "../contracts/types";
import useEthereumBridgeContract from "./useEthereumBridgeContract";

const useEthereumBridge = (bridgeAddress: string) => {
    const contract = useEthereumBridgeContract(bridgeAddress);
    const [txHash, setTxHash] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
    const [error, setError] = useState<any | undefined>();
    
    const depositERC20 = async(account: string, tokenAddres: string, name: string, symbol: string, amount: string) => {
        try {
            const tx = await contract.lock(tokenAddres, amount);
            setIsLoading(true);
            setTxHash(tx.hash);
            await tx.wait();
            upadteLocalStorage(tx.hash, account, tokenAddres, name, symbol, amount, "goerli", "mumbai"); // from goerli to mumbai
            setError(null);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }

    return { depositERC20, txHash, isLoading, error };
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

const getNetworkName = (chainId: any) => {
    return chainId == 5 ? "Goerli" : chainId == 80001 ? "Mumbai" : "Error";
}

export default useEthereumBridge;