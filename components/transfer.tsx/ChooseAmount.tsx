import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

type Props = {
    amount: string;
    setAmount: any;
};

const ChooseAmount = ({amount, setAmount}: Props) => {
    const { account, library, chainId } = useWeb3React<Web3Provider>();

    const handleAmountToken = (event) => {
        const amount = event.target.value;
        if (!amount || amount.match(/^\d{1,}(\.\d{0,5})?$/)) {
            setAmount(event.target.value);
        }
    }

    return (
        <div className="results-form">
            <label>Choose amount:</label>
            <input onChange={(e) => handleAmountToken(e)} value={amount || ""} type="text" name="token_amount" />
        </div>
    );
};

export default ChooseAmount;