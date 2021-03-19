import React from 'react';

import BigNumber from 'bignumber.js';
import {
  useViewport
} from '@aragon/ui';
import LinearText from "../common/LinearText";
import { Row, Col } from 'react-grid-system';

type BlanceBlockProps = {
  asset: string,
  balance: BigNumber | string | number
  suffix?: any
  type?: string
}

function BalanceBlock({ asset, balance, suffix = "", type = "" }: BlanceBlockProps) {
  let integer = '0';
  let digits = '0';
  let bigNumber = new BigNumber(balance)
  const { below } = useViewport()
  if (new BigNumber(balance).gt(new BigNumber(0))) {
    if (bigNumber.gte(1000000)) {
      let str = (bigNumber.div(1000000)).toLocaleString()
      const split = str.split('.');
      integer = split[0]
      digits = split.length > 1 ? str.split('.')[1] : '0';
      digits = digits.length > 2 ? digits.substr(0, 2) : digits
      digits += 'M'

    } else {
      let str = balance.toLocaleString()
      const split = str.split('.');
      integer = split[0];
      digits = split.length > 1 ? str.split('.')[1] : '0';
      digits = digits.length > 2 ? digits.substr(0, 2) : digits
    }

  }
  const fontSize = below('medium') ? "30px" : "50px"

  if (type === "block") {
    return (
      <>
        <Row>
          <Col md={12} style={{ padding: 5, fontWeight: 700 }}>{asset}</Col>
          <Col md={12} style={{ padding: 5, fontWeight: 700 }}>
            <LinearText text={`${integer}.${digits}`} size={fontSize} />
            {suffix === "" ? '' : <span style={{ fontSize: 14 }}> {suffix}</span>}
          </Col>
        </Row>
      </>
    )
  }
  if (type === "row") {
    return (
      <>
        <Row style={{ padding: 15, height: '100px' }} align="center">
          <Col xs={12} md={6} style={{ padding: 0, fontSize: 16, textAlign: "left", fontWeight: 700 }}>{asset}</Col>
          <Col xs={12} md={6} style={{ padding: 0, textAlign: "right", fontWeight: 700 }}>
            <LinearText text={`${integer}.${digits}`} size={fontSize} />
            {suffix === "" ? '' : <span style={{ fontSize: 14 }}> {suffix}</span>}
          </Col>
        </Row>
      </>
    )
  }
  return (
    <>
      <div style={{ fontSize: 14, padding: 3 }}>{asset}</div>
      <div style={{ padding: 3, fontWeight: 700 }}>
        <LinearText text={`${integer}.${digits}`} size={fontSize} />
        {suffix === "" ? '' : <span style={{ fontSize: 14 }}> {suffix}</span>}
      </div>
    </>
  );
}

export default BalanceBlock;
