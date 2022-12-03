import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Link from "next/link";
import Account from "../components/Account";
import Menu from "../components/Menu";
import NativeCurrencyBalance from "../components/NativeCurrencyBalance";
import SwitchNetwork from "../components/SwitchNetwork";
import { ETHEREUM_BRIDGE_GOERLI, POLYGON_BRIDGE_MUMBAI } from "../constants";
import useEagerConnect from "../hooks/useEagerConnect";
import ClaimContainer from "../components/claim/ClaimContainer";
import Header from "../components/Header";

function Claim() {
  const { account, library, chainId } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;
  return (
    <div>
      <Head>
        <title>EVM Token Bridge</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
              
        {isConnected && (
          <section>
            <NativeCurrencyBalance />
            <Menu page="Claim" />
            <SwitchNetwork />
            <ClaimContainer />
          </section>
        )}
      </main>

      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-between;
        }

        main {
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default Claim;
