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

const renderField = (title: string, value: any) => {
  return (
    <div style={{ textAlign: "left" }}>
      <div style={{ fontWeight: "bold" }}>{title}</div>
      <div>{value}</div>
    </div>
  )

}


const WithdrawPageHeader = ({
  accountVestingBalance, accountAvalibleBalance, accountVestedBalance, todayNumber, startDayNumber
}: WithdrawPageHeaderProps) => {
  console.log(accountAvalibleBalance.toFixed())
  return (
    <div>

      <Row>
        <Col xs={12} md={12} xl={4}>{renderField("Total Token", <BalanceBlock asset="" balance={10000000} suffix={" Cook"} />)}</Col>
        {/* <Col xs={12} md={4} xl={2}>{renderField("Total Allocated Token", <BalanceBlock asset="" balance={accountVestingBalance} suffix={" Cook"} />)}</Col>
      <Col xs={12} md={4} xl={2}>{renderField("Vesting Token", <BalanceBlock asset="" balance={accountVestingBalance.minus(accountVestedBalance)} suffix={" Cook"} />)}</Col> */}
        <Col xs={12} md={6} xl={4}>{renderField("Claimed Token", <BalanceBlock asset="" balance={accountVestedBalance.minus(accountAvalibleBalance)} suffix={" Cook"} />)}</Col>
        <Col xs={12} md={6} xl={4}>{renderField("Available Token", <BalanceBlock asset="" balance={accountAvalibleBalance} suffix={" Cook"} />)}</Col>
      </Row>
    </div>
  )




};


export default WithdrawPageHeader;
