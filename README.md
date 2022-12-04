# evm-token-bridge-webapp
EVM Token Bridge Web Application where users can Lock, Unlock and Claim their ERC20 tokens


## Installment
Make sure you are in the directory of the cloned project then
```bash
  npm install
```
## Contracts
You will need to have two deployed smart contracts in advance, one on Goerli testnet and one on Mumbai testnet. Add the addresses in `constants/index.ts` like this: 
```bash
export const ETHEREUM_BRIDGE_GOERLI = "0x2759a3c726cB59b70bb4B80C73bE20Aa3Dd125C0";
export const POLYGON_BRIDGE_MUMBAI = "0x6DeFf377FA433F879d2cfDA5F169352b1e4335DD";
```

## Mumbai wallet
Make sure you have added Mumbai network in advance to your wallet because implementation in the project is done with  `wallet_switchEthereumChain` instead of `wallet_addEthereumChain`. Feel free to contribute!

## API Keys
Replace the API keys for `api-goerli` and `api-goerli` in `hooks/useTxsHistory.ts` in `getApiKeyByNetwork()` like this: 

```javascript I'm A tab
switch(chainId) {
  case 5:
    return GOERL_API;
  case 80001: 
    return MUMBAI_API; 
```
This logic needs to be moved in webpack environment variables. Feel free to contribute!

## Run
To star this beautiful project execute: 
```bash
  npm run dev
```