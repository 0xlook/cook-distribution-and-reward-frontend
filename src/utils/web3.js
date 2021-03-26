/* eslint-disable camelcase */
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

import { notify } from './txNotifier.ts';
const poolAbi = require('../constants/abi/Pool.json');
const cookPoolAbi = require('../constants/abi/CookPool.json');
const mockPoolAbi = require('../constants/abi/MockPool.json');
const distributionAbi = require('../constants/abi/CookDistribution.json');
const dollarAbi = require('../constants/abi/Dollar.json');
const oracleAbi = require('../constants/abi/Oracle.json');
const priceComsumerAbi = require('../constants/abi/PriceConsumer.json');
const UINT256_MAX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';


/**
 * ERC20 Utilities
 */

export const approve = async (tokenAddr, spender, callback, amt = UINT256_MAX,) => {
  const account = await checkConnectedAndGetAddress();
  const oToken = new window.web3.eth.Contract(dollarAbi, tokenAddr);
  await oToken.methods
    .approve(spender, amt)
    .send({ from: account })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
      if (callback) {
        callback(hash);
      }
    });
};


/**
 * Connection Utilities
 */

export const updateModalMode = async (theme) => {
  window.darkMode = theme === 'dark';
};

export const connect = async (ethereum) => {
  window.web3 = new Web3(ethereum);
  let addresses = await window.web3.eth.getAccounts();
  if (!addresses.length) {
    try {
      addresses = await window.ethereum.enable();
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  return addresses.length ? addresses[0].toLowerCase() : null;
};

// eslint-disable-next-line consistent-return
export const checkConnectedAndGetAddress = async () => {
  let addresses = await window.web3.eth.getAccounts();
  if (!addresses.length) {
    try {
      addresses = await window.ethereum.enable();
      // eslint-disable-next-line no-empty
    } catch (e) { }
  }

  return addresses[0];
};

/**
 * Pool
 */
export const stake = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress();
  const poolContract = new window.web3.eth.Contract(poolAbi, pool);
  await poolContract.methods
    .stake(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
      callback(hash);
    });
};

export const unstake = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress();
  const poolContract = new window.web3.eth.Contract(poolAbi, pool);
  await poolContract.methods
    .unstake(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
      callback(hash);
    });
};

export const claim = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress();
  const poolContract = new window.web3.eth.Contract(poolAbi, pool);
  await poolContract.methods
    .claim(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
      callback(hash);
    });
};

export const zap = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress();
  const poolContract = new window.web3.eth.Contract(poolAbi, pool);
  await poolContract.methods
    .zapLP(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
      callback(hash);
    });
};
export const zapCook = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress();
  const poolContract = new window.web3.eth.Contract(cookPoolAbi, pool);
  await poolContract.methods
    .zapCook(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
      callback(hash);
    });
};

export const harvest = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress();
  const poolContract = new window.web3.eth.Contract(poolAbi, pool);
  await poolContract.methods
    .harvest(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
      callback(hash);
    });
};

// token distribution

export const withdraw = async (cookDistribution, amount) => {
  const account = await checkConnectedAndGetAddress();
  const distributionContract = new window.web3.eth.Contract(distributionAbi, cookDistribution);
  await distributionContract.methods
    .withdraw(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};


export const getWithdrawRecords = async (cookDistribution) => {
  const account = await checkConnectedAndGetAddress();
  const distributionContract = new window.web3.eth.Contract(distributionAbi, cookDistribution);
  const events = await distributionContract.getPastEvents('TokensWithdrawal', {
    filter: { userAddress: account },
    fromBlock: 0,
  });
  return events;
};

export const distributionZap = async (cookDistribution, poolAddress, amount, callback) => {
  const account = await checkConnectedAndGetAddress();
  const distributionContract = new window.web3.eth.Contract(distributionAbi, cookDistribution);
  await distributionContract.methods
    .zapLP(new BigNumber(amount).toFixed(), poolAddress)
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
      callback(hash);
    });
};


export const cookDistributionZap = async (cookDistribution, poolAddress, amount, callback) => {
  const account = await checkConnectedAndGetAddress();
  const distributionContract = new window.web3.eth.Contract(distributionAbi, cookDistribution);
  await distributionContract.methods
    .zapCook(new BigNumber(amount).toFixed(), poolAddress)
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
      callback(hash);
    });
};


/** Admin functions (TESTING ONLY) */
export const setDay = async (cookDistribution, dayNumber) => {
  const account = await checkConnectedAndGetAddress();
  const distributionContract = new window.web3.eth.Contract(distributionAbi, cookDistribution);
  await distributionContract.methods
    .setToday(new BigNumber(dayNumber))
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

export const setCookPrice = async (oracle, price) => {
  const account = await checkConnectedAndGetAddress();
  const oracleContract = new window.web3.eth.Contract(oracleAbi, oracle);
  await oracleContract.methods
    .set(new BigNumber(price))
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

// deployer account only
export const updatePriceFeed = async (cookDistribution) => {
  const account = await checkConnectedAndGetAddress();
  const distributionContract = new window.web3.eth.Contract(distributionAbi, cookDistribution);
  await distributionContract.methods
    .updatePriceFeed()
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

export const setWETHPrice = async (priceComsumer, price) => {
  const account = await checkConnectedAndGetAddress();
  const priceComsumerContract = new window.web3.eth.Contract(priceComsumerAbi, priceComsumer);
  await priceComsumerContract.methods
    .set(new BigNumber(price))
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

export const setPoolStakeLockupDuration = async (pool, lockupDays) => {
  const account = await checkConnectedAndGetAddress();
  const poolContract = new window.web3.eth.Contract(mockPoolAbi, pool);
  await poolContract.methods
    .setStakeLockupDuration(new BigNumber(lockupDays).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

export const setPoolRewardPerBlock = async (pool, rewards) => {
  const account = await checkConnectedAndGetAddress();
  const poolContract = new window.web3.eth.Contract(mockPoolAbi, pool);
  await poolContract.methods
    .setRewardPerBlock(new BigNumber(rewards).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

export const setPoolBlockNumber = async (pool, blockNumber) => {
  const account = await checkConnectedAndGetAddress();
  const poolContract = new window.web3.eth.Contract(mockPoolAbi, pool);
  await poolContract.methods
    .setBlockNumber(new BigNumber(blockNumber).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

export const setPoolBlockTimestamp = async (pool, blockTimestamp) => {
  const account = await checkConnectedAndGetAddress();
  const poolContract = new window.web3.eth.Contract(mockPoolAbi, pool);
  await poolContract.methods
    .setBlockTimestamp(new BigNumber(blockTimestamp).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};
