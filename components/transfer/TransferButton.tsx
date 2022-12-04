import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useCustomContract from "../../hooks/useTokenDetails";
import useGetWalletTokens from "../../hooks/useGetWalletTokens";
import useIsTokenValid from "../../hooks/useIsTokenValid";
import { shortenHex } from "../../util";
import ChooseNetwork from "./ChooseNetwork";
import ChooseToken from "./ChooseToken";
import ERC20_ABI from "../../contracts/ERC20.json";
import { GOERLI_CHAIN_ID, MUMBAI_CHAIN_ID } from "../../constants/networks";
import { Button } from 'primereact/button';

type Props = {
    name: string;
    symbol: string;
    amount: string;
    setAmount: any;
    networkToBridgeId: number;
    tokenAddress: string;
    depositERC20: any;
    sendERC20: any;
};

const TransferButton = ({
        name, 
        symbol, 
        amount, 
        setAmount, 
        networkToBridgeId, 
        tokenAddress, 
        depositERC20, 
        sendERC20
    }: Props) => {

    const { account, library, chainId } = useWeb3React<Web3Provider>();
    const buttonTitle = chainId == GOERLI_CHAIN_ID ? "Transfer" : chainId == MUMBAI_CHAIN_ID ? "Send" : "Unknown";

    useEffect(() => {
        setAmount("");
    }, [chainId])

    const handleOnClick = async() => {
        setAmount("");
        switch(chainId) {
            case GOERLI_CHAIN_ID:
                return depositERC20(networkToBridgeId, account, tokenAddress, name, symbol, wei(amount));
            case MUMBAI_CHAIN_ID:
                return sendERC20(account, tokenAddress, name, symbol, wei(amount), networkToBridgeId);
        }
    }

    const wei = (weiAmount: string): string => {
        return weiAmount !== undefined && weiAmount.length > 0 ? ethers.utils.parseUnits(weiAmount.toString(), "ether").toString() : null;
    }

    return (
        <div className="results-form">
            <Button
            label={buttonTitle}
            icon="pi pi-send"
            type="button" 
            className="mr-3 p-button-raised p-button-primary"
            disabled={!tokenAddress || !amount}
            onClick={() => handleOnClick()}
          />
        </div>
    );
};

export default TransferButton;
