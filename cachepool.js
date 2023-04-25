import { fetchAllPools, getConfig } from '@ref-finance/ref-sdk';

import fs from 'fs';

console.log({
  config: getConfig(),
});

fetchAllPools(100).then((allPools) => {
  fs.writeFileSync('pooldata.json', JSON.stringify(allPools));
});
