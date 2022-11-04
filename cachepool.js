import { fetchAllPools, getConfig } from "@ref_finance/ref-sdk";

import fs from "fs";

console.log({
    config: getConfig(),
});

fetchAllPools().then((allPools) => {
    fs.writeFileSync("pooldata.json", JSON.stringify(allPools));
});
