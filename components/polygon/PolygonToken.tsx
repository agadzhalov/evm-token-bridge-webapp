import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { EthereumBridge } from "../../contracts/types";
import useEthereumBridge from "../../hooks/useEthereumBridge";
import usePolygonBridge from "../../hooks/usePolygonBridge";
import useTokenBalance from "../../hooks/useTokenBalance";
import useTokenContract from "../../hooks/useTokenContract";
import PendingTX from "../view/PendingTX";

type Contract = {
    account: any;
    tokenAddress: string;
    bridgeAddress: string;
    networkToBridgeId: number;
};

const PolygonToken = ({ account, tokenAddress, bridgeAddress, networkToBridgeId }: Contract) => {
    const contract = useTokenContract(tokenAddress);
    const { data } = useTokenBalance(account, tokenAddress);
    const { sendERC20, isSendLoading, txHashSend, sendError } = usePolygonBridge(bridgeAddress);

    const { library, chainId } = useWeb3React<Web3Provider>();

    const [isTokenValid, setTokenValid] = useState<boolean | undefined>();
    const [amount, setAmount] = useState<string | undefined>();
    const [tokenName, setTokenName] = useState<string | undefined>();
    const [tokenSymbol, setTokenSymbol] = useState<string | undefined>();

    useEffect(() => {
        const fetchIsTokenValid = async() => {
            const code = await library.getCode(tokenAddress);
            setTokenValid(code != "0x" ? true : false);
        }
        fetchIsTokenValid();

        const fetchTokenNameAndSymbol = async() => {
            setTokenName(await contract.name());
            setTokenSymbol(await contract.symbol());
        }
        fetchTokenNameAndSymbol();

    }, [tokenName])
    
    const sendTokens = async() => {
        await sendERC20(account, tokenAddress, tokenName, tokenSymbol, wei(amount), networkToBridgeId);
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

    return (
        <div className="results-form">
            { !isSendLoading && isTokenValid && data && (
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
                    <div className="buttons">
                        <input type="button" value="Send" onClick={() => sendTokens()} />
                    </div>
                </div>
            )}
            {isSendLoading && (<PendingTX txHash={txHashSend} />)}
        </div>
    );
};

export default PolygonToken;
