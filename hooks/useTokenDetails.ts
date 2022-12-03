import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";

export default function useTokenDetails<T extends Contract = Contract>(
  address: string,
  ABI: any
) {
  const { library, account, chainId } = useWeb3React();
  const [name, setName] = useState<string | undefined>();
  const [symbol, setSymbol] = useState<string | undefined>();
  const [balance, setBalance] = useState<string | undefined>();

    useEffect(() => {
        if (!address || !ABI || !library || !chainId) {
            return null;
        }

        try {
            const retrieveConractInfo = async () => {
                if (ethers.utils.isAddress(address) && await library.getCode(address) != "0x") {
                    const contract = new Contract(address, ABI, library.getSigner(account));
                    setName(await contract.name());
                    setSymbol(await contract.symbol());
                    setBalance(await contract.balanceOf(account));
                } else {
                  setName(undefined);
                  setSymbol(undefined);
                  setBalance(undefined);
                }
            }
            retrieveConractInfo();
        } catch (error) {
            console.error("Failed To Get Contract", error);
            return null;
        }
    }, [address]);

  return {name, symbol, balance};

}
