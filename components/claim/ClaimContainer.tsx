import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { ETHEREUM_BRIDGE_GOERLI, POLYGON_BRIDGE_MUMBAI } from "../../constants";
import { getNetworkName, GOERLI_CHAIN_ID, MUMBAI_CHAIN_ID } from "../../constants/networks";
import useEthereumBridge from "../../hooks/useEthereumBridge";
import usePolygonBridge from "../../hooks/usePolygonBridge";
import { formatEtherscanLink, formatPolygonscanLink, shortenHex } from "../../util";
import PendingTX from "../view/PendingTX";


const ClaimContainer = () => {
    const { account, library, chainId } = useWeb3React();

    const [claimData, setClaimData] = useState<any | undefined>();

    const { unlockEthereumTokens, isClaimLoading: isUnlockLoading, txHashClaim: txHashUnlock, claimError: unlockError } = useEthereumBridge(ETHEREUM_BRIDGE_GOERLI);
    const { claimPolygonTokens, isClaimLoading, txHashClaim, claimError } = usePolygonBridge(POLYGON_BRIDGE_MUMBAI);

    useEffect(() => {
        setClaimData(JSON.parse(localStorage.getItem("transferToken")));
        window.addEventListener('localStorageEvent', () => {
            setClaimData(JSON.parse(localStorage.getItem("transferToken")));
        });
    }, [])
    
    const handleClaimButton = (id: string, token: string, amount: string, name: string, symbol: string) => {
        switch(chainId) {
            case GOERLI_CHAIN_ID:
                return unlockEthereumTokens(id, token, amount);
            case MUMBAI_CHAIN_ID:
                return claimPolygonTokens(id, token, amount, name, symbol);
        }
    }

    const handleTxLink = (hash: string, openChainId: number) => {
        switch(openChainId) {
            case GOERLI_CHAIN_ID:
                return (
                    <a {...{ href: formatPolygonscanLink("Transaction", [MUMBAI_CHAIN_ID, hash]), target: "_blank" }}>
                        {hash ? shortenHex(hash, 4) : ""}
                    </a> 
                )
            case MUMBAI_CHAIN_ID:
                return (
                    <a {...{ href: formatEtherscanLink("Transaction", [GOERLI_CHAIN_ID, hash]), target: "_blank" }}>
                        {hash ? shortenHex(hash, 4) : ""}
                    </a> 
                )
        }
    }

    return (
        <div className="results-form">
            <table>
                <thead>
                    <tr>
                        <th>from</th>
                        <th>to</th>
                        <th>token</th>
                        <th>amount</th>
                        <th>action</th>
                        <th>transferTx</th>
                        <th>claimTx</th>
                    </tr>
                </thead>
                <tbody>
                    {isUnlockLoading && (<PendingTX txHash={txHashUnlock} />)}
                    {isClaimLoading && (<PendingTX txHash={txHashClaim} />)}
                    {claimData && claimData.filter(data => data.account == account && data.to == getNetworkName(chainId)).map((data, index) => {
                        return (
                            <tr key={index}>
                                <td>{data.from}</td>
                                <td>{data.to}</td>
                                <td>{data.symbol ? data.symbol : "----"} | {shortenHex(data.token, 4)}</td>
                                <td>{ethers.utils.formatEther(data.amount)}</td>
                                <td> <input type="button" value="Claim"
                                    onClick={() => handleClaimButton(data.id, data.token, data.amount, data.name, data.symbol)} disabled={data.claimed} /></td>
                                <td>
                                    {handleTxLink(data.transferTxHash, chainId == MUMBAI_CHAIN_ID ? MUMBAI_CHAIN_ID : GOERLI_CHAIN_ID)}
                                </td>
                                <td>
                                    {handleTxLink(data.claimTxHash, chainId == MUMBAI_CHAIN_ID ? GOERLI_CHAIN_ID : MUMBAI_CHAIN_ID)}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <style jsx>{`
            .results-form {
                width: 50%;
                margin: 0 auto;
            }
            table tr td, table tr th{
                border: 1px solid #000;
            }
            a {
                color: blue;
                text-decoration: underline;
            }
        `}</style>
        </div>
    );
};

export default ClaimContainer;
