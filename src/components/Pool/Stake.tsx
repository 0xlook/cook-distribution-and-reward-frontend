import React, { useState } from 'react';
import { Modal } from '@aragon/ui';
import BigNumber from 'bignumber.js';
import { BalanceBlock } from '../common/index';
import { approve, stake } from '../../utils/web3';
import { isPos, toBaseUnitBN } from '../../utils/number';
import { UNI } from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";
import ActionButton from "../common/ActionButton";
import colors from '../../constants/colors';
import { Container, Row, Col } from 'react-grid-system';
import ListTable from "../PoolList/ListTable";

type StakeProps = {
  user: string,
  poolAddress: string,
  balance: BigNumber,
  allowance: BigNumber,
  staked: BigNumber
  pools?: Array<any>
};

function Stake({
  user, poolAddress,
  staked, balance, allowance, pools
}: StakeProps) {
  const [stakeAmount, setStakeAmount] = useState(new BigNumber(0));
  const [opened, setOpened] = useState(false)
  return (
    <div>
      <ActionButton
        label={"Deposit"}
        size={14}
        width={"120px"}
        onClick={() => {
          setOpened(true)
        }}
        disabled={poolAddress === '' || user === ''}
      />
      <Modal visible={opened} onClose={() => setOpened(false)}>
        <Container >
          <h1 style={{ textAlign: "center", fontSize: 40, fontWeight: 700 }}>Deposit</h1>
          <ListTable pools={pools} selectedPool={poolAddress} />
          <Row >
            <Col sm={12} xl={12}>
              <BalanceBlock asset="Balance" balance={balance} suffix={"UNI-V2"} type={"row"} />
            </Col>
            <Col sm={12} xl={12}>

              <>
                <BigNumberInput
                  adornment="UNI-V2"
                  value={stakeAmount}
                  setter={setStakeAmount}
                  max={() => {
                    setStakeAmount(balance);
                  }}
                />

              </>
            </Col>
            <Col sm={6}>
              <ActionButton

                label="Cancel"
                onClick={() => {
                  setOpened(false)
                }}
                disabled={false}
              />
            </Col>
            {allowance.comparedTo(stakeAmount) > 0 ?
              <Col md={6} >
                <ActionButton
                  label={"DEPOSIT"}
                  color={colors.button}
                  onClick={() => {
                    stake(
                      poolAddress,
                      toBaseUnitBN(stakeAmount, UNI.decimals),
                      (hash) => {
                        setStakeAmount(new BigNumber(0))
                        setOpened(false)
                      }
                    );
                  }}
                  disabled={poolAddress === '' || user === '' || !isPos(stakeAmount) || stakeAmount.isGreaterThan(balance)}
                />
              </Col>
              :
              <Col sm={6}>
                <ActionButton
                  label={"APPROVE"}
                  onClick={() => {
                    approve(UNI.addr, poolAddress);
                  }}
                  disabled={poolAddress === '' || user === ''}
                />
              </Col>
            }
          </Row>
        </Container>

      </Modal>
    </div>
  );
}

export default Stake;
