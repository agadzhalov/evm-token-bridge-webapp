import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useEthereumBridge from "../../hooks/useEthereumBridge";
import { shortenHex } from "../../util";
import ClaimTableButton from "./ClaimTableButton";
import ClaimTableRow from "../view/ClaimTableRow";

type Props = {
    bridgeAddress: string;
}

const PolygonClaimView = ({bridgeAddress}: Props) => {
    const { account, library, chainId } = useWeb3React();
    const [claimData, setClaimData] = useState<any | undefined>();
    
    
    useEffect(() => {
        setClaimData(JSON.parse(localStorage.getItem("transferToken")));
        window.addEventListener('localStorageEvent', () => {
            setClaimData(JSON.parse(localStorage.getItem("transferToken")));
        });
    }, [])

    const getNetworkName = (chainId: any) => {
        return chainId == 5 ? "goerli" : chainId == 80001 ? "mumbai" : "Error";
    }

    return (
        <div className="results-form">
            <table>
                <thead>
                    <tr>
                        <th>from</th>
                        <th>to</th>
                        <th>token</th>
                        <th>amount</th>
                        <th>action</th>
                    </tr>
                </thead>
                <tbody>
                {claimData && claimData.filter(data => data.to == getNetworkName(chainId)).map((data, index) => {
                    return (
                    <tr key={index}>
                        <td>{data.from}</td>
                        <td>{data.to}</td>
                        <td>{data.symbol ? "W" + data.symbol : "----"} | {shortenHex(data.token, 4)}</td>
                        <td>{ethers.utils.formatEther(data.amount)}</td>
                        <td><ClaimTableButton bridgeAddress={bridgeAddress} tokenAddress={data.token} account={account} data={data} /></td>
                    </tr>
                    )
                })}
                </tbody>
            </table>
            <style jsx>{`
            .results-form {
                width: 50%;
                margin: 0 auto;
            }
        `}</style>
        </div>
    );
};

export default PolygonClaimView;
