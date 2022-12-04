import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { GOERLI_CHAIN_ID, MUMBAI_CHAIN_ID } from "../../constants/networks";
import { Dropdown } from 'primereact/dropdown';

type Props = {
    networkToBridge: number;
    handleChooseNetwork: any;
};

const ChooseNetwork = ({ networkToBridge, handleChooseNetwork }: Props) => {
    const { account, library, chainId } = useWeb3React<Web3Provider>();
    
    const networks = [
        {label: "goerli", value: GOERLI_CHAIN_ID, disabled: chainId === GOERLI_CHAIN_ID },
        {label: "mumbai", value: MUMBAI_CHAIN_ID, disabled: chainId === MUMBAI_CHAIN_ID }
    ]

    useEffect(() => {
        handleChooseNetwork(chainId == GOERLI_CHAIN_ID ? MUMBAI_CHAIN_ID : chainId == MUMBAI_CHAIN_ID ? GOERLI_CHAIN_ID : null);
    }, [chainId])

    return (
        <div className="results-form">
            <div className="p-fluid grid">
                <div className="field col-12">
                    <span className="p-float-label">
                        <Dropdown 
                            inputId="dropdown" 
                            value={networkToBridge} 
                            optionLabel="label" 
                            options={networks} 
                            onChange={(e) => handleChooseNetwork(e.target.value)} />
                        <label htmlFor="dropdown">Choose network to bridge to*</label>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChooseNetwork;
