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
}: WithdrawPageHeaderProps) => {
  return (
    <div>

      <Row style={{ textAlign: "left" }}>
        <Col xs={12} md={12} xl={12}>{<BalanceBlock asset="Total Token" balance={10000000000} suffix={" Cook"} />}</Col>
        {/* <Col xs={12} md={6} xl={6}>{<BalanceBlock asset="Total Allocated Token" balance={accountVestingBalance} suffix={" Cook"} />}</Col> */}
        {/* <Col xs={12} md={6} xl={6}>{<BalanceBlock asset="Vesting Token" balance={accountVestingBalance.minus(accountVestedBalance)} suffix={" Cook"} />}</Col> */}
        <Col xs={12} md={6} xl={6}>{<BalanceBlock asset="Claimed Token" balance={accountVestedBalance.minus(accountAvalibleBalance)} suffix={" Cook"} />}</Col>
        <Col xs={12} md={6} xl={6}>{<BalanceBlock asset="ailable Token" balance={accountAvalibleBalance} suffix={" Cook"} />}</Col>
      </Row>
    </div>
  )




};


export default WithdrawPageHeader;
