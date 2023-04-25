import {
  getConfig,
  ftGetTokenMetadata,
  estimateSwap,
  getStablePools,
  getExpectedOutputFromSwapTodos,
  getPool,
  getRatedPoolDetail,
  instantSwap,
  getSignedTransactionsByMemoryKey,
  sendTransactionsByMemoryKey,
} from '@ref-finance/ref-sdk';

import fs from 'fs';
process.env['NEAR_env'] = 'testnet';

const tokenInId = 'wrap.testnet';

const tokenOutId = 'ref.fakes.testnet';

const amountIn = '1';

const AccountId = 'juaner.testnet';

const keyPath = '/Users/everythingismax/.near-credentials/testnet/juaner.testnet.json';

console.log({
  config: getConfig(),
  indexerUrl: getConfig().indexerUrl,
});

fs.readFile('pooldata.json', async (err, allPools) => {
  const { ratedPools, unRatedPools, simplePools } = JSON.parse(allPools);
  const stablePools = unRatedPools.concat(ratedPools);
  const stablePoolsDetail = await getStablePools(stablePools);
  const tokenIn = await ftGetTokenMetadata(tokenInId);
  const tokenOut = await ftGetTokenMetadata(tokenOutId);

  const swapTodos = await estimateSwap({
    tokenIn,
    tokenOut,
    amountIn: amountIn,
    simplePools,
    options: {
      enableSmartRouting: false,
      stablePools,
      stablePoolsDetail,
    },
  });

  console.log('swapTodos: ', swapTodos);

  const transactionsRef = await instantSwap({
    tokenIn,
    tokenOut,
    amountIn: '1',
    swapTodos,
    slippageTolerance: 1,
    AccountId: AccountId,
  });

  const signedTransactions = await getSignedTransactionsByMemoryKey({
    transactionsRef,
    AccountId,
    keyPath,
  });

  const transactionRes = await sendTransactionsByMemoryKey({
    signedTransactions,
  });

  console.log('transactionRes: ', transactionRes);
});
