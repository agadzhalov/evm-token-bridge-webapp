import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useState } from "react";

const useIsTokenValid = () => {
    const { account, library, chainId } = useWeb3React<Web3Provider>();
    const [isTokenValid, setIsTokenValid] = useState<boolean | undefined>(false);
    
    const fetchIsTokenValid = async(tokenAddress) => {
        if (ethers.utils.isAddress(tokenAddress)) {
            const code = await library.getCode(tokenAddress);
            setIsTokenValid(code != "0x" ? true : false);
        } else {
            setIsTokenValid(false);
        }
    }

    return { fetchIsTokenValid, isTokenValid, setIsTokenValid };
}

export default useIsTokenValid;