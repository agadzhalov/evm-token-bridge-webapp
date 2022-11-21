import { useWeb3React } from "@web3-react/core";
import { formatEtherscanLink } from "../../util";

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
            href: formatEtherscanLink("Transaction", [chainId, txHash]),
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
