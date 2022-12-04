import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { GOERLI_CHAIN_ID, MUMBAI_CHAIN_ID } from "../../constants/networks";
import useGetWalletTokens from "../../hooks/useGetWalletTokens";
import { shortenHex } from "../../util";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

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
    }, [chainId])

    const handleChangeTokenAddress = (input) => {
        setTokenAddress(input.target.value);
    }

    const isValidAddress = (): boolean => {
        return ethers.utils.isAddress(tokenAddress) ? true : false;
    }

    return (
        <div className="results-form">
            <div className="choose-tokens">
                <div className="p-fluid grid">
                    <div className="field col-12">
                        {isLoadingTokens && (<ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="2" fill="var(--surface-ground)" animationDuration=".5s" />)}
                        {!isLoadingTokens && walletTokens && (
                            <span className="p-float-label">
                                <Dropdown
                                    inputId="dropdown"
                                    value={tokenAddress}
                                    optionLabel="name"
                                    options={walletTokens}
                                    onChange={(e) => setTokenAddress(e.target.value)} />
                                <label htmlFor="dropdown">Choose token</label>
                            </span>
                        )}
                    </div>
                    {!isValidAddress() && tokenAddress !== undefined && tokenAddress.length > 0 && (
                        <div className="field col-12" style={{color: "red"}}>Please enter valid address</div>
                    )}
                    {isValidAddress() && !isTokenValid && (
                        <div className="field col-12" style={{color: "red"}}>Valid address, but not a valid token</div>
                    )}
                    <div className="field col-12">
                        <span className="p-float-label">
                            <InputText id="in" value={tokenAddress || ''} onChange={handleChangeTokenAddress} />
                            <label htmlFor="in">Choose address</label>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChooseToken;
