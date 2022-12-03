import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { GOERLI_CHAIN_ID, MUMBAI_CHAIN_ID } from "../../constants/networks";
import useGetWalletTokens from "../../hooks/useGetWalletTokens";
import { shortenHex } from "../../util";

type Props = {
    networkToBridge: number;
    handleChooseNetwork: any;
};

const ChooseNetwork = ({ networkToBridge, handleChooseNetwork }: Props) => {
    const { account, library, chainId } = useWeb3React<Web3Provider>();
    
    const networks = [
        {id: GOERLI_CHAIN_ID, name: "goerli"},
        {id: MUMBAI_CHAIN_ID, name: "mumbai"},
    ]

    useEffect(() => {
        handleChooseNetwork(MUMBAI_CHAIN_ID);
    }, [])

    return (
        <div className="results-form">
            <div className="network-to-bridge">
                <label>Choose network to bridge to</label>
                <select
                    value={networkToBridge}
                    onChange={(e) => handleChooseNetwork(e.target.value)}
                >
                    {networks.map((network, index) => {
                        return (<option value={network.id} key={index} disabled={ chainId === network.id }>
                            {network.name} 
                        </option>)
                    })}
                </select>
            </div>
        </div>
    );
};

export default ChooseNetwork;
