import React from 'react';
import BigNumber from 'bignumber.js';
import { Container, Row, Col } from 'react-grid-system';
import { BalanceBlock, Card } from '../common/index';

type WithdrawPageHeaderProps = {
  accountVestingBalance: BigNumber,
  accountAvalibleBalance: BigNumber,
  accountVestedBalance: BigNumber,
  todayNumber: BigNumber,
  startDayNumber: BigNumber
};



const WithdrawPageHeader = ({
  accountVestingBalance, accountAvalibleBalance, accountVestedBalance, todayNumber, startDayNumber
}: WithdrawPageHeaderProps) => (
  <div>
  <div style={{ padding: '2%', display: 'flex', alignItems: 'center' }}>
    <Container>
      <Row>
       <Col xs={12} md={6}><Card label={"Total Allocated Token"} value={<BalanceBlock asset="" balance={accountVestingBalance} suffix={" COOK"}/>}/></Col>
       <Col xs={12} md={6} ><Card label={"Vesting Token"} value={<BalanceBlock asset="" balance={accountVestingBalance.minus(accountVestedBalance)} suffix={" COOK"}/>}/></Col>
       <Col xs={12} md={6} ><Card label={"Claimed Token"} value={<BalanceBlock asset="" balance={accountVestedBalance.minus(accountAvalibleBalance)} suffix={" COOK"}/>}/></Col>
       <Col xs={12} md={6} ><Card label={"Available Token"} value={<BalanceBlock asset="" balance={accountAvalibleBalance} suffix={" COOK"}/>}/></Col>
     </Row>

    </Container>
  </div>
  </div>
);


export default WithdrawPageHeader;
