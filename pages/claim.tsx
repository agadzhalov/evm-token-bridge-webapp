import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Link from "next/link";
import Account from "../components/Account";
import PolygonClaimView from "../components/polygon/PolygonClaimView";
import EthereumNetwork from "../components/ethereum/EthereumNetwork";
import Menu from "../components/Menu";
import NativeCurrencyBalance from "../components/NativeCurrencyBalance";
import SwitchNetwork from "../components/SwitchNetwork";
import { ETHEREUM_BRIDGE_GOERLI, POLYGON_BRIDGE_MUMBAI } from "../constants";
import useEagerConnect from "../hooks/useEagerConnect";
import EthereumClaimView from "../components/ethereum/EthereumClaimView";

function Claim() {
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
            <Menu page="Claim" />
            <SwitchNetwork />
            {chainId == 5 && (<EthereumClaimView bridgeAddress={ETHEREUM_BRIDGE_GOERLI} />)}
            {chainId == 80001 && (<PolygonClaimView bridgeAddress={POLYGON_BRIDGE_MUMBAI} />)}
            
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
