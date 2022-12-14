import { Web3ReactProvider } from "@web3-react/core";
import type { AppProps } from "next/app";
import { StyleClass } from 'primereact/styleclass';
import getLibrary from "../getLibrary";
import "../styles/globals.css";
import "../components/transfer/Transfer.scss"
import "../components/claim/ClaimContainer.scss"
import "primereact/resources/themes/lara-light-teal/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                
import "primeflex/primeflex.css";

function NextWeb3App({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Component {...pageProps} />
    </Web3ReactProvider>
  );
}

export default NextWeb3App;
