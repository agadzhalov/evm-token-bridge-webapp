import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useEthereumBridge from "../../hooks/useEthereumBridge";
import { shortenHex } from "../../util";
import ClaimTableRow from "../view/ClaimTableRow";
import usePolygonBridge from "../../hooks/usePolygonBridge";
import PendingTX from "../view/PendingTX";

type Props = {
    bridgeAddress: string;
}

const EthereumClaimView = ({bridgeAddress}: Props) => {
    const { account, library, chainId } = useWeb3React();
    const { depositERC20, txHash: depositTxHash, isLoading: depositIsLoaidng, error: depositError } = useEthereumBridge(bridgeAddress);
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
            ethereum claim
            <style jsx>{`
            .results-form {
                width: 50%;
                margin: 0 auto;
            }
        `}</style>
        </div>
    );
};

export default EthereumClaimView;
