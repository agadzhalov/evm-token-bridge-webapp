import { useState } from "react";
import { BaseToken } from "../contracts/types";
import useEthereumBridgeContract from "./useEthereumBridgeContract";

const useEthereumBridge = (bridgeAddress: string) => {
    const contract = useEthereumBridgeContract(bridgeAddress);
    const [txHash, setTxHash] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
    const [error, setError] = useState<any | undefined>();
    

    const depositERC20 = async(tokenAddres: string, amount: string) => {
        try {
            const tx = await contract.depositERC20(tokenAddres, amount);
            setIsLoading(true);
            setTxHash(tx.hash);
            await tx.wait();
            setError(null);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }
    
    return { depositERC20, txHash, isLoading, error };
}

export default useEthereumBridge;