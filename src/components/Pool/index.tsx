import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import _ from 'lodash'
import BigNumber from 'bignumber.js';
import {
  useViewport
} from '@aragon/ui';
import {
  getPoolBalanceOfRewarded,
  getPoolBalanceOfVesting,
  getPoolBalanceOfClaimable,
  getPoolBalanceOfClaimed,
  getTokenBalance
} from '../../utils/infura';
import { COOK, UNI, WETH } from "../../constants/tokens";
import { toTokenUnitsBN } from '../../utils/number';
import Claim from "./Claim";
import Harvest from "./Harvest";

import { Container, Row, Col } from 'react-grid-system';
import Span from "../common/Span";
import {
  BalanceBlock
} from '../common/index';


type PoolProps = {
  pool: string, lockedUp: number, reward: BigNumber, staked: BigNumber, totalStaked: BigNumber
};

function Pool({ user, poolAddress, pools }: { user: string, poolAddress: string, pools: Array<PoolProps> }) {
  const { override, address } = useParams();
  const { below } = useViewport()
  if (override) {
    user = override;
  }
  if (address) {
    poolAddress = address;
  }


  const [userTotalRewarded, setUserTotalRewarded] = useState(new BigNumber(0));
  const [userTotalInVesting, setUserInTotalVesting] = useState(new BigNumber(0));
  const [userTotalVested, setUserTotalVested] = useState(new BigNumber(0));


  //Update User balances
  useEffect(() => {
    if (poolAddress === '') {
      setUserTotalRewarded(new BigNumber(0));
      setUserInTotalVesting(new BigNumber(0));
      setUserTotalVested(new BigNumber(0));
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

    }

    updatePoolInfo();
    const poolInfoId = setInterval(updatePoolInfo, 15000);

    if (user === '') {
      setUserTotalRewarded(new BigNumber(0));
      setUserInTotalVesting(new BigNumber(0));
      setUserTotalVested(new BigNumber(0));
      return () => {
        isCancelled = true;
        clearInterval(poolInfoId);
      };
    }

    async function updateUserInfo() {
      const [

        userTotalRewardedStr,
        userTotalVestingStr,
        userTotalVestedStr,
        userTotalClaimedStr,

      ] = await Promise.all([
        getPoolBalanceOfRewarded(poolAddress, user),
        getPoolBalanceOfVesting(poolAddress, user),
        getPoolBalanceOfClaimable(poolAddress, user),
        getPoolBalanceOfClaimed(poolAddress, user),
      ]);

      const userTotalRewardedBalance = toTokenUnitsBN(userTotalRewardedStr, COOK.decimals);
      const userTotalVestingBalance = toTokenUnitsBN(userTotalVestingStr, COOK.decimals);
      const userTotalVestedBalance = toTokenUnitsBN(userTotalVestedStr, COOK.decimals);
      const userTotalClaimedBalance = toTokenUnitsBN(userTotalClaimedStr, COOK.decimals);
      const userTotalInVestingBalance = (new BigNumber(userTotalVestingBalance)).minus(new BigNumber(userTotalVestedBalance)).minus(new BigNumber(userTotalClaimedBalance));


      if (!isCancelled) {
        setUserTotalRewarded(new BigNumber(userTotalRewardedBalance));
        setUserInTotalVesting(new BigNumber(userTotalInVestingBalance));
        setUserTotalVested(new BigNumber(userTotalVestedBalance));
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
      <Row style={{ textAlign: "left" }}>
        <Col xs={12} lg={6} style={{ marginBottom: 15, padding: 0 }}>
          <Span label={poolAddress === "" ? "No Pool Selected" : poolList[0].name} size={below(800) ? 16 : 22} />
        </Col>
        <Col xs={6} lg={3} style={{ margin: 'auto', padding: 5 }}>
          <Harvest
            user={user}
            pools={poolList}
            poolAddress={poolAddress}
            userTotalRewarded={userTotalRewarded}
            userTotalInVesting={userTotalInVesting}
          />
        </Col>
        <Col xs={6} lg={3} style={{ margin: 'auto', padding: 5 }}>
          <Claim
            user={user}
            pools={poolList}
            poolAddress={poolAddress}
            claimable={userTotalVested}
          />
        </Col>
      </Row>

      <Row style={{ textAlign: "left", marginTop: 30 }}>
        <Col xs={12} lg={5} >
          <BalanceBlock asset="Total Staked" balance={userTotalRewarded} suffix={"UNI-V2"} type={"block"} />

        </Col>
        <Col xs={12} md={4} lg={3} >
          <BalanceBlock asset="To be Vested Tokens" balance={userTotalRewarded} suffix={"Cook"} type={"block"} />
        </Col>
        <Col xs={12} md={4} lg={2} >
          <BalanceBlock asset="Vesting Tokens" balance={userTotalInVesting} suffix={"Cook"} type={"block"} />
        </Col>
        <Col xs={12} md={4} lg={2} >
          <BalanceBlock asset="Vested Tokens" balance={userTotalVested} suffix={"Cook"} type={"block"} />
        </Col>

      </Row>
    </Container>
  );
}

export default Pool;
