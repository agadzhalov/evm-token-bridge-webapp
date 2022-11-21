import { useState } from "react";
import { BaseToken, ERC20, EthereumBridge } from "../contracts/types";

const useApproveToken = (contract: ERC20, bridgeAddress: string, account: any) => {
    const [amount, setAmount] = useState<string | undefined>();
    const [txHash, setTxHash] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
    const [error, setError] = useState<any | undefined>();
    const [allowance, setAllowance] = useState<any | undefined>();
    
    const approveToken = async(amount: string) => {
        try {
            const tx = await contract.approve(bridgeAddress, amount);
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

    const getAllowance = async() => {
        try {
            const tx = await contract.allowance(account, bridgeAddress);
            setIsLoading(true);
            setError(null);
            return tx.toString();
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }
    
    return { approveToken, getAllowance, isLoading, txHash };
}

export default useApproveToken;