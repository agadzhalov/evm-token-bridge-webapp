import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useEthereumBridge from "../hooks/useEthereumBridge";
import ClaimTableRow from "./view/ClaimTableRow";

type Props = {
    bridgeAddress: string;
}

const ClaimView = ({bridgeAddress}: Props) => {
    const { account, library } = useWeb3React();

    const { claimTokens } = useEthereumBridge(bridgeAddress);
    const [claimData, setClaimData] = useState<any | undefined>();
    
    useEffect(() => {
        setClaimData(JSON.parse(localStorage.getItem("transferToken")));
        window.addEventListener('localStorageEvent', () => {
            setClaimData(JSON.parse(localStorage.getItem("transferToken")));
        });
    }, [])

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
                {claimData && claimData.map((data, index) => {
                    return (
                    <tr key={index}>
                        <td>{data.from}</td>
                        <td>{data.to}</td>
                        <td><ClaimTableRow tokenAddress={data.token} /></td>
                        <td>{ethers.utils.formatEther(data.amount)}</td>
                        <td><input type="button" value="Claim" onClick={() => claimTokens(data.id, account, data.token, data.amount)} disabled={data.claimed} /></td>
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

export default ClaimView;
