import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { EthereumBridge } from "../../contracts/types";
import useApproveToken from "../../hooks/useApproveToken";
import useEthereumBridge from "../../hooks/useEthereumBridge";
import useTokenBalance from "../../hooks/useTokenBalance";
import useTokenContract from "../../hooks/useTokenContract";
import PendingTX from "./PendingTX";

type Contract = {
    account: any;
    tokenAddress: string;
    bridgeAddress: string;
};

const TokenPolygon = ({ account, tokenAddress, bridgeAddress }: Contract) => {
    const contract = useTokenContract(tokenAddress);
    const [isTokenValid, setTokenValid] = useState<boolean | undefined>();
    const { library, chainId } = useWeb3React<Web3Provider>();
    
    useEffect(() => {
        const fetchIsTokenValid = async() => {
            const code = await library.getCode(tokenAddress);
            setTokenValid(code != "0x" ? true : false);
        }
        fetchIsTokenValid();
        
    }, [])
    

    return (
        <div className="results-form">
            <div className="info">
                {isTokenValid + " isValid"}
                
            </div>
        </div>
    );
};

export default TokenPolygon;
