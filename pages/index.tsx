import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Link from "next/link";
import Account from "../components/Account";
import EthereumNetwork from "../components/ethereum/EthereumNetwork";
import Menu from "../components/Menu";
import NativeCurrencyBalance from "../components/NativeCurrencyBalance";
import PolygonNetwork from "../components/polygon/PolygonNetwork";
import TransferContainer from "../components/transfer.tsx/TransferContainer";
import SwitchNetwork from "../components/SwitchNetwork";
import TokenBalance from "../components/TokenBalance";
import USLibrary from "../components/USLibrary";
import { ALBT_TOKEN_ADDRESS, ETHEREUM_BRIDGE_GOERLI, ETHEREUM_TOKEN_BRIDGE, POLYGON_BRIDGE_MUMBAI, US_ELECTION_ADDRESS } from "../constants";
import { GOERLI_CHAIN_ID, MUMBAI_CHAIN_ID } from "../constants/networks";
import useEagerConnect from "../hooks/useEagerConnect";

function Home() {
  const { account, library, chainId } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;

  return (
    <div>
      <Head>
        <title>LimeAcademy-boilerplate</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <nav>
          <Link href="/">
            <a>LimeAcademy-boilerplate</a>
          </Link>

          <Account triedToEagerConnect={triedToEagerConnect} />
        </nav>
      </header>

      <main>
        
        {isConnected && (
          <section>
            <NativeCurrencyBalance />
            <Menu page="Transfer" />
            <SwitchNetwork />
            <TransferContainer />
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

export default Home;
