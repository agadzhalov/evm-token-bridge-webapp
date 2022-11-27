import ETHEREUM_BRIDGE_ABI from "../contracts/EthereumBridge.json";
import type { Bridge, EthereumBridge } from "../contracts/types";
import useContract from "./useContract";

export default function useEthereumBridgeContract(contractAddress?: string) {
  return useContract<EthereumBridge>(contractAddress, ETHEREUM_BRIDGE_ABI);
}
