type SolayerSendResponse = {
    result: string;
};

const sendSolayerTx = async (signedTxbase58: string): Promise<SolayerSendResponse> => {
    const body = JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "sendTransaction",
        params: [
            signedTxbase58,
            {
                encoding: "base58",
                skipPreflight: true,
                preflightCommitment: "processed",
                maxRetries: 0,
            },
        ],
    });

    let res;
    try {
        res = await fetch("https://acc.solayer.org", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body,
        });
    } catch (error) {
        console.error("TX Error:", error);
        throw error;
    }

    if (!res.ok) {
        throw new Error(`Solayer returned HTTP ${res.status} ${res.statusText}`);
    }

    const data = await res.json() as { result?: string; error?: { message?: string } };
    console.log("TX Response:", data);

    if (data.error) {
        throw new Error(`Solayer rejected the transaction: ${data.error.message ?? JSON.stringify(data.error)}`);
    }
    if (!data.result) {
        throw new Error("Solayer returned no signature");
    }

    return { result: data.result };
};

export {
    sendSolayerTx
}
