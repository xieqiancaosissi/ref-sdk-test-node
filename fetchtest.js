// import fetch from "node-fetch";
import axios from "axios";
import {
    fetchAllPools,
    getConfig,
    ftGetTokenMetadata,
    estimateSwap,
    getStablePools,
    getSignedTransactionsByMemoryKey,
    getExpectedOutputFromSwapTodos,
    sendTransactionsByMemoryKey,
} from "@ref_finance/ref-sdk";

import HttpsProxyAgent from "https-proxy-agent";
const proxyAgent = new HttpsProxyAgent("http://127.0.0.1:7890");

const listTokensUrl = getConfig().indexerUrl + "/list-token";

fetch(listTokensUrl, {
    method: "GET",
    headers: {
        "Content-type": "application/json; charset=UTF-8",
    },
    agent: proxyAgent,
}).then(async (res) => {
    console.log(await res.json());
});
