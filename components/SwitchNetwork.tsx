import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { GOERLI_CHAIN_ID, MUMBAI_CHAIN_ID } from "../constants/networks";

const networks = {
    polygon: {
        chainId: `0x${Number(137).toString(16)}`,
        chainName: "Polygon Mainnet",
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
        },
        rpcUrls: ["https://polygon-rpc.com/"],
        blockExplorerUrls: ["https://polygonscan.com/"]
    },
    bsc: {
        chainId: `0x${Number(5).toString(16)}`,
        chainName: "Goerli test network",
        nativeCurrency: {
            name: "GoerliETH",
            symbol: "GoerliETH",
            decimals: 18
        },
        rpcUrls: [
            "https://goerli.infura.io/v3/",
        ],
        blockExplorerUrls: ["https://goerli.etherscan.io"]
    }
};

export default function SwitchNetwork() {
    const { account, library, chainId } = useWeb3React<Web3Provider>();
    const [error, setError] = useState();

    const handleNetworkSwitch = async (networkName) => {
        try {
            if (!library) throw new Error("No crypto wallet found");
    
            await library.provider.request({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: `0x${Number(networkName).toString(16)}`
                    }
                ]
            });
        } catch (err) {
            setError(err.message);
        }
    };

    const networkChanged = (chainId) => {
        console.log({ chainId });
    };

    useEffect(() => {
        library.on("chainChanged", networkChanged);

        return () => {
            library.removeListener("chainChanged", networkChanged);
        };
    }, []);

    const currentNetwork = () => {
        const network = chainId == 5 ? "Goerli" : chainId == 80001 ? "Mumbai" : "Error";
        return "Current is " + network;
    }

    const switchToNework = () => {
        const network = chainId == 5 ? "Mumbai" : chainId == 80001 ? "Goerli" : "Error";
        return "Switch to " + network;
    }

    return (
        <Card title={currentNetwork()} style={{ marginBottom: '2em' }}>
            <Button
                className="p-button-raised p-button-rounded"
                icon="pi pi-arrows-h"
                label={switchToNework()}
                onClick={() => handleNetworkSwitch(chainId == GOERLI_CHAIN_ID ? MUMBAI_CHAIN_ID : chainId == MUMBAI_CHAIN_ID ? GOERLI_CHAIN_ID : 0)} />
        </Card>
    );
}
