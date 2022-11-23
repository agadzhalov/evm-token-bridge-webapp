import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useTokenContract from "../../hooks/useTokenContract";
import { formatEtherscanLink, shortenHex } from "../../util";

type Props = {
    tokenAddress?: any;
};

const ClaimTableRow = ({ tokenAddress }: Props) => {
    const contract = useTokenContract(tokenAddress);
    const { chainId } = useWeb3React();
    const[tokenSymbol, setTokenSymbol] = useState<string | undefined>();
    
    useEffect(() => {
        const fetchTokenSymbol = async() => {
            setTokenSymbol(await contract.symbol());
        }
        fetchTokenSymbol();
    }, [tokenSymbol])

    return (
        <>
        {tokenSymbol + " | " + shortenHex(tokenAddress, 4)}
        </>
    );
};

export default ClaimTableRow;
