import React, { useState } from 'react';
import {
  Modal, Text
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import { Container, Row, Col } from 'react-grid-system';
import {
  BalanceBlock
} from '../common/index';
import { withdraw } from '../../utils/web3';
import { toBaseUnitBN } from '../../utils/number';
import { COOK } from "../../constants/tokens";
import { CookDistribution } from "../../constants/contracts";
import BigNumberInput from "../common/BigNumberInput";
import colors from '../../constants/colors';
import ActionButton from "../common/ActionButton";

type WithdrawProps = {
  user: string
  vestingAmount: BigNumber,
  availableAmount: BigNumber,
  records: Array<{ transactionHash: string; returnValues: { amount: string } }>
};

function Withdraw({
  user, vestingAmount, availableAmount, records
}: WithdrawProps) {
  const [withdrawAmount, setWithdrawAmount] = useState(new BigNumber(0));
  const [opened, setOpened] = useState(false)
  return (
    <div>
      <ActionButton label={"Claim"} onClick={() => {
        setOpened(true)
      }} disabled={!user} />
      <Modal visible={opened} onClose={() => setOpened(false)}  >
        <div style={{ padding: 20 }}>
          <h1 style={{ textAlign: "center", fontSize: 45, fontWeight: 700 }}>Claim</h1>

          <Row>
            <Col xs={12} ><BalanceBlock asset="Total Available" balance={availableAmount} type={"row"} suffix={"Cook"} /></Col>
            <Col xs={12} >
              <BigNumberInput
                adornment="Cook"
                max={() => {
                  setWithdrawAmount(availableAmount);
                }}
                value={withdrawAmount}
                setter={setWithdrawAmount}
              />
            </Col>
            <Col xs={6} style={{ textAlign: "center", marginTop: 40 }}>
              <ActionButton label={"Cancel"} onClick={() => {
                setOpened(false)
              }} disabled={false} />
            </Col>
            <Col xs={6} style={{ textAlign: "center", marginTop: 40 }}>
              <ActionButton label={"Claim"} onClick={() => {
                withdraw(
                  CookDistribution,
                  toBaseUnitBN(withdrawAmount, COOK.decimals),
                );
              }} disabled={false} />
            </Col>
          </Row>
        </div>
      </Modal>

    </div>
  );
}

export default Withdraw;
