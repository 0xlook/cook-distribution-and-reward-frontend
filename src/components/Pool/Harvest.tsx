import React, { useState } from 'react';
import {
  Modal
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import { BalanceBlock } from '../common/index';
import { harvest } from '../../utils/web3';
import { isPos, toBaseUnitBN } from '../../utils/number';
import { COOK } from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";
import ActionButton from "../common/ActionButton";
import InfoIcon from "../common/InfoIcon";
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
  user, poolAddress, userTotalRewarded, userTotalInVesting, pools
}: HarvestProps) {
  const [harvestAmount, setHarvestAmount] = useState(new BigNumber(0));
  const [opened, setOpened] = useState(false)
  return (
    <div>
      <span>
        <ActionButton
          label={"Harvest"}
          icon={<InfoIcon text="Harvest Description" />}
          type="filled"
          onClick={() => {
            setOpened(true)
          }}
          disabled={poolAddress === '' || user === ''}
        />

      </span>

      <Modal visible={opened} onClose={() => setOpened(false)} >
        <div style={{ padding: 20 }}>
          <h1 style={{ textAlign: "center", fontSize: 40, fontWeight: 700 }}>Harvest</h1>
          <ListTable pools={pools} selectedPool={poolAddress} />
          <Row >
            <Col xs={12}>
              <BalanceBlock asset="To Be Vested" balance={userTotalRewarded} suffix={"Cook"} type={"row"} />
            </Col>
            <Col xs={12}>
              <BalanceBlock asset="In Vesting" balance={userTotalInVesting} suffix={"Cook"} type={"row"} />
            </Col>
            {/* Harvest UNI-V2 within Pool */}
            <Col xs={12}>
              <BigNumberInput
                adornment="Cook"
                value={harvestAmount}
                setter={setHarvestAmount}
                max={() => {
                  setHarvestAmount(userTotalRewarded);
                }}
              />

            </Col>
            <Col xs={6}>
              <ActionButton
                label="Cancel"
                type="cancel"
                onClick={() => {
                  setOpened(false)
                }}
                disabled={false}
              />
            </Col>
            <Col xs={6}>
              <ActionButton
                label={"Harvest"}
                type="filled"
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
        </div>
      </Modal>
    </div>
  );
}

export default Harvest;
