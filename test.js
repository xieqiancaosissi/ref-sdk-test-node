import {
  fetchAllPools,
  getConfig,
  ftGetTokenMetadata,
  estimateSwap,
  getStablePools,
  getSignedTransactionsByMemoryKey,
  getExpectedOutputFromSwapTodos,
  sendTransactionsByMemoryKey,
  getPool,
  getRatedPoolDetail,
} from "@ref_finance/ref-sdk";

import { instantSwap } from "@ref_finance/ref-sdk";
import fs from "fs";
process.env["NEAR_env"] = "testnet";

const tokenOutId = "wrap.testnet";

const tokenInId = "linear-protocol.testnet";

const amountIn = "0.01";

import fetch from "node-fetch";

console.log({
  config: getConfig(),
  indexerUrl: getConfig().indexerUrl,
});

// fetch(getConfig().indexerUrl + "/list-token", {
//     method: "GET",
//     headers: { "Content-type": "application/json; charset=UTF-8" },
// }).then(async (res) => {
//     console.log(await res.json());
// });

fs.readFile("pooldata.json", async (err, allPools) => {
  const { ratedPools, unRatedPools, simplePools } = JSON.parse(allPools);

  const stablePools = unRatedPools.concat(ratedPools);

  const stablePoolsDetail = await getStablePools(stablePools);

  //   console.log({
  //     stablePoolsDetail,
  //   });

  const tokenIn = await ftGetTokenMetadata(tokenInId);
  const tokenOut = await ftGetTokenMetadata(tokenOutId);

  const LINEAR_WNEAR_POOL_ID = 571;
  const refSlippageTolerance = 0.5;

  const [LINEAR_WNEAR_POOL, LINEAR_WNEAR_POOL_STABLE_POOL_DETAIL] = await Promise.all([
    getPool(LINEAR_WNEAR_POOL_ID),
    getRatedPoolDetail({
      id: LINEAR_WNEAR_POOL_ID,
    }),
  ]);

  try {
    const swapTodos = await estimateSwap({
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      amountIn: "0.01",
      simplePools: [LINEAR_WNEAR_POOL],
      options: {
        enableSmartRouting: false,
        stablePools: [LINEAR_WNEAR_POOL],
        stablePoolsDetail: [LINEAR_WNEAR_POOL_STABLE_POOL_DETAIL],
      },
    });

    console.log({
      swapTodos,
      p: swapTodos[0].pool,
      swapTodosEstimate: getExpectedOutputFromSwapTodos(swapTodos, tokenOut.id).toString(),
    });

    // const transactions = await instantSwap({
    //   tokenIn,
    //   tokenOut,
    //   amountIn,
    //   slippageTolerance: 0.5,
    //   swapTodos,
    //   AccountId: "juaner.testnet",
    // });

    // const signedTransactions = await getSignedTransactionsByMemoryKey({
    //   transactionsRef: transactions,
    //   AccountId: "juaner.testnet",
    //   keyPath: "/.near-credentials/testnet/juaner.testnet.json",
    // });

    // console.log({ signedTransactions });

    // const res = await sendTransactionsByMemoryKey({ signedTransactions });

    // console.log(res);
  } catch (error) {
    console.log(error);
  }
});

// fetchAllPools().then(async (allPools) => {
//     const { ratedPools, unRatedPools, simplePools } = allPools;

//     const stablePools = unRatedPools.concat(ratedPools);

//     const stablePoolsDetail = await getStablePools(stablePools);

//     const tokenIn = await ftGetTokenMetadata("paras.fakes.testnet");
//     const tokenOut = await ftGetTokenMetadata("pulse.fakes.testnet");

//     const swapTodos = await estimateSwap({
//         tokenIn,
//         tokenOut,
//         amountIn: "1000",
//         simplePools,
//         options: {
//             enableSmartRouting: true,
//             stablePools,
//             stablePoolsDetail,
//         },
//     });

//     console.log({
//         swapTodos,
//         swapTodosEstimates: swapTodos.map((e) => e.estimate),
//     });
// });
