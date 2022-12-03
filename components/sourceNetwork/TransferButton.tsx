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

type Props = {
    name: string;
    symbol: string;
    amount: string;
    setAmount: any;
    networkToBridgeId: number;
    tokenAddress: string;
    depositERC20: any;
};

const TransferButton = ({name, symbol, amount, setAmount, networkToBridgeId, tokenAddress, depositERC20}: Props) => {
    const { account, library, chainId } = useWeb3React<Web3Provider>();

    const transfer = async() => {
        depositERC20(networkToBridgeId, account, tokenAddress, name, symbol, wei(amount));
        setAmount("");
    }

    const wei = (weiAmount: string): string => {
        return weiAmount !== undefined && weiAmount.length > 0 ? ethers.utils.parseUnits(weiAmount.toString(), "ether").toString() : null;
    }

    return (
        <div className="results-form">
            <input type="button" value="Trasnfer" onClick={() => transfer()} />
        </div>
    );
};

export default TransferButton;
