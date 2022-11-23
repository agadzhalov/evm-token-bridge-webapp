import { ethers } from "ethers";
import ClaimTableRow from "./view/ClaimTableRow";

const ClaimView = () => {
    const claimData = JSON.parse(localStorage.getItem("transferToken"));
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
                {claimData.map(data => {
                    return (
                    <tr>
                        <td>{data.from}</td>
                        <td>{data.to}</td>
                        <td><ClaimTableRow tokenAddress={data.token} /></td>
                        <td>{ethers.utils.formatEther(data.amount)}</td>
                        <td><input type="button" value="Claim" /></td>
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
