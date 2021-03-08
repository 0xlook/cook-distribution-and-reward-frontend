import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import _ from 'lodash'
import BigNumber from 'bignumber.js';
import {
  getPoolBalanceOfStaked,
  getPoolBalanceOfUnstakable,
  getPoolBalanceOfRewarded,
  getPoolBalanceOfVesting,
  getPoolBalanceOfClaimable,
  getPoolBalanceOfClaimed,
  getTokenAllowance,
  getTokenBalance
} from '../../utils/infura';
import {COOK, UNI, WETH} from "../../constants/tokens";
import { toTokenUnitsBN } from '../../utils/number';
import Unstake from "./Unstake";
import Stake from "./Stake";
import Claim from "./Claim";
import Harvest from "./Harvest";
import Zap from "./Zap";
import {
  Box
} from '@aragon/ui';
import { Container, Row, Col } from 'react-grid-system';
import {
  BalanceBlock
} from '../common/index';


type PoolProps = {
  pool:string,lockedUp:number,reward:BigNumber,staked:BigNumber,totalStaked:BigNumber
};

function Pool({ user, poolAddress, pools }: {user: string, poolAddress: string, pools: Array<PoolProps>}) {
  const { override, address } = useParams();
  if (override) {
    user = override;
  }
  if (address) {
    poolAddress = address;
  }

  const [pairBalanceCOOK, setPairBalanceCOOK] = useState(new BigNumber(0));
  const [pairBalanceWETH, setPairBalanceWETH] = useState(new BigNumber(0));
  const [userTotalStaked, setUserTotalStaked] = useState(new BigNumber(0));
  const [userTotalUnstakable, setUserTotalUnstakable] = useState(new BigNumber(0));
  const [userTotalLocked, setUserTotalLocked] = useState(new BigNumber(0));
  const [userTotalRewarded, setUserTotalRewarded] = useState(new BigNumber(0));
  const [userTotalInVesting, setUserInTotalVesting] = useState(new BigNumber(0));
  const [userTotalVested, setUserTotalVested] = useState(new BigNumber(0));
  const [userUNIAllowance, setUserUNIAllowance] = useState(new BigNumber(0));
  const [userUNIBalance, setUserUNIBalance] = useState(new BigNumber(0));
  const [userWETHBalance, setUserWETHBalance] = useState(new BigNumber(0));
  const [userWETHAllowance, setUserWETHAllowance] = useState(new BigNumber(0));

  //Update User balances
  useEffect(() => {
    if (poolAddress === '') {
      setPairBalanceCOOK(new BigNumber(0));
      setPairBalanceWETH(new BigNumber(0));
      setUserTotalStaked(new BigNumber(0));
      setUserTotalUnstakable(new BigNumber(0));
      setUserTotalLocked(new BigNumber(0));
      setUserTotalRewarded(new BigNumber(0));
      setUserInTotalVesting(new BigNumber(0));
      setUserTotalVested(new BigNumber(0));
      setUserUNIAllowance(new BigNumber(0));
      setUserUNIBalance(new BigNumber(0));
      setUserWETHBalance(new BigNumber(0));
      setUserWETHAllowance(new BigNumber(0));
      return;
    }

    let isCancelled = false;

    async function updatePoolInfo() {
      const [
        pairBalanceCOOKStr,
        pairBalanceWETHStr,
      ] = await Promise.all([
        getTokenBalance(COOK.addr, UNI.addr),
        getTokenBalance(WETH.addr, UNI.addr),
      ]);

      const pairCOOKBalance = toTokenUnitsBN(pairBalanceCOOKStr, COOK.decimals);
      const pairWETHBalance = toTokenUnitsBN(pairBalanceWETHStr, WETH.decimals);

      if (!isCancelled) {
        setPairBalanceCOOK(new BigNumber(pairCOOKBalance));
        setPairBalanceWETH(new BigNumber(pairWETHBalance));
      }
    }

    updatePoolInfo();
    const poolInfoId = setInterval(updatePoolInfo, 15000);

    if (user === '') {
      setUserTotalStaked(new BigNumber(0));
      setUserTotalUnstakable(new BigNumber(0));
      setUserTotalLocked(new BigNumber(0));
      setUserTotalRewarded(new BigNumber(0));
      setUserInTotalVesting(new BigNumber(0));
      setUserTotalVested(new BigNumber(0));
      setUserUNIAllowance(new BigNumber(0));
      setUserUNIBalance(new BigNumber(0));
      setUserWETHBalance(new BigNumber(0));
      setUserWETHAllowance(new BigNumber(0));
      return () => {
        isCancelled = true;
        clearInterval(poolInfoId);
      };
    }

    async function updateUserInfo() {
      const [
        userTotalStakedStr,
        userTotalUnstakableStr,
        userTotalRewardedStr,
        userTotalVestingStr,
        userTotalVestedStr,
        userTotalClaimedStr,
        uniAllowance,
        uniBalance,
        wethAllowance,
        wethBalance
      ] = await Promise.all([
        getPoolBalanceOfStaked(poolAddress, user),
        getPoolBalanceOfUnstakable(poolAddress, user),
        getPoolBalanceOfRewarded(poolAddress, user),
        getPoolBalanceOfVesting(poolAddress, user),
        getPoolBalanceOfClaimable(poolAddress, user),
        getPoolBalanceOfClaimed(poolAddress, user),
        getTokenAllowance(UNI.addr, user, poolAddress),
        getTokenBalance(UNI.addr, user),
        getTokenAllowance(WETH.addr, user, poolAddress),
        getTokenBalance(WETH.addr, user),
      ]);

      const userTotalStakedBalance = toTokenUnitsBN(userTotalStakedStr, UNI.decimals);
      const userTotalUnstakableBalance = toTokenUnitsBN(userTotalUnstakableStr, UNI.decimals);
      const userTotalLockedBalance = (new BigNumber(userTotalStakedBalance)).minus(new BigNumber(userTotalUnstakableBalance));
      const userTotalRewardedBalance = toTokenUnitsBN(userTotalRewardedStr, COOK.decimals);
      const userTotalVestingBalance = toTokenUnitsBN(userTotalVestingStr, COOK.decimals);
      const userTotalVestedBalance = toTokenUnitsBN(userTotalVestedStr, COOK.decimals);
      const userTotalClaimedBalance = toTokenUnitsBN(userTotalClaimedStr, COOK.decimals);
      const userTotalInVestingBalance = (new BigNumber(userTotalVestingBalance)).minus(new BigNumber(userTotalVestedBalance)).minus(new BigNumber(userTotalClaimedBalance));
      const userUNIBalance = toTokenUnitsBN(uniBalance, UNI.decimals);
      const userWETHBalance = toTokenUnitsBN(wethBalance, WETH.decimals);


      if (!isCancelled) {
        setUserTotalStaked(new BigNumber(userTotalStakedBalance));
        setUserTotalUnstakable(new BigNumber(userTotalUnstakableBalance));
        setUserTotalLocked(new BigNumber(userTotalLockedBalance));
        setUserTotalRewarded(new BigNumber(userTotalRewardedBalance));
        setUserInTotalVesting(new BigNumber(userTotalInVestingBalance));
        setUserTotalVested(new BigNumber(userTotalVestedBalance));
        setUserUNIAllowance(new BigNumber(uniAllowance));
        setUserUNIBalance(new BigNumber(userUNIBalance));
        setUserWETHAllowance(new BigNumber(wethAllowance));
        setUserWETHBalance(new BigNumber(userWETHBalance));
      }
    }

    updateUserInfo();
    const userInfoId = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(poolInfoId);
      clearInterval(userInfoId);
    };
  }, [user, poolAddress]);

  const poolList = [_.find(pools, { 'address': poolAddress })]

  return (
    <Container>
    <Box style={{padding:0}}>
      <Row style={{textAlign:"center",display: 'flex'}}>
        <Col xs={12} lg={8} >
          <BalanceBlock asset="To be Vested Tokens" balance={userTotalRewarded}  suffix={"COOK"} type={"block"}/>
          <hr/>
          <BalanceBlock asset="Vesting Tokens" balance={userTotalInVesting} suffix={"COOK"} type={"block"}/>
          <hr/>
          <BalanceBlock asset="Vested Tokens" balance={userTotalVested} suffix={"COOK"} type={"block"}/>
        </Col>
        <Col xs={12} lg={4} style={{margin:'auto'}}>
          <Row>
          <Col sm={6} lg={12}>
          <Harvest
            user={user}
            pools={poolList}
            poolAddress={poolAddress}
            userTotalRewarded={userTotalRewarded}
            userTotalInVesting={userTotalInVesting}
          />
          </Col>
          <Col sm={6} lg={12}>
          <Claim
            user={user}
            pools={poolList}
            poolAddress={poolAddress}
            claimable={userTotalVested}
          />
          </Col>
          </Row>
        </Col>
      </Row>

      </Box>
    <Row style={{textAlign:"center", marginTop:30, padding:"0 5%"}}>
      <Col sm={6} lg={4}>
      <Stake
        pools={poolList}
        user={user}
        poolAddress={poolAddress}
        balance={userUNIBalance}
        allowance={userUNIAllowance}
        staked={userTotalStaked}
      />
      </Col>
      <Col sm={6} lg={4}>
      <Unstake
        user={user}
        pools={poolList}
        poolAddress={poolAddress}
        unstakable={userTotalUnstakable}
        locked={userTotalLocked}
      />
      </Col>
      <Col sm={12} lg={4}>
      <Zap
        user={user}
        pools={poolList}
        cookAvailable={userTotalVested}
        selected={poolAddress}
        type={"pool"}
        wethBalance={userWETHBalance}
        wethAllowance={userWETHAllowance}
        pairBalanceWETH={pairBalanceWETH}
        pairBalanceCOOK={pairBalanceCOOK}
      />
      </Col>
      </Row>
    </Container>
  );
}

export default Pool;
