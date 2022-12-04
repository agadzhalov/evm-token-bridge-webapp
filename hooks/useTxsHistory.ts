import { useWeb3React } from "@web3-react/core";
import { GOERLI_CHAIN_ID, MUMBAI_CHAIN_ID } from "../constants/networks";

const useTxsHistory = () => {
    const { account, library, chainId } = useWeb3React();

    const getUrl = (): string => {
        const scan = getScanByNetworkId(chainId);
        const body = "api" +
        "?module=account" +
        "&action=txlist" +
        "&address=" + account +
        "&startblock=0" +
        "&endblock=99999999" +
        "&sort=desc" +
        "&apikey=" + getApiKeyByNetwork(chainId);
        const url = scan + body;
        return url;
    }

    const getApiKeyByNetwork = (chainId: number): string => {
        switch(chainId) {
            case GOERLI_CHAIN_ID:
                return "SVYXT4XWRYNRM64HZGE9B5E6D9RYPKK3YW"; //process.env.GOERLI_API_KEY - webpack nextjs config needed
            case MUMBAI_CHAIN_ID: 
                return "APGQID4FXH2KFZ4J57AW2YH4XEXSB3KI51"; //process.env.MUMBAI_API_KEY
        }     
    }

    const getScanByNetworkId = (chainId: number) : string => {
        switch(chainId) {
            case GOERLI_CHAIN_ID:
                return "https://api-goerli.etherscan.io/";
            case MUMBAI_CHAIN_ID: 
                return "https://api-mumbai.polygonscan.com/";
        }    
    }
    return { getUrl };
}

export default useTxsHistory;