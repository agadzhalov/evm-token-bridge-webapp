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
import { useRouter } from 'next/router'
import { Button } from 'primereact/button';

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