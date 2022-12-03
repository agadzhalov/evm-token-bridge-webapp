import { ethers } from "ethers";

const usePermitSignature = () => {
    const getPermitSignature = async (signer: any, token: any, spender: any, value: any, deadline: any) => {
        const [nonce, name, version, chainId] = await Promise.all([
            token.nonces(signer.getAddress()),
            token.name(),
            "1",
            signer.getChainId(),
        ])

        return ethers.utils.splitSignature(
            await signer._signTypedData(
                {
                    name,
                    version,
                    chainId,
                    verifyingContract: token.address,
                },
                {
                    Permit: [
                        {
                            name: "owner",
                            type: "address",
                        },
                        {
                            name: "spender",
                            type: "address",
                        },
                        {
                            name: "value",
                            type: "uint256",
                        },
                        {
                            name: "nonce",
                            type: "uint256",
                        },
                        {
                            name: "deadline",
                            type: "uint256",
                        },
                    ],
                },
                {
                    owner: await signer.getAddress(),
                    spender,
                    value,
                    nonce,
                    deadline,
                }
            )
        )
    }

    return { getPermitSignature };
}

export default usePermitSignature;