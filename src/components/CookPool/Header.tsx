import React from 'react';
import BigNumber from 'bignumber.js';

import { BalanceBlock } from '../common/index';
import { Container, Row, Col } from 'react-grid-system';
type PoolPageHeaderProps = {
  stakeLockupDuration: number,
  totalStaked: BigNumber
};

const PoolPageHeader = ({
  stakeLockupDuration, totalStaked
}: PoolPageHeaderProps) => (
  <Container>
    <Row style={{ padding: '2%', marginBottom: 24, alignItems: 'center' }}>
      <Col xs={4}>
        <BalanceBlock asset="Total Staked" balance={totalStaked} suffix={" Cook"} />
      </Col>
      <Col xs={4}>
        <BalanceBlock asset="Lock-up Period" balance={stakeLockupDuration} suffix={" Day(s)"} />
      </Col>
      <Col xs={4}>
        <BalanceBlock asset="Highest Reward Rate (APY)" balance={new BigNumber(200)} suffix={" %"} />
      </Col>
    </Row>
  </Container>

);

export default PoolPageHeader;
