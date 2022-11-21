import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { ETHEREUM_TOKEN_BRIDGE } from "../constants";
import useEthereumBridgeContract from "../hooks/useEthereumBridgeContract";
import useTokenBalance from "../hooks/useTokenBalance";
import Token from "./view/Token";


type Contract = {
    handleRetrieveTokenByAddress?: any;
    bridgeContractAddress: string;
};

const EthereumNetwork = ({ bridgeContractAddress }: Contract) => {
    const [tokenAddress, setTokenAddress] = useState<string | undefined>();
    const { account, library } = useWeb3React<Web3Provider>();

    useEffect(() => {
        setTokenAddress(tokenAddress); //"0x5FbDB2315678afecb367f032d93F642f64180aa3"
    }, [])

    const stateTokenAddress = (input) => {
        setTokenAddress(input.target.value)
    }

    const isValidAddress = (): boolean => {
        return ethers.utils.isAddress(tokenAddress) ? true : false;
    }
    
    return (
        <div className="results-form">
            <label>Token Address</label>
            <input onChange={stateTokenAddress} value={tokenAddress || ''} type="text" name="token_address" />
            <br/><br/>
            {isValidAddress() && (<Token account={account} tokenAddress={tokenAddress || ''} bridgeAddress={ETHEREUM_TOKEN_BRIDGE} />)}
            {!isValidAddress() && tokenAddress !== undefined && tokenAddress.length > 0 && ("Please enter valid address")}
            <style jsx>{`
            .results-form {
                width: 50%;
                margin: 0 auto;
                text-align: left;
            }
            `}</style>
        </div>
    );
};

export default EthereumNetwork;
