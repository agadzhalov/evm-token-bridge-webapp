import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useEffect, useState } from "react";
import { injected, walletConnect } from "../connectors";
import useENSName from "../hooks/useENSName";
import useMetaMaskOnboarding from "../hooks/useMetaMaskOnboarding";
import { formatEtherscanLink, shortenHex } from "../util";
import { Button } from 'primereact/button';
import NativeCurrencyBalance from "./NativeCurrencyBalance";

type AccountProps = {
  triedToEagerConnect: boolean;
};

const Account = ({ triedToEagerConnect }: AccountProps) => {
  const { active, error, activate, deactivate, chainId, account, setError } =
    useWeb3React();

  const {
    isMetaMaskInstalled,
    isWeb3Available,
    startOnboarding,
    stopOnboarding,
  } = useMetaMaskOnboarding();

  // manage connecting state for injected connector
  const [connecting, setConnecting] = useState(false);
  useEffect(() => {
    if (active || error) {
      setConnecting(false);
      stopOnboarding();
    }
  }, [active, error, stopOnboarding]);

  const ENSName = useENSName(account);

  if (error) {
    return null;
  }

  if (!triedToEagerConnect) {
    return null;
  }

  if (typeof account !== "string") {
    return (
      <div>
        {isWeb3Available ? (
          <Button
            label={isMetaMaskInstalled ? "Connect to MetaMask" : "Connect to Wallet"}
            type="button" 
            className="mr-3 p-button-raised p-button-warning"
            disabled={connecting}
            onClick={() => {
              setConnecting(true);

              activate(injected, undefined, true).catch((error) => {
                // ignore the error if it's a user rejected request
                if (error instanceof UserRejectedRequestError) {
                  setConnecting(false);
                } else {
                  setError(error);
                }
              });
            }}
          />
          
        ) : (
          <Button
            label="Install Metamask"
            type="button" 
            className="mr-3 p-button-raised p-button-warning"
            disabled={connecting}
            onClick={startOnboarding}
          />
        )}
        {(<Button 
            label="Wallet Connect" 
            type="button" 
            className="p-button-outlined" 
            onClick={async () => {
              try {
                await activate(walletConnect(), undefined, true)
              } catch (e) {
                if (error instanceof UserRejectedRequestError) {
                  setConnecting(false);
                } else {
                  setError(error);
                }
              }
            }} />)
        }
      </div>
    );
  }

  return (
    <>
        <a
      {...{
        href: formatEtherscanLink("Account", [chainId, account]),
        target: "_blank",
        rel: "noopener noreferrer",
      }}
    >
      {ENSName || `${shortenHex(account, 4)}`}
    </a>
    <NativeCurrencyBalance />
    <Button 
      label="Disconnect" 
      className="p-button-raised p-button-danger"
      icon="pi pi-sign-out"
      onClick={async () => {
        try {
          await deactivate()
        } catch (e) { 
          setError(error);
        }
      }} />
    </>
   
    
  );
};

export default Account;