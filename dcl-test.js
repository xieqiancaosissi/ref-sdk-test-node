import {
  quote,
  ftGetTokenMetadata,
  getDCLPoolId,
  getConfig,
  DCLSwap,
  percentLess,
  toNonDivisibleNumber,
  toReadableNumber,
  getSignedTransactionsByMemoryKey,
  sendTransactionsByMemoryKey,
  DCLSwapByInputOnBestPool,
  list_history_orders,
  list_active_orders,
  cancel_order,
  claim_order,
  listDCLPools,
  getDCLPool,
  get_order,
  quote_by_output,
  list_user_assets,
  priceToPoint,
  pointToPrice,
} from "@ref_finance/ref-sdk";

// test quote

console.log({
  config: getConfig(),
});

const tokenInId = "usdt.fakes.testnet";

const tokenOutId = "wrap.testnet";

const input_amount = "1";

const AccountId = "juaner.testnet";

async function test_quote() {
  const tokenA = await ftGetTokenMetadata(tokenInId);

  const tokenB = await ftGetTokenMetadata(tokenOutId);

  // 1000 400
  const pool_ids = [getDCLPoolId(tokenInId, tokenOutId, 10000)];

  console.log(pool_ids);

  const res = await quote({
    pool_ids,
    input_amount,
    input_token: tokenA,
    output_token: tokenB,
  });

  console.log(res);

  console.log({
    amount: toReadableNumber(tokenB.decimals, res.amount),
  });
}

async function test_quote_by_output() {
  const tokenA = await ftGetTokenMetadata(tokenInId);

  const tokenB = await ftGetTokenMetadata(tokenOutId);

  // 1000 400
  const pool_ids = [getDCLPoolId(tokenInId, tokenOutId, 10000)];

  // console.log(pool_ids);

  const res = await quote_by_output({
    pool_ids,
    input_token: tokenA,
    output_token: tokenB,
    output_amount: "0.1",
  });

  console.log(res);

  // console.log({
  //     amount: toReadableNumber(tokenB.decimals, res.amount),
  // });
}

// test_quote().then((res) => {
//     console.log(res);
// });

async function test_dclSwap() {
  const tokenA = await ftGetTokenMetadata(tokenInId);

  const tokenB = await ftGetTokenMetadata(tokenOutId);

  const pool_ids = [getDCLPoolId(tokenInId, tokenOutId, 2000)];

  const res = await DCLSwap({
    swapInfo: {
      amountA: input_amount,
      tokenA: tokenA,
      tokenB: tokenB,
    },
    Swap: {
      min_output_amount: "0",
      pool_ids,
    },
    AccountId,
  });

  console.log(res);

  console.log(res[0].functionCalls);
}

// test_dclSwap();

async function test_dclSwap_output() {
  const tokenA = await ftGetTokenMetadata(tokenInId);

  const tokenB = await ftGetTokenMetadata(tokenOutId);

  const pool_ids = [getDCLPoolId(tokenInId, tokenOutId, 2000)];

  const txs = await DCLSwap({
    swapInfo: {
      amountA: "0.9",
      tokenA: tokenA,
      tokenB: tokenB,
    },
    SwapByOutput: {
      pool_ids,
      output_amount: "4.89454792",
    },
    AccountId,
  });

  console.log({
    txs,
  });

  console.log(txs[0].functionCalls);
}
// test_dclSwap_output();
// test_dclSwap();

async function test_dclSwap_on_best_pool_tx() {
  const tokenA = await ftGetTokenMetadata(tokenInId);

  const tokenB = await ftGetTokenMetadata(tokenOutId);

  // const pool_ids = [getDCLPoolId(tokenInId, tokenOutId, 400)];

  const txs = await DCLSwapByInputOnBestPool({
    tokenA,
    tokenB,
    amountA: input_amount,
    slippageTolerance: 0.1,
    AccountId,
  });

  console.log({
    txs,
  });

  console.log(txs[0].functionCalls);
}

// test_dclSwap_on_best_pool_tx();
// test_quote();
// test_dclSwap_output_tx();

async function test_limit_order() {
  const tokenA = await ftGetTokenMetadata(tokenInId);

  const tokenB = await ftGetTokenMetadata(tokenOutId);

  const pool_id = getDCLPoolId(tokenInId, tokenOutId, 2000);

  console.log({
    pool_id,
  });

  const txs = await DCLSwap({
    swapInfo: {
      amountA: input_amount,
      tokenA: tokenA,
      tokenB: tokenB,
    },
    LimitOrderWithSwap: {
      pool_id,
      output_amount: "3217.929",
    },
    AccountId,
  });

  console.log({
    txs,
  });

  console.log(txs[0].functionCalls);
}

// test_limit_order();

async function listActiveOrder() {
  const res = await list_active_orders(AccountId);

  console.log(res);
}

async function listHistoryOrder() {
  const res = await list_history_orders(AccountId);

  console.log(res);
}

async function cancelOrder_ts() {
  const res = await cancel_order("usdt.fakes.testnet|wrap.testnet|10000#93");

  console.log(res[0]);

  console.log(res[0].functionCalls);

  // signAndSendTransaction(res);
}

async function claimOrder_ts() {
  const res = claim_order("usdt.fakes.testnet|wrap.testnet|10000#6");
  console.log(res[0]);

  console.log(res[0].functionCalls);
}

// listActiveOrder();

// listHistoryOrder();

// cancelOrder_ts();

// claimOrder_ts();

async function test_getorder() {
  const res = await get_order("usdt.fakes.testnet|wrap.testnet|10000#93");
  console.log(res);
}

// test_getorder();

// listActiveOrder();

// listHistoryOrder();

// cancelOrder_ts();

async function signAndSendTransaction(txs) {
  const signedTransactions = await getSignedTransactionsByMemoryKey({
    transactionsRef: txs,
    AccountId,
    keyPath: "/.near-credentials/testnet/juaner.testnet.json",
  });

  console.log(signedTransactions);

  const res = await sendTransactionsByMemoryKey({ signedTransactions });

  console.log(res);
}

// const res = getDCLPoolId(tokenInId, tokenOutId, 2000);

// console.log(res);

async function list_all_pools() {
  const res = await listDCLPools();
  console.log(res);
}
// list_all_pools();

async function get_pool_dcl() {
  const res = await getDCLPool("usdt.fakes.testnet|wrap.testnet|2000");
  console.log(res);
}
// get_pool_dcl();

// test_quote();
// test_quote_by_output();

async function listUserAssets() {
  const res = await list_user_assets(AccountId);
  console.log(res);
}

// async function price_to_point() {
//     const tokenA = await ftGetTokenMetadata(tokenInId);

//     const tokenB = await ftGetTokenMetadata(tokenOutId);

//     const amountA = "0.9";

//     const amountB = "4.89454792";

//     const fee = 400;
//     const res = priceToPoint({
//         tokenA,
//         tokenB,
//         amountA,
//         amountB,
//         fee,
//     });
//     console.log(res);
// }

// price_to_point();

// listUserAssets();

async function point_to_price() {
  const tokenA = await ftGetTokenMetadata(tokenInId);

  const tokenB = await ftGetTokenMetadata(tokenOutId);

  const res = pointToPrice({
    tokenA,
    tokenB,
    point: 431416,
  });
  console.log(res);
}
point_to_price();
