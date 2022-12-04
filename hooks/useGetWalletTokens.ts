import { useState } from "react";
import { BaseToken, ERC20, EthereumBridge } from "../contracts/types";
import { Alchemy, Network } from "alchemy-sdk";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { shortenHex } from "../util";

const CONFIG_GOERLI = {
    // use dotenv here
    apiKey: "b3s6jS5xYcnRbWxRrN1K80kVJ2a-4_wx",
    network: Network.ETH_GOERLI,
};

const CONFIG_MUMBAI = {
    // use dotenv here
    apiKey: "ZhLwXT7BdKlOFTLcDbA1zzju9mhDbd_U",
    network: Network.MATIC_MUMBAI
}

const useGetWalletTokens = () => {
    const [isLoadingTokens, setIsLoadingTokens] = useState<boolean | undefined>();
    const { account, chainId } = useWeb3React<Web3Provider>();

    const alchemy = new Alchemy(chainId == 5 ? CONFIG_GOERLI : chainId == 80001 ? CONFIG_MUMBAI : null);

    const getTokens = async () => {
        setIsLoadingTokens(true);
        const balances = await alchemy.core.getTokenBalances(account);
        const nonZeroBalances = balances.tokenBalances.filter((token) => {
            return token.tokenBalance !== "0";
        });
        const tokens = [];
        for (let token of nonZeroBalances) {
            // Get balance of token
            let balance = token.tokenBalance;

            // Get metadata of token
            const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);

            // // Compute token balance in human-readable format

            // Print name, balance, and symbol of token
            tokens.push({
                name: metadata.name + " | " + metadata.symbol + " | " + shortenHex(token.contractAddress, 4) + " | " + ethers.utils.formatEther(balance),
                value: token.contractAddress
            })
        }
        setIsLoadingTokens(false);
        return tokens;
    }
    
    
    return { getTokens, isLoadingTokens };
}

export default useGetWalletTokens;