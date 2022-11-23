import { useState } from "react";
import { BaseToken } from "../contracts/types";
import useEthereumBridgeContract from "./useEthereumBridgeContract";

const useEthereumBridge = (bridgeAddress: string) => {
    const contract = useEthereumBridgeContract(bridgeAddress);
    const [txHash, setTxHash] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
    const [error, setError] = useState<any | undefined>();
    

    const depositERC20 = async(account: string, tokenAddres: string, amount: string) => {
        try {
            const tx = await contract.lock(tokenAddres, amount);
            setIsLoading(true);
            setTxHash(tx.hash);
            await tx.wait();
            upadteLocalStorage(account, tokenAddres, amount);
            setError(null);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }
    
    const claimTokens = async(id: number, account: string, tokenAddres: string, amount: string) => {
        try {
            const tx = await contract.claimTokens(tokenAddres, "NameEvent", "SymbolEvent", amount);
            await tx.wait();
            claimLocalStorage(id, account, amount, amount);
        } catch (error) {
            
        } finally {
            
        }
    }
    
    return { depositERC20, txHash, isLoading, error, claimTokens };
}

const upadteLocalStorage = (account: string, tokenAddres: string, amount: string) => {
    if (localStorage.getItem("transferToken") == null) {
        localStorage.setItem("transferToken", JSON.stringify("[]"));
    } else {
        let store = JSON.parse(localStorage.getItem("transferToken"));
        console.log(store);
        const id = store.length == 0 ? 1 : store[store.length - 1].id + 1;
        store.push({
            "id": id,
            "from": "ethereum",
            "to": "polygon",
            "account": account,
            "token": tokenAddres,
            "amount": amount,
            "claimed": false
        });
        localStorage.setItem("transferToken", JSON.stringify(store));
    }
}

const claimLocalStorage = (id: number, account: string, tokenAddres: string, amount: string) => {
    let store = JSON.parse(localStorage.getItem("transferToken"));
    store.map(record => {
        if (record.id == id) {
            record.claimed = true;
        }
    });
    localStorage.setItem("transferToken", JSON.stringify(store));
    window.dispatchEvent(new Event("localStorageEvent"));
}

export default useEthereumBridge;