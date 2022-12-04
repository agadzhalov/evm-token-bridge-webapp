import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from 'axios';
import useTxsHistory from "../../hooks/useTxsHistory";
import { formatEtherscanLink, formatPolygonscanLink } from "../../util";
import Moment from 'react-moment';
import { GOERLI_CHAIN_ID, MUMBAI_CHAIN_ID } from "../../constants/networks";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';

const TransactionsHistory = () => {
    const { account, library, chainId } = useWeb3React();
    const { getUrl } = useTxsHistory();
    const [txs, setTxs] = useState<any | undefined>();
    const [isTxsLoading, setIsTxsLoading] = useState<boolean | undefined>(false);

    useEffect(() => {
        setIsTxsLoading(true);
        axios
            .get(getUrl())
            .then((response) => {
                setIsTxsLoading(false);
                setTxs(response.data.result)
            })
            .catch(error => {
                setIsTxsLoading(false);
                console.log(error);
            })
    }, [chainId])

    const link = (hash: string, type: "Account" | "Transaction") => {
        if (chainId == GOERLI_CHAIN_ID) {
            return (
                <a {...{ href: formatEtherscanLink(type, [GOERLI_CHAIN_ID, hash]), target: "_blank", className: "jsx-7ef342ac1b941f10" }}>
                    {hash}
                </a>
            )
        } else if (chainId == MUMBAI_CHAIN_ID) {
            return (
            <a {...{ href: formatPolygonscanLink(type, [MUMBAI_CHAIN_ID, hash]), target: "_blank", className: "jsx-7ef342ac1b941f10" }}>
                {hash}
            </a>
            )
        }
    }

    return (
        <div className="results-form">
            {isTxsLoading && (
                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="2" fill="var(--surface-ground)" animationDuration=".5s" />
            )}
            {!isTxsLoading && (
                <DataTable 
                    value={txs} 
                    paginator 
                    responsiveLayout="scroll"
                    stripedRows
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10,20,50]}
                >
                    <Column field="timeStamp" header="Date" className="link" body={(tx) => (
                        <Moment unix>{tx.timeStamp}</Moment>
                    )}> 
                    </Column>
                    <Column field="hash" header="Hash" className="link" body={(tx) => (
                        link(tx.hash, "Transaction") 
                    )}> 
                    </Column>
                    <Column field="from" header="From" className="link" body={(tx) => (
                        link(tx.from, "Account") 
                    )}> 
                    </Column>
                    <Column field="to" header="To" className="link" body={(tx) => (
                        link(tx.to, "Account") 
                    )}> 
                    </Column>
                    <Column field="gasPrice" header="Gas Price" className="link" body={(tx) => (
                        ethers.utils.formatEther(tx.gasPrice)
                    )}> 
                    </Column>
                </DataTable>
            )}
        </div>
    );
};

export default TransactionsHistory;
