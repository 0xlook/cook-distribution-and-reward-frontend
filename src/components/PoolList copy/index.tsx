import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getStakeLockupDuration,
  getRewardPerBlock,
  getTotalStaked,
  getPoolBalanceOfStaked,
  getPoolBalanceOfUnstakable,
  getPoolBalanceOfClaimable,
  getTokenAllowance,
  getTokenBalance
} from '../../utils/infura';
import {
  useViewport
} from '@aragon/ui';
import LinearText from "../common/LinearText";
import _ from 'lodash'
import { COOK_POOLS } from "../../constants/contracts";
import { toTokenUnitsBN } from '../../utils/number';
import { COOK, UNI, WETH } from "../../constants/tokens";
import Pool from "../CookPool";
import BigNumber from 'bignumber.js';
import ListTable from "../PoolList/ListTable";
import colors from '../../constants/colors';
import Unstake from "../CookPool/Unstake";
import Stake from "../CookPool/Stake";
import Zap from "../CookPool/Zap";
import { Container, Row, Col } from 'react-grid-system';

function CookPoolList({ user }: { user: string }) {
  const { override } = useParams();
  if (override) {
    user = override;
  }
  const [poolList, setPoolList] = useState([] as any);
  const [selectedPool, setSelectedPool] = useState('');
  const [totalStaked, setTotalStaked] = useState(new BigNumber(0));
  const { below } = useViewport()
  const [pairBalanceCOOK, setPairBalanceCOOK] = useState(new BigNumber(0));
  const [pairBalanceWETH, setPairBalanceWETH] = useState(new BigNumber(0));
  const [userTotalStaked, setUserTotalStaked] = useState(new BigNumber(0));
  const [userTotalUnstakable, setUserTotalUnstakable] = useState(new BigNumber(0));
  const [userTotalLocked, setUserTotalLocked] = useState(new BigNumber(0));

  const [userTotalVested, setUserTotalVested] = useState(new BigNumber(0));
  const [userUNIAllowance, setUserUNIAllowance] = useState(new BigNumber(0));
  const [userUNIBalance, setUserUNIBalance] = useState(new BigNumber(0));
  const [userWETHBalance, setUserWETHBalance] = useState(new BigNumber(0));
  const [userWETHAllowance, setUserWETHAllowance] = useState(new BigNumber(0));

  useEffect(() => {
    let isCancelled = false;

    // setPoolList([{name:"4 UNI-V2 (WETH/COOK)", address:"0xf4B146FbA71F41E0592668ffbF264F1D186b2Ca8",lockedUpPeriod:"90 days",rewardPerBlock:"300"}]);
    async function updatePoolInfo() {
      const poolList = await Promise.all(COOK_POOLS.map(async (pool) => {
        const [lockedup, reward] =
          await Promise.all([
            getStakeLockupDuration(pool.address),
            getRewardPerBlock(pool.address)
          ])
        const poolRewardPerBlock = toTokenUnitsBN(reward, COOK.decimals);
        return ({
          name: pool.name,
          address: pool.address,
          lockedUpPeriod: lockedup,
          rewardPerBlock: poolRewardPerBlock
        });
      }));
      const totalStakedBalance = await COOK_POOLS.reduce(async (sum, pool) => {
        const staked = await getTotalStaked(pool.address);
        return (await sum).plus(staked);
      }, Promise.resolve(new BigNumber(0)));

      const totalStaked = toTokenUnitsBN(totalStakedBalance, UNI.decimals);

      if (!isCancelled) {
        setPoolList(poolList);
        setTotalStaked(totalStaked);
      }

    }

    updatePoolInfo();

    const id = setInterval(updatePoolInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  useEffect(() => {
    if (poolList && poolList[0] && !selectedPool) {
      setSelectedPool(poolList[0].address)
    }
  }, [poolList]);

  useEffect(() => {
    if (selectedPool === '') {
      setPairBalanceCOOK(new BigNumber(0));
      setPairBalanceWETH(new BigNumber(0));
      setUserTotalStaked(new BigNumber(0));
      setUserTotalUnstakable(new BigNumber(0));
      setUserTotalLocked(new BigNumber(0));
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
        userTotalVestedStr,
        uniAllowance,
        uniBalance,
        wethAllowance,
        wethBalance
      ] = await Promise.all([
        getPoolBalanceOfStaked(selectedPool, user),
        getPoolBalanceOfUnstakable(selectedPool, user),
        getPoolBalanceOfClaimable(selectedPool, user),
        getTokenAllowance(UNI.addr, user, selectedPool),
        getTokenBalance(UNI.addr, user),
        getTokenAllowance(WETH.addr, user, selectedPool),
        getTokenBalance(WETH.addr, user),
      ]);

      const userTotalStakedBalance = toTokenUnitsBN(userTotalStakedStr, UNI.decimals);
      const userTotalUnstakableBalance = toTokenUnitsBN(userTotalUnstakableStr, UNI.decimals);
      const userTotalLockedBalance = (new BigNumber(userTotalStakedBalance)).minus(new BigNumber(userTotalUnstakableBalance));
      const userTotalVestedBalance = toTokenUnitsBN(userTotalVestedStr, COOK.decimals);
      const userUNIBalance = toTokenUnitsBN(uniBalance, UNI.decimals);
      const userWETHBalance = toTokenUnitsBN(wethBalance, WETH.decimals);


      if (!isCancelled) {
        setUserTotalStaked(new BigNumber(userTotalStakedBalance));
        setUserTotalUnstakable(new BigNumber(userTotalUnstakableBalance));
        setUserTotalLocked(new BigNumber(userTotalLockedBalance));
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
  }, [user, selectedPool]);


  const selectedPoolList = [_.find(poolList, { 'address': selectedPool })]
  return (
    <div style={{ padding: '2%' }}>
      <div className="title">Cook mining</div>
      <LinearText text={"Stake cook token, get cook token"} />

      <div style={{
        padding: '20px 30px',
        backgroundColor: colors.secondary, width: "100%",
        margin: "30pt auto", textAlign: "center", borderRadius: 20
      }}>
        <ListTable pools={poolList} selectedPool={selectedPool} setSelectedPool={(selected) => {
          setSelectedPool(selected)
        }
        } detailMode={true} action={
          <Row style={{ textAlign: "center", width: "100%" }}>
            <Col xs={12} xl={4} style={{ padding: '0 5px' }}>
              <Stake
                pools={selectedPoolList}
                user={user}
                poolAddress={selectedPool}
                balance={userUNIBalance}
                allowance={userUNIAllowance}
                staked={userTotalStaked}
              />
            </Col><Col xs={12} xl={4} style={{ padding: '0 5px' }}>
              <Unstake
                user={user}
                pools={selectedPoolList}
                poolAddress={selectedPool}
                unstakable={userTotalUnstakable}
                locked={userTotalLocked}
              />
            </Col>
            <Col xs={12} xl={4} style={{ padding: '0 5px' }}>
              <Zap
                user={user}
                pools={selectedPoolList}
                cookAvailable={userTotalVested}
                selected={selectedPool}
              />
            </Col>
          </Row>
        } />
        <Pool user={user} poolAddress={selectedPool} pools={poolList} />

      </div>

    </div >
  );
}

export default CookPoolList;
