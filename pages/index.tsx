import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Link from "next/link";
import Account from "../components/Account";
import useEagerConnect from "../hooks/useEagerConnect";
import { useRouter } from 'next/router'
import { Button } from 'primereact/button';

function Home() {
    const router = useRouter();
  const { account, library, chainId } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;

  const href = () => {
    router.push("/transfer");
  }

    return (
        <div>
            <Head>
                <title>EVM Token Bridge</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header>
                <nav>
                <Link href="/">
                    <a>EVM Token Bridge</a>
                </Link>
                {isConnected && (<Account triedToEagerConnect={triedToEagerConnect} />)}
                </nav>
            </header>

            <main>
                <div className="grid grid-nogutter surface-0 text-800">
                    <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
                        <section>
                            <span className="block text-6xl font-bold mb-1">EVM Token Bridge</span>
                            <div className="text-6xl text-primary font-bold mb-3">Transfers ERC20 tokens from source blockchain network to target network</div>
                            <p className="mt-0 mb-4 text-700 line-height-3">Final project for LimeAcademy</p>

                            {!isConnected && (<Account triedToEagerConnect={triedToEagerConnect} />)}
                            {isConnected && (
                                <Button
                                    className="p-button-raised p-button-primary"
                                    label="Start Bridging"
                                    onClick={href} />
                            )}
                        </section>
                    </div>
                    <div className="col-12 md:col-6 overflow-hidden">
                        <img src="assets/images/bridge.jpg" alt="hero-1" className="md:ml-auto block md:h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
                    </div>
                </div>
            </main>
        </div>
  );
}

export default Home;