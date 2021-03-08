import React from 'react';

import BigNumber from 'bignumber.js';
import colors from '../../constants/colors';
import { Row, Col } from 'react-grid-system';
type BlanceBlockProps = {
  asset: string,
  balance: BigNumber | string | number
  suffix?: any
  type?: string
}

function BalanceBlock({ asset, balance, suffix="", type="" }: BlanceBlockProps) {
  let integer = '0';
  let digits = '0';
  if (new BigNumber(balance).gt(new BigNumber(0))) {
    const str = new BigNumber(balance).toString();
    const split = str.split('.');
    integer = split[0];
    digits = split.length > 1 ? str.split('.')[1] : '0';
    digits = digits.length > 2 ? digits.substr(0, 2) : digits
  }
  if(type === "row"){
    return(
      <>
      <Row>
        <Col md={12} style={{padding:5}}>{asset}</Col>
        <Col md={12} style={{ padding:5,fontSize: 30, color:colors.button}}>
          <span style={{ }}>{integer}</span>
          .
          <span style={{}}>
            {digits}
          </span>
          {suffix === "" ? '' : <span style={{ fontSize: 18 }}> {suffix}</span> }
        </Col>
        </Row>
      </>
    )
  }
  if(type === "block"){
    return(
      <>
      <Row style={{padding:15}}>
        <Col xs={12} md={6} style={{padding:0, fontSize: 24, textAlign:"left"}}>{asset}</Col>
        <Col xs={12} md={6} style={{ padding:0,fontSize: 30, color:colors.button, textAlign:"right"}}>
          <span style={{ }}>{integer}</span>
          .
          <span style={{}}>
            {digits}
          </span>
          {suffix === "" ? '' : <span style={{ fontSize: 30 }}> {suffix}</span> }
        </Col>
        </Row>
      </>
    )
  }
  return (
    <>
      <div style={{ fontSize: 14, padding: 3 }}>{asset}</div>
      <div style={{ padding: 3 }}>
        <span style={{ fontSize: 30 }}>{integer}</span>
        .
        <span style={{ fontSize: 30 }}>
          {' '}
          {digits}
          {' '}
        </span>
        {suffix === "" ? '' : <span style={{ fontSize: 30 }}> {suffix}</span> }
      </div>
    </>
  );
}

export default BalanceBlock;
