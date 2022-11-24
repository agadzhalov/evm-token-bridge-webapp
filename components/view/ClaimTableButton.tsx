import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useEthereumBridge from "../../hooks/useEthereumBridge";
import useTokenContract from "../../hooks/useTokenContract";
import { formatEtherscanLink, shortenHex } from "../../util";

type Props = {
    tokenAddress?: any;
    bridgeAddress?: any;
    account: any;
    data: any;
};

const ClaimTableButton = ({ tokenAddress, bridgeAddress, account, data }: Props) => {
    const contract = useTokenContract(tokenAddress);
    const { claimTokens } = useEthereumBridge(bridgeAddress);
    const { chainId } = useWeb3React();
    const[tokenSymbol, setTokenSymbol] = useState<string | undefined>();
    const[tokenName, setTokenName] = useState<string | undefined>();

    useEffect(() => {
        const fetchTokenSymbol = async() => {
            setTokenSymbol(await contract.symbol());
        }
        fetchTokenSymbol();

        const fetchTokenName = async() => {
            setTokenName(await contract.name());
        }
        fetchTokenName();
    }, [tokenSymbol, tokenName])

    return (
        <>
        {tokenName && tokenName && (
            <input type="button" value="Claim" onClick={() => claimTokens(data.id, account, data.token, data.amount, tokenName, tokenSymbol)} disabled={data.claimed} />
        )}
        </>
    );
};

export default ClaimTableButton;
