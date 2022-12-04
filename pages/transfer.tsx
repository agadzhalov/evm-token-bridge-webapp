import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Menu from "../components/Menu";
import TransferContainer from "../components/transfer/TransferContainer";
import SwitchNetwork from "../components/SwitchNetwork";
import Header from "../components/Header";

function Transfer() {
  const { account, library, chainId } = useWeb3React();

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
            <Menu index={1} />
            <SwitchNetwork />
            <TransferContainer />
          </section>
        )}
      </main>
    </div>
  );
}

export default Transfer;
