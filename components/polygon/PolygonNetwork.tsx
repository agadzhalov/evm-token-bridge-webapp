import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useGetWalletTokens from "../../hooks/useGetWalletTokens";
import { shortenHex } from "../../util";
import PolygonToken from "./PolygonToken";

type Contract = {
    handleRetrieveTokenByAddress?: any;
    bridgeContractAddress: string;
};

const PolygonNetwork = ({ bridgeContractAddress }: Contract) => {
    const [tokenAddress, setTokenAddress] = useState<string | undefined>();
    const { account, library, chainId } = useWeb3React<Web3Provider>();
    const { getTokens, isLoadingTokens } = useGetWalletTokens();
    const [walletTokens, setWalletTokens] = useState<any | undefined>();
    const [networkToBridge, setNetworkToBridge] = useState<any | undefined>();
    const networks = [
        {id: 5, name: "goerli"},
        {id: 80001, name: "mumbai"}
    ]

    useEffect(() => {
        setNetworkToBridge(5);
        setTokenAddress(tokenAddress);
        const retrieveTokens = async() => {
            setWalletTokens(await getTokens());
        }
        retrieveTokens();

    }, [])

    const stateTokenAddress = (input) => {
        setTokenAddress(input.target.value)
    }

    const isValidAddress = (): boolean => {
        return ethers.utils.isAddress(tokenAddress) ? true : false;
    }
    
    return (
        <div className="results-form">
            <div className="network-to-bridge">
                <label>Choose network to bridge to</label>
                <select
                    value={networkToBridge}
                    onChange={(e) => setNetworkToBridge(e.target.value)}
                >
                    {networks.map((network, index) => {
                        return (<option value={network.id} key={index} disabled={ chainId === network.id }>
                            {network.name} 
                        </option>)
                    })}
                </select>
            </div>
            <div className="choose-tokens">
                <label>Choose Token</label>
                {isLoadingTokens && ("Loading tokens from wallet ....")}
                {!isLoadingTokens && walletTokens && (
                    <select
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                    >   
                        <option value=""></option>
                        {walletTokens.map((token, index) => {
                            return (<option value={token.address} key={index}>
                                        {token.name} | {token.symbol} | {token.balance} | {shortenHex(token.address, 4)}
                                    </option>)
                        })}
                    </select>
                )}
                <br/>
                <label>Choose Address</label>
                <input onChange={stateTokenAddress} value={tokenAddress || ''} type="text" name="token_address" />
            </div>

            <br/><br/>
            {isValidAddress() && chainId == 80001 && (
                <PolygonToken account={account} tokenAddress={tokenAddress || ''} bridgeAddress={bridgeContractAddress} networkToBridgeId={networkToBridge} />)}
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

export default PolygonNetwork;
