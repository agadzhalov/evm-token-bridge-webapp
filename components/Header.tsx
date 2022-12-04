import { useWeb3React } from "@web3-react/core";
import Link from "next/link";
import Account from "../components/Account";
import useEagerConnect from "../hooks/useEagerConnect";

function Header() {
    const { account, library, chainId } = useWeb3React();
    const triedToEagerConnect = useEagerConnect();
    const isConnected = typeof account === "string" && !!library;

    return (
        <header>
            <nav>
                <Link href="/">
                    <a>EVM Token Bridge</a>
                </Link>
                <Account triedToEagerConnect={triedToEagerConnect} />
            </nav>
        </header>
    );
}

export default Header;