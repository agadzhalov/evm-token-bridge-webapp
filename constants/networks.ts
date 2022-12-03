export const GOERLI_CHAIN_ID = 5;
export const MUMBAI_CHAIN_ID = 80001;

export const getNetworkName = (chainId: any) => {
    return chainId == GOERLI_CHAIN_ID ? "goerli" : chainId == MUMBAI_CHAIN_ID ? "mumbai" : "Error";
}
