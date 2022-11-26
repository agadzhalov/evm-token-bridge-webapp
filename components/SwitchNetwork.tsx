import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";

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

    return (
        <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
            <main className="mt-4 p-4">
                <p>
                    Current: <b>{ chainId == 5 ? "Goerli" : chainId == 80001 ? "Mumbai" : "Error" }</b>
                </p>
                <div className="mt-4">
                <button
                        onClick={() => handleNetworkSwitch(chainId == 5 ? 80001 : chainId == 80001 ? 5 : 0)}
                        className="mt-2 mb-2 bg-warning border-warning btn submit-button focus:ring focus:outline-none w-full"
                    >
                        Switch to { chainId == 5 ? "Mumbai" : chainId == 80001 ? "Goerli" : "Error" }
                    </button>
                </div>
            </main>
        </div>
    );
}
