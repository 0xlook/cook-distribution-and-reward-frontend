import React, { useState } from 'react';
import {
  Modal, Text
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import { Container, Row, Col } from 'react-grid-system';
import {
  BalanceBlock
} from '../common/index';
import {withdraw} from '../../utils/web3';
import {toBaseUnitBN} from '../../utils/number';
import {COOK} from "../../constants/tokens";
import {CookDistribution} from "../../constants/contracts";
import BigNumberInput from "../common/BigNumberInput";
import colors from '../../constants/colors';
import ActionButton from "../common/ActionButton";

type WithdrawProps = {
  user: string
  vestingAmount: BigNumber,
  availableAmount: BigNumber,
  records: Array<{transactionHash: string; returnValues:{amount:string}}>
};

function Withdraw({
  user, vestingAmount, availableAmount, records
}: WithdrawProps) {
  const [withdrawAmount, setWithdrawAmount] = useState(new BigNumber(0));
  const [opened, setOpened] = useState(false)
  return (
    <div>
    <ActionButton label={"CLAIM"} color={colors.button} onClick={()=>{
      setOpened(true)
    }} disabled={!user}/>
    <Modal visible={opened} onClose={()=>setOpened(false)}>
      <Text>Claim</Text>
        <Container>
        <Row>
        <Col xs={12} ><BalanceBlock asset="Total Available" balance={availableAmount} type={"row"} suffix={"COOK"}/></Col>
        <Col xs={12} >
        <BigNumberInput
          adornment="COOK"
          max={() => {
            setWithdrawAmount(availableAmount);
          }}
          value={withdrawAmount}
          setter={setWithdrawAmount}
        />
        </Col>
        <Col xs={12} style={{textAlign:"center"}}>
        <ActionButton label={"CLAIM"} color={colors.button} onClick={()=>{
          withdraw(
            CookDistribution,
            toBaseUnitBN(withdrawAmount, COOK.decimals),
          );
        }} disabled={false}/></Col>
        </Row>
        </Container>

    </Modal>

    </div>
  );
}

export default Withdraw;
