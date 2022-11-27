import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { EthereumBridge } from "../../contracts/types";
import useApproveToken from "../../hooks/useApproveToken";
import useEthereumBridge from "../../hooks/useEthereumBridge";
import useTokenBalance from "../../hooks/useTokenBalance";
import useTokenContract from "../../hooks/useTokenContract";
import PendingTX from "../view/PendingTX";

type Contract = {
    account: any;
    tokenAddress: string;
    bridgeAddress: string;
};

const EthereumToken = ({ account, tokenAddress, bridgeAddress }: Contract) => {
    const contract = useTokenContract(tokenAddress);
    const { data } = useTokenBalance(account, tokenAddress);

    const [amount, setAmount] = useState<string | undefined>();
    const [transferDisable, setTransferDisable] = useState<boolean | undefined>(false);
    const { approveToken, getAllowance, isLoading: isApproveLoading, txHash: approveTx } = useApproveToken(contract, bridgeAddress, account);
    const { depositERC20, txHash: depositTxHash, isLoading: depositIsLoaidng, error: depositError } = useEthereumBridge(bridgeAddress);
    const [tokenName, setTokenName] = useState<string | undefined>();
    const isValid = data !== undefined;
    
    useEffect(() => {
        checkTransferDisable();

        const fetchTokenName = async() => {
            setTokenName(await contract.name());
        }
        fetchTokenName();

        contract.on('Approval', (account, bridgeAddress, formatAmount) => {
            checkTransferDisable();
        });
    }, [isValid, tokenName])
    
    const checkTransferDisable = async() => {
        if (isValid) {
            const tokenAllowance = await getAllowance();
            if (ethers.BigNumber.from(tokenAllowance).abs().gt(0)) {
                setTransferDisable(false);
            } else {
                setTransferDisable(true);
            }
        }
        
    }

    const stateAmountToken = (input) => {
        const amount = input.target.value;
        if (!amount || amount.match(/^\d{1,}(\.\d{0,5})?$/)) {
            setAmount(input.target.value)
        }
    }

    const handleOnMax = () => {
        setAmount(ethers.utils.formatEther(data));
    }

    const wei = (weiAmount: string): string => {
        return weiAmount !== undefined && weiAmount.length > 0 ? ethers.utils.parseUnits(weiAmount.toString(), "ether").toString() : null;
    }

    const transfer = async() => {
        const name = await contract.name();
        const symbol = await contract.symbol();
        depositERC20(account, tokenAddress, name, symbol, wei(amount));
        setAmount("");
    }

    return (
        <div className="results-form">
            <div className="info">
                { !isValid && ("Invalid ERC20 address") }
            </div>
            { isValid && !depositIsLoaidng && (
                <div className="amount-section">
                    <form>
                        <table>
                            <tbody>
                            <tr><td>{ (tokenName + " " + ethers.utils.formatEther(data) + " tokens") }</td></tr>
                            <tr>
                                <td>Choose amount:</td>
                                <td><input onChange={stateAmountToken} value={amount || ""} type="text" name="token_amount" /></td>
                                <td><input type="button" value="MAX" onClick={() => handleOnMax()} /></td>
                                <td>{wei(amount)}</td>
                            </tr>
                            </tbody>
                        </table>
                    </form>
                    {!isApproveLoading && (
                    <div className="buttons">
                        <input type="button" value="Approve" onClick={() => approveToken(wei(amount))} />
                        <input type="button" value="Transfer" onClick={() => transfer()} disabled={transferDisable} /><br/>
                    </div>
                    )}
                    {isApproveLoading && (<PendingTX txHash={approveTx} />)}
                </div>
            )}
            {depositIsLoaidng && (<PendingTX txHash={depositTxHash} />)}
            
        </div>
    );
};

export default EthereumToken;