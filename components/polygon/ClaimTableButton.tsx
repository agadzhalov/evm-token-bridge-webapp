import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useEthereumBridge from "../../hooks/useEthereumBridge";
import usePolygonBridge from "../../hooks/usePolygonBridge";
import useTokenContract from "../../hooks/useTokenContract";
import { formatEtherscanLink, shortenHex } from "../../util";

type Props = {
    tokenAddress?: any;
    bridgeAddress?: any;
    account: any;
    data: any;
};

const ClaimTableButton = ({ tokenAddress, bridgeAddress, account, data }: Props) => {
    const { claimTokens } = usePolygonBridge(bridgeAddress);

    return (
        <>
        <input type="button" value="Claim" onClick={() => claimTokens(data.id, account, data.token, data.amount, data.name, data.symbol)} disabled={data.claimed} />
        </>
    );
};

export default ClaimTableButton;
