// Please take note of etherscan's API limit
// https://docs.etherscan.io/support/rate-limits (Currently 5calls/second, up to 100,000 calls/day)

// Imports
const dotenv = require('dotenv');
const undici = require('undici');

// Constants
dotenv.config({ path: './data/.env' });
const NETWORK = process.env.NETWORK || 'https://api.etherscan.io';
const TOKEN_ID_FROM = 1;
const TOKEN_ID_TO = 8000;
const CONTRACT = process.env.CONTRACT || 'UNKNOWN_CONTRACT';
const API_KEY = process.env.ETHERSCAN_API || 'UNKNOWN_API_KEY';
const INTERVAL = 1000; // 1 second

// Script
console.group('Runnig pull...');
console.log('Network: ', NETWORK);
console.log('Pulling: ', TOKEN_ID_FROM, '-', TOKEN_ID_TO);

/**
 *
 */
const init = async () => {
  try {
    const { body } = await undici.request(
      `${NETWORK}/api?module=contract&action=getabi&address=${CONTRACT}&apikey=${API_KEY}`,
    );

    console.log('data', await body.json());
  } catch (error) {
    console.log({ error });
    process.exit(0);
  }
};

// Init
init();

// console.log('hello');
console.log();
