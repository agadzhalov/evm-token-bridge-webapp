import POLYGON_BRIDGE_ABI from "../contracts/PolygonBridge.json";
import type { PolygonBridge } from "../contracts/types";
import useContract from "./useContract";

export default function usePolygonBridgeContract(contractAddress?: string) {
  return useContract<PolygonBridge>(contractAddress, POLYGON_BRIDGE_ABI);
}
