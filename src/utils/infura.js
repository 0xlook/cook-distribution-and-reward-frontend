import Web3 from 'web3';

const poolAbi = require('../constants/abi/Pool.json');
const mockPoolAbi = require('../constants/abi/MockPool.json');
const distributionAbi = require('../constants/abi/TokenDistribution.json');
const dollarAbi = require('../constants/abi/Dollar.json');
const priceComsumerAbi = require('../constants/abi/PriceConsumer.json');

// eslint-disable-next-line no-undef
// console.log(window.ethereum);
let web3 = new Web3(window.ethereum?window.ethereum:null);

/**
 *
 * @param {string} token address
 * @param {string} account address
 * @param {string} spender address
 * @return {Promise<string>}
 */
export const getTokenAllowance = async (token, account, spender) => {
  const tokenContract = new web3.eth.Contract(dollarAbi, token);
  return tokenContract.methods.allowance(account, spender).call();
};

/**
 *
 * @param {string} token address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getTokenBalance = async (token, account) => {
  if (account === '') return '0';
  const tokenContract = new web3.eth.Contract(dollarAbi, token);
  return tokenContract.methods.balanceOf(account).call();
};

// Pool
/**
 *
 * @param {string} pool address
 * @return {Promise<string>}
 */
export const getTotalStaked = async (pool) => {
  if (!window.ethereum) {
    return 0;
  }
  const poolContract = new web3.eth.Contract(poolAbi, pool);
  return poolContract.methods.totalStaked().call();
};

export const getStakeLockupDuration = async (pool) => {
  if (!window.ethereum) {
    return 0;
  }
  const poolContract = new web3.eth.Contract(poolAbi, pool);
  return poolContract.methods.getStakeLockupDuration().call();
};

export const getRewardPerBlock = async (pool) => {
  if (!window.ethereum) {
    return 0;
  }
  const poolContract = new web3.eth.Contract(poolAbi, pool);
  return poolContract.methods.getRewardPerBlock().call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfStaked = async (pool, account) => {
  if (account === '') return '0';
  const poolContract = new web3.eth.Contract(poolAbi, pool);
  return poolContract.methods.balanceOfStaked(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfRewarded = async (pool, account) => {
  if (account === '') return '0';
  const poolContract = new web3.eth.Contract(poolAbi, pool);
  return poolContract.methods.balanceOfRewarded(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfVesting = async (pool, account) => {
  if (account === '') return '0';
  const poolContract = new web3.eth.Contract(poolAbi, pool);
  return poolContract.methods.balanceOfVesting(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfClaimable = async (pool, account) => {
  if (account === '') return '0';
  const poolContract = new web3.eth.Contract(poolAbi, pool);
  return poolContract.methods.balanceOfClaimable(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfClaimed = async (pool, account) => {
  if (account === '') return '0';
  const poolContract = new web3.eth.Contract(poolAbi, pool);
  return poolContract.methods.balanceOfClaimed(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfUnstakable = async (pool, account) => {
  if (account === '') return '0';
  const poolContract = new web3.eth.Contract(poolAbi, pool);
  return poolContract.methods.balanceOfUnstakable(account).call();
};

/**
 *
 * @param {string} cookDistribution address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getDistributionVestingAmount = async (cookDistribution, account) => {
  const distributionContract = new web3.eth.Contract(distributionAbi, cookDistribution);
  return distributionContract.methods.getUserVestingAmount(account).call();
};

/**
 *
 * @param {string} cookDistribution address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getDistributionAvalibleAmount = async (cookDistribution, account) => {
  const distributionContract = new web3.eth.Contract(distributionAbi, cookDistribution);
  return distributionContract.methods.getUserAvailableAmount(account,0).call();
};

/**
 *
 * @param {string} cookDistribution address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getDistributionVestedAmount = async (cookDistribution, account) => {
  const distributionContract = new web3.eth.Contract(distributionAbi, cookDistribution);
  return distributionContract.methods.getUserVestedAmount(account,0).call();
};



/**
 *
 * @param {string} cookDistribution address
 * @return {Promise<string>}
 */
export const getDistributionStartTimestamp = async (cookDistribution) => {
  const distributionContract = new web3.eth.Contract(distributionAbi, cookDistribution);
  return distributionContract.methods.start().call();
};



/** Admin functions (TESTING ONLY) */
export const getTodayNumber = async (cookDistribution) => {
  const distributionContract = new web3.eth.Contract(distributionAbi, cookDistribution);
  return distributionContract.methods.today().call();
};


export const getWETHPrice = async (priceComsumer) => {
  const priceComsumerContract = new web3.eth.Contract(priceComsumerAbi, priceComsumer);
  return priceComsumerContract.methods.getLatestPrice().call();
};

// deployer account only
export const getSevenMAPrice = async (cookDistribution) => {
  const distributionContract = new web3.eth.Contract(distributionAbi, cookDistribution);
  return distributionContract.methods.getLatestSevenSMA().call();
};

export const getBlockNumber = async (pool) => {
  const poolContract = new web3.eth.Contract(mockPoolAbi, pool);
  return poolContract.methods.blockNumberE().call();
};

export const getBlockTimestamp = async (pool) => {
  const poolContract = new web3.eth.Contract(mockPoolAbi, pool);
  return poolContract.methods.blockTimestampE().call();
};
