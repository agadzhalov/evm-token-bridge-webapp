import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { InputText } from 'primereact/inputtext';

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
            <div className="p-fluid grid">
                <div className="field col-12">
                    <span className="p-float-label">
                        <InputText id="in" value={amount || ""} onChange={(e) => handleAmountToken(e)} />
                        <label htmlFor="in">Choose amount*</label>
                    </span></div>
            </div>
        </div>
    );
};

export default ChooseAmount;