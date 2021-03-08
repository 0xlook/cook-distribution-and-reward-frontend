import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import BigNumber from 'bignumber.js';
import {getDistributionVestingAmount,
        getDistributionVestedAmount,
        getDistributionAvalibleAmount,
        getDistributionStartTimestamp,
        getTodayNumber,
        getTokenAllowance,
        getTokenBalance,
        getStakeLockupDuration,
        getRewardPerBlock,
        getTotalStaked,
        getPoolBalanceOfStaked} from '../../utils/infura';
import {COOK, UNI, WETH} from "../../constants/tokens";
import {CookDistribution, POOLS} from "../../constants/contracts";
import { toTokenUnitsBN } from '../../utils/number';
import WithdrawPageHeader from "./Header";
import Withdraw from "./Withdraw";
import DistributionZap from "./DistributionZap";
import { Row, Col } from 'react-grid-system';

function Distribution({ user }: {user: string}) {
  const { override } = useParams();
  if (override) {
    user = override;
  }

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
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const [vestingBalance,
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
      console.log('wethAllowance',wethAllowance);
      const userVestingBalance = toTokenUnitsBN(vestingBalance, COOK.decimals);
      const userVestedBalance = toTokenUnitsBN(vestedBalance, COOK.decimals);
      const userAvalibleBalance = toTokenUnitsBN(avalibleBalance, COOK.decimals);
      const startDay = new BigNumber(startTimeStamp).div(86400).decimalPlaces(0, 1);
      const todayNumber = new BigNumber(tDay);

      const pairCOOKBalance = toTokenUnitsBN(pairBalanceCOOKStr, COOK.decimals);
      const pairWETHBalance = toTokenUnitsBN(pairBalanceWETHStr, WETH.decimals);
      const userWETHBalance = toTokenUnitsBN(wethBalance, WETH.decimals);


      const poolList = await Promise.all(POOLS.map( async (pool)=>{
        const [lockedup,reward,staked,totalStaked] =
        await Promise.all([
            getStakeLockupDuration(pool.address),
            getRewardPerBlock(pool.address),
            getTotalStaked(pool.address),
            getPoolBalanceOfStaked(pool.address,user)
          ])

        const totalStakedBalance = toTokenUnitsBN(totalStaked, UNI.decimals);
        const userTotalStakedBalance = toTokenUnitsBN(staked, UNI.decimals);
        const poolRewardPerBlock = toTokenUnitsBN(reward, COOK.decimals);


        return({pool:pool.address,lockedUp:lockedup,reward:poolRewardPerBlock,staked:userTotalStakedBalance,totalStaked:totalStakedBalance,
                name: pool.name,
                address: pool.address,
                lockedUpPeriod: lockedup,
                rewardPerBlock: poolRewardPerBlock})
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
        console.log(wethAllowance);
        setUserWETHAllowance(new BigNumber(wethAllowance));
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 1000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  return (
    <>
      <div style={{textAlign:"center"}}>
      <div style={{fontWeight:'bold', fontSize:40}}>Cook Protocol</div>
      <div style={{marginTop:30, marginBottom:50,fontSize:20}}>{"Mobri........."}</div>
      <div style={{fontWeight:'bold', fontSize:35}}>Total Token 10,000,000 COOK</div>
      </div>
      <WithdrawPageHeader
        accountVestingBalance={userVestingBalance}
        accountAvalibleBalance={userAvalibleBalance}
        accountVestedBalance={userVestedBalance}
        todayNumber={today}
        startDayNumber={startDay}
      />
      <Row>
        <Col xs={6} style={{textAlign:"right"}}>
        <Withdraw
          user={user}
          vestingAmount={userVestingBalance}
          availableAmount={userAvalibleBalance}
          records={[]}
        /></Col>
        <Col xs={6} >
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
      </Row>




    </>
  );
}

export default Distribution;