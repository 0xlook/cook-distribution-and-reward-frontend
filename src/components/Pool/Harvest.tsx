import React, { useState } from 'react';
import { Modal } from '@aragon/ui';
import BigNumber from 'bignumber.js';
import { BalanceBlock } from '../common/index';
import {harvest} from '../../utils/web3';
import {isPos, toBaseUnitBN} from '../../utils/number';
import {COOK} from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";
import ActionButton from "../common/ActionButton";
import colors from '../../constants/colors';
import { Container, Row, Col } from 'react-grid-system';
import ListTable from "../PoolList/ListTable";

type HarvestProps = {
  user: string,
  poolAddress: string,
  userTotalRewarded: BigNumber,
  userTotalInVesting: BigNumber,
  pools?: Array<any>
};

function Harvest({
  user, poolAddress, userTotalRewarded, userTotalInVesting,pools
}: HarvestProps) {
  const [harvestAmount, setHarvestAmount] = useState(new BigNumber(0));
  const [opened, setOpened] = useState(false)
  return (
    <div>
    <ActionButton
      label={"HARVEST"}
      color={colors.secondaryButton}
      onClick={() => {
        setOpened(true)
      }}
      disabled={poolAddress === '' || user === ''}
    />
    <Modal visible={opened} onClose={()=>setOpened(false)} >
    <Container style={{flexBasis: '100%', paddingTop: '5%'}}>
      <ListTable pools={pools} selectedPool={poolAddress}/>
      <Row >
        <Col sm={12} lg={6}>
          <BalanceBlock asset="To Be Vested" balance={userTotalRewarded} suffix={"COOK"} type={"row"}/>
        </Col>
        <Col sm={12} lg={6}>
          <BalanceBlock asset="In Vesting" balance={userTotalInVesting} suffix={"COOK"} type={"row"}/>
        </Col>
        {/* Harvest UNI-V2 within Pool */}
        <Col sm={12} lg={12}>
              <>
                <BigNumberInput
                  adornment="COOK"
                  value={harvestAmount}
                  setter={setHarvestAmount}
                  max={() => {
                    setHarvestAmount(userTotalRewarded);
                  }}
                />
              
              </>
              </Col>
        <Col sm={12} lg={12} style={{textAlign:"center"}}>
        <ActionButton
          label={"HARVEST"}
          color={colors.secondaryButton}
          onClick={() => {
            harvest(
              poolAddress,
              toBaseUnitBN(harvestAmount, COOK.decimals),
              (hash) => {
                setHarvestAmount(new BigNumber(0))
                setOpened(false)
              }
            );
          }}
          disabled={poolAddress === '' || user === '' || !isPos(harvestAmount) || harvestAmount.isGreaterThan(userTotalRewarded)}
        />
      </Col>
          </Row>
        </Container>
    </Modal>
    </div>
  );
}

export default Harvest;
