import React, { useState } from 'react';
import { Modal } from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock
} from '../common/index';
import { claim } from '../../utils/web3';
import { isPos, toBaseUnitBN } from '../../utils/number';
import { COOK } from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";
import ActionButton from "../common/ActionButton";
import colors from '../../constants/colors';
import { Container, Row, Col } from 'react-grid-system';
import ListTable from "../PoolList/ListTable";
type ClaimProps = {
  user: string,
  poolAddress: string,
  claimable: BigNumber,
  pools?: Array<any>
};

function Claim({
  user, poolAddress, claimable, pools
}: ClaimProps) {
  const [claimAmount, setClaimAmount] = useState(new BigNumber(0));
  const [opened, setOpened] = useState(false)

  return (
    <div>
      <ActionButton
        label={"Claim"}
        onClick={() => {
          setOpened(true)
        }}
        disabled={poolAddress === '' || user === ''}
      />
      <Modal visible={opened} onClose={() => setOpened(false)}>
        <Container>
          <h1 style={{ textAlign: "center", fontSize: 40, fontWeight: 700 }}>Claim</h1>
          <ListTable pools={pools} selectedPool={poolAddress} />
          <Row >
            <Col sm={12} lg={12}>
              <BalanceBlock asset="Claimable" balance={claimable} suffix={"Cook"} type={"row"} />
            </Col>
            {/* Claim COOK rewards within Pool */}
            <Col sm={12} lg={12}>
              <>
                <BigNumberInput
                  adornment="Cook"
                  value={claimAmount}
                  setter={setClaimAmount}
                  max={() => {
                    setClaimAmount(claimable);
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
            <Col sm={6}>
              <ActionButton
                label={"CLAIM"}
                onClick={() => {
                  claim(
                    poolAddress,
                    toBaseUnitBN(claimAmount, COOK.decimals),
                    (hash) => {
                      setClaimAmount(new BigNumber(0))
                      setOpened(false)
                    }
                  );
                }}
                disabled={poolAddress === '' || user === '' || !isPos(claimAmount) || claimAmount.isGreaterThan(claimable)}
              />
            </Col>
          </Row>
        </Container>
      </Modal>
    </div>
  );
}

export default Claim;
