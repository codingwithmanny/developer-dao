// Please take note of etherscan's API limit
// https://docs.etherscan.io/support/rate-limits (Currently 5 calls/second, up to 100,000 calls/day)
// Code inspired by: https://github.com/Anish-Agnihotri/dhof-loot

// Imports
const dotenv = require('dotenv');
const fs = require('fs');
const ethers = require('ethers');
const { abi } = require('./abi');

// Constants
dotenv.config({ path: './data/.env' });
const TOKEN_ID_FROM = 1;
const TOKEN_ID_TO = 8000;
const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || 'UNKNOWN_CONTRACT_ADDRESS';
const API_KEY = process.env.ETHERSCAN_API || 'UNKNOWN_API_KEY';
const INTERVAL = 1000; // 1 second
const NETWORK_NAME = process.env.NETWORK_NAME || 'mainnet';
const JSON_DATA = {
  contract: CONTRACT_ADDRESS,
};
let API_REQUESTS_PERFORMED = 0;

// Config
const network = ethers.providers.getNetwork(NETWORK_NAME);
const provider = new ethers.providers.EtherscanProvider(network, API_KEY);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

// Functions
/**
 *
 * @param {*} time
 * @returns
 */
const delay = (time) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(true), time);
  });

/**
 *
 * @param {*} token
 * @returns
 */
const parseJwt = (token) => {
  const base64 = token.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    Buffer.from(base64, 'base64')
      .toString()
      .split('')
      .map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
};

/**
 *
 * @param {*} time
 * @returns
 */
const parseTime = (time) => {
  if (time > 3600) {
    return `${parseFloat(time / 60 / 60).toFixed(
      2,
    )}h \x1b[33m(yes you read that right, HOURS!)\x1b[0m`;
  } else if (time > 60) {
    return `${parseFloat(time / 60).toFixed(2)}m`;
  }
  return `${time}s`;
};

/**
 * Main function that retrieves data
 */
const init = async () => {
  console.log('\x1b[33mWarning! This may take a while...	\x1b[0m');
  console.log(
    `Estimated time to fetch ${
      TOKEN_ID_TO + 1 - TOKEN_ID_FROM
    } entries: ~${parseTime((TOKEN_ID_TO + 1 - TOKEN_ID_FROM) * 10)}`,
  );
  console.log(
    `Estimated number of queries to perform: ${
      4 + 10 * (TOKEN_ID_TO + 1 - TOKEN_ID_FROM)
    }`,
  );
  const JSON_TOKEN_DATA = [];

  try {
    JSON_DATA.name = await contract.name();
    JSON_DATA.owner = await contract.owner();
    JSON_DATA.symbol = await contract.symbol();
    JSON_DATA.totalSupply = parseInt(
      (await contract.totalSupply()).toString(),
      0,
    );

    await delay(INTERVAL);
    API_REQUESTS_PERFORMED += 4;

    for (let i = TOKEN_ID_FROM; i <= TOKEN_ID_TO; i++) {
      // Note: these are separated to make sure the 5call/second isn't exhausted
      const clothing = await contract.getClothing(i); // 1
      const industry = await contract.getIndustry(i); // 2
      const language = await contract.getLanguage(i); // 3
      const location = await contract.getLocation(i); // 4
      const mind = await contract.getMind(i); // 5

      await delay(INTERVAL);

      const os = await contract.getOS(i); // 6
      const textEditor = await contract.getTextEditor(i); // 7
      const vibe = await contract.getVibe(i); // 8
      const owner = await contract.ownerOf(i); // 9
      const tokenURI = await contract.tokenURI(i); // 10
      const tokenURIParsed = tokenURI
        ? parseJwt(tokenURI.replace('data:application/json;base64,', ''))
        : null;

      JSON_TOKEN_DATA.push({
        id: i,
        clothing,
        industry,
        language,
        location,
        mind,
        os,
        textEditor,
        vibe,
        owner,
        tokenURI,
        tokenURIParsed,
      });

      await delay(INTERVAL);
      API_REQUESTS_PERFORMED += 10;
    }

    JSON_DATA.tokens = JSON_TOKEN_DATA;

    fs.writeFileSync(`${__dirname}/data.json`, JSON.stringify(JSON_DATA));
    console.log(
      `\x1b[32mSuccessfully pulled ${JSON_TOKEN_DATA.length} items.\x1b[0m`,
    );
    console.log(`API requests performed: ${API_REQUESTS_PERFORMED}`);
    console.log(
      '\x1b[33mTake note that the free tier has a limit of 100,000 requests per day\x1b[0m',
    );
  } catch (error) {
    console.log(`\x1b[31mError Occurred\x1b[0m`);
    console.log(error);
  }
};

// Init
init();
