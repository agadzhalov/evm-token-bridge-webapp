import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Link from "next/link";
import Account from "../components/Account";
import Menu from "../components/Menu";
import NativeCurrencyBalance from "../components/NativeCurrencyBalance";
import TransferContainer from "../components/transfer/TransferContainer";
import SwitchNetwork from "../components/SwitchNetwork";
import TokenBalance from "../components/TokenBalance";
import { ALBT_TOKEN_ADDRESS, ETHEREUM_BRIDGE_GOERLI, ETHEREUM_TOKEN_BRIDGE, POLYGON_BRIDGE_MUMBAI, US_ELECTION_ADDRESS } from "../constants";
import { GOERLI_CHAIN_ID, MUMBAI_CHAIN_ID } from "../constants/networks";
import useEagerConnect from "../hooks/useEagerConnect";
import { Button } from 'primereact/button';

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

          
        </nav>
      </header>

      <main>
              <div className="grid grid-nogutter surface-0 text-800">
                  <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
                      <section>
                          <span className="block text-6xl font-bold mb-1">EVM Token Bridge</span>
                          <div className="text-6xl text-primary font-bold mb-3">Transfers ERC20 tokens from source blockchain network to target network</div>
                          <p className="mt-0 mb-4 text-700 line-height-3">Final project for LimeAcademy</p>

                          <Account triedToEagerConnect={triedToEagerConnect} />
                      </section>
                  </div>
                  <div className="col-12 md:col-6 overflow-hidden">
                      <img src="assets/images/bridge.jpg" alt="hero-1" className="md:ml-auto block md:h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
                  </div>
              </div>
        {isConnected && (
          <section>
            <NativeCurrencyBalance />
            <Menu page="Transfer" />
            <SwitchNetwork />
          </section>
        )}
      </main>
    </div>
  );
}

export default Home;