import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { EthereumBridge } from "../../contracts/types";
import useApproveToken from "../../hooks/useApproveToken";
import useEthereumBridge from "../../hooks/useEthereumBridge";
import usePolygonBridge from "../../hooks/usePolygonBridge";
import useTokenBalance from "../../hooks/useTokenBalance";
import useTokenContract from "../../hooks/useTokenContract";
import PendingTX from "../view/PendingTX";
import axios from 'axios';
import useTxsHistory from "../../hooks/useTxsHistory";
import { formatEtherscanLink, formatPolygonscanLink } from "../../util";
import Moment from 'react-moment';
import { GOERLI_CHAIN_ID, MUMBAI_CHAIN_ID } from "../../constants/networks";


const TransactionsHistory = () => {
    const { account, library, chainId } = useWeb3React();
    const { getUrl } = useTxsHistory();
    const [txs, setTxs] = useState<any | undefined>();

    useEffect(() => {
        axios
            .get(getUrl())
            .then((response) => {
                setTxs(response.data.result)
            })
            .catch(error => {
                console.log(error);
            })
    }, [chainId])

    const link = (hash: string, type: "Account" | "Transaction") => {
        if (chainId == GOERLI_CHAIN_ID) {
            return (
                <a {...{ href: formatEtherscanLink(type, [5, hash]), target: "_blank", className: "jsx-7ef342ac1b941f10" }}>
                    {hash}
                </a>
            )
        } else if (chainId == MUMBAI_CHAIN_ID) {
            return (
            <a {...{ href: formatPolygonscanLink(type, [80001, hash]), target: "_blank", className: "jsx-7ef342ac1b941f10" }}>
                {hash}
            </a>
            )
        }
    }

    return (
        <div className="results-form">
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Hash</th>
                        <th>From</th>
                        <th>Inetracted With (To)</th>
                        <th>Gas Price</th>
                    </tr>
                </thead>
                <tbody>
                    {txs && txs.map((tx, index) => {
                        return (
                        <tr key={index}>
                            <td><Moment unix>{tx.timeStamp}</Moment></td>
                            <td>{ link(tx.hash, "Transaction") }</td>
                            <td>{ link(tx.from, "Account") }</td>
                            <td>{ link(tx.to, "Account") }</td>
                            <td>{ ethers.utils.formatEther(tx.gasPrice) }</td>
                        </tr>
                        )
                    })}
                </tbody>
            </table>
        <style jsx>{`
            .results-form {
                width: 1600px;
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

export default TransactionsHistory;
