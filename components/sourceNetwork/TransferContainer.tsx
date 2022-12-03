import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useGetWalletTokens from "../../hooks/useGetWalletTokens";
import useIsTokenValid from "../../hooks/useIsTokenValid";
import { shortenHex } from "../../util";
import ChooseNetwork from "./ChooseNetwork";
import ChooseToken from "./ChooseToken";

const TransferContainer = () => {
    const { account, library, chainId } = useWeb3React<Web3Provider>();
    const { fetchIsTokenValid, isTokenValid, setIsTokenValid } = useIsTokenValid();
    
    const [networkToBridge, setNetworkToBridge] = useState<any | undefined>();
    const [tokenAddress, setTokenAddress] = useState<string | undefined>();
    
    useEffect(() => {
        fetchIsTokenValid(tokenAddress);
    }, [tokenAddress, isTokenValid])

    return (
        <div className="results-form">
            <ChooseNetwork networkToBridge={networkToBridge} handleChooseNetwork={(networkToBridge) => setNetworkToBridge(networkToBridge) } />
            <ChooseToken tokenAddress={tokenAddress} setTokenAddress={setTokenAddress} isTokenValid={isTokenValid} setIsTokenValid={setIsTokenValid} />
        </div>
    );
};

export default TransferContainer;
