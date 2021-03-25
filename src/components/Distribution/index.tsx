import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import BigNumber from 'bignumber.js';
import {
  getDistributionVestingAmount,
  getDistributionVestedAmount,
  getDistributionAvalibleAmount,
  getDistributionStartTimestamp,
  getTodayNumber,
  getTokenAllowance,
  getTokenBalance,
  getStakeLockupDuration,
  getRewardPerBlock,
  getTotalStaked,
  getPoolBalanceOfStaked
} from '../../utils/infura';
import { COOK, UNI, WETH } from "../../constants/tokens";
import { CookDistribution, POOLS, COOK_POOLS } from "../../constants/contracts";
import { toTokenUnitsBN } from '../../utils/number';
import WithdrawPageHeader from "./Header";
import Withdraw from "./Withdraw";
import LinearText from "../common/LinearText";
import DistributionZap from "./DistributionZap";
import ZapCook from "./ZapCook";
import { Row, Col } from 'react-grid-system';
import colors from '../../constants/colors';
import {
  useViewport
} from '@aragon/ui';

function Distribution({ user }: { user: string }) {
  const { override } = useParams();
  if (override) {
    user = override;
  }
  const { below } = useViewport()
  const [userWETHBalance, setUserWETHBalance] = useState(new BigNumber(0));
  const [userWETHAllowance, setUserWETHAllowance] = useState(new BigNumber(0));

  const [pairBalanceCOOK, setPairBalanceCOOK] = useState(new BigNumber(0));
  const [pairBalanceWETH, setPairBalanceWETH] = useState(new BigNumber(0));


  const [userVestingBalance, setUserVestingBalance] = useState(new BigNumber(0));
  const [userVestedBalance, setUserVestedBalance] = useState(new BigNumber(0));
  const [userAvalibleBalance, setUserAvalibleBalance] = useState(new BigNumber(0));

  const [startDay, setStartDay] = useState(new BigNumber(0));
  const [today, setToday] = useState(new BigNumber(0));
  const [managedPools, setManagedPools] = useState([] as any);
  const [cookPools, setCookPools] = useState([] as any);

  //Update User balances
  useEffect(() => {
    if (user === '') {
      setUserVestingBalance(new BigNumber(0));
      setUserVestedBalance(new BigNumber(0));
      setUserAvalibleBalance(new BigNumber(0));
      setPairBalanceCOOK(new BigNumber(0));
      setPairBalanceWETH(new BigNumber(0));
      setUserWETHBalance(new BigNumber(0));
      setUserWETHAllowance(new BigNumber(0));
      setStartDay(new BigNumber(0));
      setToday(new BigNumber(0));
      setManagedPools([]);
      setCookPools([]);
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const [
        vestingBalance,
        vestedBalance,
        avalibleBalance,
        startTimeStamp,
        tDay,
        pairBalanceCOOKStr,
        pairBalanceWETHStr,
        wethBalance,
        wethAllowance
      ] = await Promise.all([
        getDistributionVestingAmount(CookDistribution, user),
        getDistributionVestedAmount(CookDistribution, user),
        getDistributionAvalibleAmount(CookDistribution, user),
        getDistributionStartTimestamp(CookDistribution),
        getTodayNumber(CookDistribution),
        getTokenBalance(COOK.addr, UNI.addr),
        getTokenBalance(WETH.addr, UNI.addr),
        getTokenBalance(WETH.addr, user),
        getTokenAllowance(WETH.addr, user, CookDistribution)
      ]);
      console.log('wethAllowance', wethAllowance);
      const userVestingBalance = toTokenUnitsBN(vestingBalance, COOK.decimals);
      const userVestedBalance = toTokenUnitsBN(vestedBalance, COOK.decimals);
      const userAvalibleBalance = toTokenUnitsBN(avalibleBalance, COOK.decimals);
      const startDay = new BigNumber(startTimeStamp).div(86400).decimalPlaces(0, 1);
      const todayNumber = new BigNumber(tDay);

      const pairCOOKBalance = toTokenUnitsBN(pairBalanceCOOKStr, COOK.decimals);
      const pairWETHBalance = toTokenUnitsBN(pairBalanceWETHStr, WETH.decimals);
      const userWETHBalance = toTokenUnitsBN(wethBalance, WETH.decimals);


      const poolList = await Promise.all(POOLS.map(async (pool) => {
        const [lockedup, reward, staked, totalStaked] =
          await Promise.all([
            getStakeLockupDuration(pool.address),
            getRewardPerBlock(pool.address),
            getTotalStaked(pool.address),
            getPoolBalanceOfStaked(pool.address, user)
          ])

        const totalStakedBalance = toTokenUnitsBN(totalStaked, UNI.decimals);
        const userTotalStakedBalance = toTokenUnitsBN(staked, UNI.decimals);
        const poolRewardPerBlock = toTokenUnitsBN(reward, COOK.decimals);


        return ({
          pool: pool.address, lockedUp: lockedup, reward: poolRewardPerBlock, staked: userTotalStakedBalance, totalStaked: totalStakedBalance,
          name: pool.name,
          address: pool.address,
          lockedUpPeriod: lockedup,
          rewardPerBlock: poolRewardPerBlock
        })
      }))

      const cookPoolList = await Promise.all(COOK_POOLS.map(async (pool) => {
        const [lockedup, reward, staked, totalStaked] =
          await Promise.all([
            getStakeLockupDuration(pool.address),
            getRewardPerBlock(pool.address),
            getTotalStaked(pool.address),
            getPoolBalanceOfStaked(pool.address, user)
          ])

        const totalStakedBalance = toTokenUnitsBN(totalStaked, COOK.decimals);
        const userTotalStakedBalance = toTokenUnitsBN(staked, COOK.decimals);
        const poolRewardPerBlock = toTokenUnitsBN(reward, COOK.decimals);

        return ({
          pool: pool.address, lockedUp: lockedup, reward: poolRewardPerBlock, staked: userTotalStakedBalance, totalStaked: totalStakedBalance,
          name: pool.name,
          address: pool.address,
          lockedUpPeriod: lockedup,
          rewardPerBlock: poolRewardPerBlock
        })
      }))

      if (!isCancelled) {
        setUserVestingBalance(new BigNumber(userVestingBalance));
        setUserVestedBalance(new BigNumber(userVestedBalance));
        setUserAvalibleBalance(new BigNumber(userAvalibleBalance));
        setStartDay(new BigNumber(startDay));
        setToday(new BigNumber(todayNumber));

        setPairBalanceCOOK(new BigNumber(pairCOOKBalance));
        setPairBalanceWETH(new BigNumber(pairWETHBalance));
        setUserWETHBalance(new BigNumber(userWETHBalance));
        setManagedPools(poolList)
        setCookPools(cookPoolList);
        // console.log(wethAllowance);
        setUserWETHAllowance(new BigNumber(wethAllowance));
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  return (
    <div style={{ padding: '2%' }}>
      <div className="title">Distribution</div>
      <LinearText text={"Manage Cook balance for presale parties"} />
      <div style={{ marginTop: 30, display: 'flex', alignItems: 'center' }}>

        <div style={{
          padding: '40px 30px',
          backgroundColor: colors.secondary,
          width: "100%", margin: "10pt auto", textAlign: "center", borderRadius: 20
        }}>
          <WithdrawPageHeader
            accountVestingBalance={userVestingBalance}
            accountAvalibleBalance={userAvalibleBalance}
            accountVestedBalance={userVestedBalance}
            todayNumber={today}
            startDayNumber={startDay}
          />

        </div>

      </div>
      <Row style={{ marginTop: 10 }}>
        <Col xs={12} md={4}>
          <Withdraw
            user={user}
            vestingAmount={userVestingBalance}
            availableAmount={userAvalibleBalance}
            records={[]}
          />
        </Col>
        <Col xs={12} md={4} >
          <DistributionZap
            user={user}
            pools={managedPools}
            cookAvailable={userAvalibleBalance}
            wethBalance={userWETHBalance}
            wethAllowance={userWETHAllowance}
            pairBalanceWETH={pairBalanceWETH}
            pairBalanceCOOK={pairBalanceCOOK}
          />
        </Col>
        <Col xs={12} md={4} >
          <ZapCook
            user={user}
            pools={cookPools}
            cookAvailable={userAvalibleBalance}
          />
        </Col>
      </Row>
    </div>
  );
}

export default Distribution;
