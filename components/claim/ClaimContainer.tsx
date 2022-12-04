import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { ETHEREUM_BRIDGE_GOERLI, POLYGON_BRIDGE_MUMBAI } from "../../constants";
import { getNetworkName, GOERLI_CHAIN_ID, MUMBAI_CHAIN_ID } from "../../constants/networks";
import useEthereumBridge from "../../hooks/useEthereumBridge";
import usePolygonBridge from "../../hooks/usePolygonBridge";
import { formatEtherscanLink, formatPolygonscanLink, shortenHex } from "../../util";
import PendingTX from "../view/PendingTX";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';

const ClaimContainer = () => {
    const { account, library, chainId } = useWeb3React();

    const [claimData, setClaimData] = useState<any | undefined>();

    const { 
        unlockEthereumTokens, 
        isClaimLoading: isUnlockLoading, 
        txHashClaim: txHashUnlock, 
        claimError: unlockError,
        metaMaskLoading: unlockMetaMaskLoading } = useEthereumBridge(ETHEREUM_BRIDGE_GOERLI);

    const { 
        claimPolygonTokens, 
        isClaimLoading, 
        txHashClaim, 
        claimError,
        metaMaskLoading: claimMetaMaskLoading } = usePolygonBridge(POLYGON_BRIDGE_MUMBAI);

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
                        {hash ? hash : ""}
                    </a> 
                )
            case MUMBAI_CHAIN_ID:
                return (
                    <a {...{ href: formatEtherscanLink("Transaction", [GOERLI_CHAIN_ID, hash]), target: "_blank" }}>
                        {hash ? hash : ""}
                    </a> 
                )
        }
    }

    const getFilteredAndSortedDescData = (data: any) => {
        return data.filter(data => data.account == account && data.to == getNetworkName(chainId)).sort().reverse();
    }

    return (
        <div className="results-form">
            {!isUnlockLoading && !isClaimLoading && !claimMetaMaskLoading && !unlockMetaMaskLoading && claimData && (
            <DataTable 
                    value={getFilteredAndSortedDescData(claimData)} 
                    paginator 
                    responsiveLayout="scroll"
                    stripedRows
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10,20,50]}
                >
                <Column field="from" header="From" ></Column>
                <Column field="to" header="To" ></Column>
                <Column field="token" header="Token" body={(data) => (
                    <>{data.symbol ? data.symbol : "----"} | {shortenHex(data.token, 15)}</>
                )}></Column>

                <Column field="amount" header="Amount"  body={(data) => (
                    ethers.utils.formatEther(data.amount)
                )}></Column>

                <Column field="action" header="Action"  body={(data) =>
                    <Button
                        label="Claim"
                        icon="pi pi-download"
                        type="button" 
                        className="p-button-raised p-button-primary"
                        disabled={data.claimed}
                        onClick={() => handleClaimButton(data.id, data.token, data.amount, data.name, data.symbol)}
                    />
                }></Column>

                <Column field="transferTxHash" header="TransferTx" className="link" body={(data) => (
                    handleTxLink(data.transferTxHash, chainId == MUMBAI_CHAIN_ID ? MUMBAI_CHAIN_ID : GOERLI_CHAIN_ID)
                )}> 
                </Column>

                <Column field="claimTxHash" header="ClaimTx" className="link" body={(data) => (
                    handleTxLink(data.claimTxHash, chainId == MUMBAI_CHAIN_ID ? GOERLI_CHAIN_ID : MUMBAI_CHAIN_ID)
                )}></Column>
            </DataTable>
            )}

            {(claimMetaMaskLoading || unlockMetaMaskLoading) && (
                <Card className="claim-loading-card">
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="2" fill="var(--surface-ground)" animationDuration=".5s" />
                </Card>
            )}

            {isUnlockLoading && (
                <Card className="claim-loading-card">
                    <PendingTX txHash={txHashUnlock} />
                </Card>
            )}

            {isClaimLoading && (
                <Card className="claim-loading-card">
                    <PendingTX txHash={txHashClaim} />
                </Card>
            )}
        </div>
    );
};

export default ClaimContainer;
