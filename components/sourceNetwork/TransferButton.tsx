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
};

const TransferButton = ({name, symbol}: Props) => {
    const { account, library, chainId } = useWeb3React<Web3Provider>();

    const transfer = async() => {
        console.log(name, symbol)
    }

    return (
        <div className="results-form">
            <input type="button" value="Trasnfer" onClick={() => transfer()} />
        </div>
    );
};

export default TransferButton;
