import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useGetWalletTokens from "../../hooks/useGetWalletTokens";
import { shortenHex } from "../../util";
import ChooseNetwork from "./ChooseNetwork";

const TransferContainer = () => {
    const [networkToBridge, setNetworkToBridge] = useState<any | undefined>();
    
    return (
        <div className="results-form">
            {networkToBridge}
            <ChooseNetwork networkToBridge={networkToBridge} handleChooseNetwork={(networkToBridge) => setNetworkToBridge(networkToBridge) } />
        </div>
    );
};

export default TransferContainer;
