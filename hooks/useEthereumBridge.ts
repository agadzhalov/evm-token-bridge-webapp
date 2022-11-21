import { useState } from "react";
import { BaseToken } from "../contracts/types";
import useEthereumBridgeContract from "./useEthereumBridgeContract";

const useEthereumBridge = (bridgeAddress: string) => {
    const contract = useEthereumBridgeContract(bridgeAddress);

    const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
    const [error, setError] = useState<any | undefined>();
    

    const depositERC20 = async(tokenAddres: string, amount: string) => {
        try {
            console.log(tokenAddres, amount);
            const tx = await contract.depositERC20(tokenAddres, amount);
            setIsLoading(true);
            setError(null);
            return tx.toString();
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }
    
    return { depositERC20 };
}

export default useEthereumBridge;