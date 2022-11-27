import { useWeb3React } from "@web3-react/core";
import { formatEtherscanLink, formatPolygonscanLink } from "../../util";

type PendingTXProps = {
  txHash: string;
};

const PendingTX = ({txHash} : PendingTXProps) => {
  const { chainId } = useWeb3React();

  return (
    <div>
      { txHash && (
        <div>
          <h1>TX is pending</h1>
          <p>
          <a
          {...{
            // @TODO works properly for Goerli and Mumbai ONLY (hardcoded for Mumbai because of else)
            href: chainId == 5 ? formatEtherscanLink("Transaction", [chainId, txHash]) : formatPolygonscanLink("Transaction", [chainId, txHash]),
            target: "_blank",
            rel: "noopener noreferrer",
          }}
          >
            {txHash}
          </a>
          </p>
        </div>
      ) }
    </div>
  );
};

export default PendingTX;
