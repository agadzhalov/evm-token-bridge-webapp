import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { GOERLI_CHAIN_ID, MUMBAI_CHAIN_ID } from "../../constants/networks";
import useGetWalletTokens from "../../hooks/useGetWalletTokens";
import { shortenHex } from "../../util";

type Props = {
    tokenAddress: string;
    setTokenAddress: any;
    isTokenValid: boolean;
    setIsTokenValid: any;
};

const ChooseToken = ({ tokenAddress, setTokenAddress, isTokenValid, setIsTokenValid }: Props) => {
    const { account, library, chainId } = useWeb3React<Web3Provider>();

    const { getTokens, isLoadingTokens } = useGetWalletTokens();
    const [walletTokens, setWalletTokens] = useState<any | undefined>();
    
    useEffect(() => {
        const retrieveTokens = async() => {
            setWalletTokens(await getTokens());
        }
        retrieveTokens();

    }, [])

    const handleChangeTokenAddress = (input) => {
        setTokenAddress(input.target.value);
    }

    const isValidAddress = (): boolean => {
        return ethers.utils.isAddress(tokenAddress) ? true : false;
    }

    return (
        <div className="results-form">
            <div className="choose-tokens">
                <label>Choose Token</label>
                {isLoadingTokens && (" .... Loading tokens from wallet ....")}
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
                <input onChange={handleChangeTokenAddress} value={tokenAddress || ''} type="text" name="token_address" />
                <br/>
                {!isValidAddress() && tokenAddress !== undefined && tokenAddress.length > 0 && ("Please enter valid address")}
                {isValidAddress() && !isTokenValid &&  ("Valid address, but not a valid token")}
            </div>
        </div>
    );
};

export default ChooseToken;
