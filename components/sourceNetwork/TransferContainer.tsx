import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useCustomContract from "../../hooks/useTokenDetails";
import useGetWalletTokens from "../../hooks/useGetWalletTokens";
import useIsTokenValid from "../../hooks/useIsTokenValid";
import { shortenHex } from "../../util";
import ChooseNetwork from "./ChooseNetwork";
import ChooseToken from "./ChooseToken";
import ERC20_ABI from "../../contracts/ERC20.json";
import TransferButton from "./TransferButton";
import useTokenDetails from "../../hooks/useTokenDetails";
import ChooseAmount from "./ChooseAmount";
import useEthereumBridge from "../../hooks/useEthereumBridge";
import { ETHEREUM_BRIDGE_GOERLI } from "../../constants";
import PendingTX from "../view/PendingTX";

const TransferContainer = () => {
    const { account, library, chainId } = useWeb3React<Web3Provider>();
    const { fetchIsTokenValid, isTokenValid, setIsTokenValid } = useIsTokenValid();
    
    const [networkToBridge, setNetworkToBridge] = useState<any | undefined>();
    const [tokenAddress, setTokenAddress] = useState<string | undefined>();
    const [amount, setAmount] = useState<string | undefined>();

    const {name, symbol, balance} = useTokenDetails(tokenAddress, ERC20_ABI);
    const { depositERC20, txHash: depositTxHash, isLoading: depositIsLoaidng, error: depositError } = useEthereumBridge(ETHEREUM_BRIDGE_GOERLI);

    useEffect(() => {
        fetchIsTokenValid(tokenAddress);
    }, [tokenAddress, isTokenValid])

    return (
        <div className="results-form">
            {depositIsLoaidng && (<PendingTX txHash={depositTxHash} />)}
            {!depositIsLoaidng && (
                <>
                <ChooseNetwork networkToBridge={networkToBridge} handleChooseNetwork={(networkToBridge) => setNetworkToBridge(networkToBridge) } />
                <ChooseToken tokenAddress={tokenAddress} setTokenAddress={setTokenAddress} isTokenValid={isTokenValid} setIsTokenValid={setIsTokenValid} />
                <ChooseAmount amount={amount} setAmount={setAmount} />
                <TransferButton 
                    name={name || undefined} 
                    symbol={symbol || undefined} 
                    amount={amount} 
                    setAmount={setAmount}
                    networkToBridgeId={networkToBridge}
                    tokenAddress={tokenAddress}
                    depositERC20={depositERC20} />
                </>
            )}
            
        </div>
    );
};

export default TransferContainer;
