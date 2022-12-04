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
import { ETHEREUM_BRIDGE_GOERLI, POLYGON_BRIDGE_MUMBAI } from "../../constants";
import PendingTX from "../view/PendingTX";
import usePolygonBridge from "../../hooks/usePolygonBridge";
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import Error from "../view/Error";

const TransferContainer = () => {
    const { account, library, chainId } = useWeb3React<Web3Provider>();
    const { fetchIsTokenValid, isTokenValid, setIsTokenValid } = useIsTokenValid();
    
    const [networkToBridge, setNetworkToBridge] = useState<any | undefined>();
    const [tokenAddress, setTokenAddress] = useState<string | undefined>();
    const [amount, setAmount] = useState<string | undefined>();

    const {name, symbol, balance} = useTokenDetails(tokenAddress, ERC20_ABI);
    const { depositERC20, 
            txHash: depositTxHash, 
            isLoading: depositIsLoaidng, 
            error: depositError, 
            metaMaskLoading: transferMetaMaskLoading } = useEthereumBridge(ETHEREUM_BRIDGE_GOERLI);

    const { sendERC20, 
            isSendLoading, 
            txHashSend, 
            sendError,
            metaMaskLoading: sendMetaMaskLoading } = usePolygonBridge(POLYGON_BRIDGE_MUMBAI);

    useEffect(() => {
        fetchIsTokenValid(tokenAddress);
    }, [tokenAddress, isTokenValid])

    return (
        <div className="transfer">
            {depositError && (<Error error={JSON.stringify(depositError)} />)}
            {sendError && (<Error error={JSON.stringify(sendError)} />)}
            
            <Card style={{ marginBottom: '2em' }}>
            {!transferMetaMaskLoading && !sendMetaMaskLoading && (
               <div>
                {depositIsLoaidng && (<PendingTX txHash={depositTxHash} />)}
                {isSendLoading && (<PendingTX txHash={txHashSend} />)}
                {!depositIsLoaidng && !isSendLoading && (
                    <div>
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
                        depositERC20={depositERC20}
                        sendERC20={sendERC20} />
                    </div>
                )}
               </div> 
            )}
            {transferMetaMaskLoading && (<ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="2" fill="var(--surface-ground)" animationDuration=".5s" />)}
            {sendMetaMaskLoading && (<ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="2" fill="var(--surface-ground)" animationDuration=".5s" />)}
            </Card>
        </div>
    );
};

export default TransferContainer;
