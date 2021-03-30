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
  getPoolBalanceOfStaked,
  getPoolBalanceOfClaimed,
  getTokenBalance
} from '../../utils/infura';
import { COOK, UNI, WETH } from "../../constants/tokens";
import { toTokenUnitsBN } from '../../utils/number';
import Claim from "./Claim";
import Harvest from "./Harvest";

import { Container, Row, Col } from 'react-grid-system';
import Zap from "./Zap";
import {
  BalanceBlock
} from '../common/index';
import { useTranslation } from "react-i18next"


type PoolProps = {
  name: string;
  address: string;
  rewardPerBlock: BigNumber;
  lockedUpPeriod: BigNumber;
  isFull: boolean;

};

function Pool({ user, poolAddress, pools, setSelectedPool }: {
  user: string, poolAddress: string, pools: Array<PoolProps>, setSelectedPool: Function

}) {
  const { override, address } = useParams();
  const { below } = useViewport()
  if (override) {
    user = override;
  }
  if (address) {
    poolAddress = address;
  }

  const [userTotalStaked, setUserTotalStaked] = useState(new BigNumber(0));
  const [userTotalRewarded, setUserTotalRewarded] = useState(new BigNumber(0));
  const [userTotalInVesting, setUserInTotalVesting] = useState(new BigNumber(0));
  const [userTotalVested, setUserTotalVested] = useState(new BigNumber(0));
  const [userTotalClaimed, setUserTotalClaimed] = useState(new BigNumber(0));

  const { t } = useTranslation()


  //Update User balances
  useEffect(() => {
    if (poolAddress === '') {
      setUserTotalStaked(new BigNumber(0));
      setUserTotalRewarded(new BigNumber(0));
      setUserInTotalVesting(new BigNumber(0));
      setUserTotalVested(new BigNumber(0));
      return;
    }

    let isCancelled = false;

    // async function updatePoolInfo() {
    //   const [
    //     pairBalanceCOOKStr,
    //     pairBalanceWETHStr,
    //   ] = await Promise.all([
    //     getTokenBalance(COOK.addr, UNI.addr),
    //     getTokenBalance(WETH.addr, UNI.addr),
    //   ]);

    // }
    // updatePoolInfo();
    // const poolInfoId = setInterval(updatePoolInfo, 15000);

    if (user === '') {
      setUserTotalRewarded(new BigNumber(0));
      setUserInTotalVesting(new BigNumber(0));
      setUserTotalVested(new BigNumber(0));
      setUserTotalClaimed(new BigNumber(0))
      return () => {
        isCancelled = true;
        // clearInterval(poolInfoId);
      };
    }

    async function updateUserInfo() {
      const [
        userTotalStakedStr,
        userTotalRewardedStr,
        userTotalVestingStr,
        userTotalVestedStr,
        userTotalClaimedStr,

      ] = await Promise.all([
        getPoolBalanceOfStaked(poolAddress, user),
        getPoolBalanceOfRewarded(poolAddress, user),
        getPoolBalanceOfVesting(poolAddress, user),
        getPoolBalanceOfClaimable(poolAddress, user),
        getPoolBalanceOfClaimed(poolAddress, user),
      ]);
      const userTotalStakedBalance = toTokenUnitsBN(userTotalStakedStr, COOK.decimals);
      const userTotalRewardedBalance = toTokenUnitsBN(userTotalRewardedStr, COOK.decimals);
      const userTotalVestingBalance = toTokenUnitsBN(userTotalVestingStr, COOK.decimals);
      const userTotalVestedBalance = toTokenUnitsBN(userTotalVestedStr, COOK.decimals);
      const userTotalClaimedBalance = toTokenUnitsBN(userTotalClaimedStr, COOK.decimals);
      const userTotalInVestingBalance = (new BigNumber(userTotalVestingBalance)).minus(new BigNumber(userTotalVestedBalance)).minus(new BigNumber(userTotalClaimedBalance));


      if (!isCancelled) {
        setUserTotalRewarded(new BigNumber(userTotalRewardedBalance));
        setUserInTotalVesting(new BigNumber(userTotalInVestingBalance));
        setUserTotalVested(new BigNumber(userTotalVestedBalance));
        setUserTotalStaked(new BigNumber(userTotalStakedBalance));
        setUserTotalClaimed(new BigNumber(userTotalClaimedBalance));
      }
    }

    updateUserInfo();
    const userInfoId = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      // clearInterval(poolInfoId);
      clearInterval(userInfoId);
    };
  }, [user, poolAddress]);

  const poolList = [_.find(pools, { 'address': poolAddress })]
  const titleSize = below('medium') ? "22px" : "32px"
  return (
    <Container>
      <Row style={{ textAlign: "left", marginTop: 30 }}>
        <Col xs={12} lg={3} >
          <BalanceBlock asset={t("Total Staked")} balance={userTotalStaked} suffix={"Cook"} type={"block"} size={titleSize} />
        </Col>
        <Col xs={12} lg={3} >
          <BalanceBlock asset={t("Avaible to Harvest")} balance={userTotalRewarded} suffix={"Cook"} type={"block"} size={titleSize} />
        </Col>
        <Col xs={12} lg={6} >
          <BalanceBlock asset={t("Total Claimed")} balance={userTotalClaimed} suffix={"Cook"} type={"block"} size={titleSize} />
        </Col>
        <Col xs={12} lg={3}  >
          <BalanceBlock asset={t("Vesting Tokens")} balance={userTotalInVesting} suffix={"Cook"} type={"block"} size={titleSize} />
        </Col>
        <Col xs={12} lg={3} >
          <BalanceBlock asset={t("Available to Claim")} balance={userTotalVested} suffix={"Cook"} type={"block"} size={titleSize} />
        </Col>

        <Col xs={6} lg={2} style={{ margin: 'auto', padding: 5 }}>
          <Harvest
            user={user}
            pools={poolList}
            poolAddress={poolAddress}
            userTotalRewarded={userTotalRewarded}
            userTotalInVesting={userTotalInVesting}
          />
        </Col>
        <Col xs={6} lg={2} style={{ margin: 'auto', padding: 5 }}>
          <Claim
            user={user}
            pools={poolList}
            poolAddress={poolAddress}
            claimable={userTotalVested}
          />
        </Col>
        <Col xs={12} lg={2} style={{ margin: 'auto', padding: 5 }}>
          <Zap
            user={user}
            setSelectedPool={setSelectedPool}
            pools={pools}
            cookAvailable={userTotalVested}
            selected={poolAddress}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Pool;
