import { config, getConfig, switchEnv, init_env, fetchAllPools } from '@ref-finance/ref-sdk';

init_env('mainnet');

console.log(config);

init_env('testnet');
console.log(config);
