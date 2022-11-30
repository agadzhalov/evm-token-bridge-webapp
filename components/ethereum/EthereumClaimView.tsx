import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useEthereumBridge from "../../hooks/useEthereumBridge";
import { formatEtherscanLink, formatPolygonscanLink, shortenHex } from "../../util";
import ClaimTableRow from "../view/ClaimTableRow";
import usePolygonBridge from "../../hooks/usePolygonBridge";
import PendingTX from "../view/PendingTX";

type Props = {
    bridgeAddress: string;
}

const EthereumClaimView = ({bridgeAddress}: Props) => {
    const { account, library, chainId } = useWeb3React();
    const { unlockEthereumTokens, isClaimLoading, txHashClaim, claimError } = useEthereumBridge(bridgeAddress);
    const [claimData, setClaimData] = useState<any | undefined>();
    
    useEffect(() => {
        setClaimData(JSON.parse(localStorage.getItem("transferToken")));
        window.addEventListener('localStorageEvent', () => {
            setClaimData(JSON.parse(localStorage.getItem("transferToken")));
        });
    }, [])

    const getNetworkName = (chainId: any) => {
        return chainId == 5 ? "goerli" : chainId == 80001 ? "mumbai" : "Error";
    }

    return (
        <div className="results-form">
            {!isClaimLoading && (
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
                        {claimData && claimData.filter(data => data.account == account && data.to == getNetworkName(chainId)).map((data, index) => {
                            return (
                                <tr key={index}>
                                    <td>{data.from}</td>
                                    <td>{data.to}</td>
                                    <td>{data.symbol ? data.symbol : "----"} | {shortenHex(data.token, 4)}</td>
                                    <td>{ethers.utils.formatEther(data.amount)}</td>
                                    <td> <input type="button" value="Claim"
                                        onClick={() => unlockEthereumTokens(data.id, data.token, data.amount)} disabled={data.claimed} /></td>
                                    <td>
                                        <a {...{ href: formatPolygonscanLink("Transaction", [80001, data.transferTxHash]), target: "_blank" }}>
                                            {data.transferTxHash}
                                        </a>
                                    </td>
                                    <td>
                                        <a {...{ href: formatEtherscanLink("Transaction", [5, data.claimTxHash]), target: "_blank" }}>
                                            {data.claimTxHash}
                                        </a>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )}
            {isClaimLoading && (<PendingTX txHash={txHashClaim} />)}
            {claimError && (JSON.stringify(claimError))}
            <style jsx>{`
            .results-form {
                width: 80%;
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

export default EthereumClaimView;
