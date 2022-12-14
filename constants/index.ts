
export interface Networks {
  [key: number]: string;
}
export const walletConnectSupportedNetworks: Networks = {
  // Add your network rpc URL here
  1: "https://ethereumnode.defiterm.io",
  3: "https://ethereumnode.defiterm-dev.net",
  5: "https://eth-goerli.g.alchemy.com/v2/b3s6jS5xYcnRbWxRrN1K80kVJ2a-4_wx",
  137: "https://polygon-rpc.com",
  31337: "http://127.0.0.1:8545",
  80001: "https://polygon-mumbai.g.alchemy.com/v2/ZhLwXT7BdKlOFTLcDbA1zzju9mhDbd_U"
};

// Network chain ids
export const supportedMetamaskNetworks = [1, 3, 4, 5, 42, 137, 31337, 80001];

export const ETHEREUM_TOKEN_BRIDGE = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export const ETHEREUM_BRIDGE_GOERLI = "0x2759a3c726cB59b70bb4B80C73bE20Aa3Dd125C0";
export const POLYGON_BRIDGE_MUMBAI = "0x6DeFf377FA433F879d2cfDA5F169352b1e4335DD";