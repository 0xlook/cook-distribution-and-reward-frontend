import React, { useState, useEffect } from 'react';
import {
  Modal, DropDown
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock, PriceSection
} from '../common/index';
import { cookDistributionZap, approve } from '../../utils/web3';
import { toBaseUnitBN, toTokenUnitsBN } from '../../utils/number';
import { COOK, WETH } from "../../constants/tokens";
import { CookDistribution } from "../../constants/contracts";
import BigNumberInput from "../common/BigNumberInput";
import colors from '../../constants/colors';
import ActionButton from "../common/ActionButton";
import HelpText from "../common/HelpText";
import { Row, Col } from 'react-grid-system';
import ListTable from "../PoolList/ListTable";
import InfoIcon from "../common/InfoIcon";

type ZapProps = {
  user: string,
  pools: Array<{ name: string, address: string, rewardPerBlock: BigNumber, lockedUpPeriod: BigNumber }>,
  cookAvailable: BigNumber,
  selected?: string
};

function DistributionZap({
  user, pools, cookAvailable, selected
}: ZapProps) {
  const [zapAmount, setZapAmount] = useState(new BigNumber(0));
  const [opened, setOpened] = useState(false)
  const [selectedPool, setSelectedPool] = useState(selected || '')

  useEffect(() => {

    if (selected) {
      setSelectedPool(selected)
    }

  }, [selectedPool, selected])

  const close = () => {
    setOpened(false);
    setZapAmount(new BigNumber(0));
  }


  const onChangeAmountCOOK = (amountCOOK) => {

    const amountCOOKBN = new BigNumber(amountCOOK)
    setZapAmount(amountCOOKBN);

  };
  const renderPoolZap = () => {
    return (
      <div>
        <ActionButton label={"Zap Cook"}
          icon={<InfoIcon text="zap description" />}
          color={colors.linear} onClick={() => {
            setOpened(true)
          }} disabled={!user} />
        <Modal visible={opened} onClose={() => close()}>
          <div style={{ padding: 20 }}>
            <h1 style={{ textAlign: "center", fontSize: 45, fontWeight: 700 }}>Zap Cook</h1>
            <ListTable pools={pools} selectedPool={selectedPool} setSelectedPool={setSelectedPool} />
            <Row style={{ padding: 10 }}>
              <Col xs={12}><BalanceBlock asset="Available Cook" balance={cookAvailable} suffix={"Cook"} type={"row"} /></Col>

            </Row>
            <Row>
              <Col xs={12}>
                <BigNumberInput
                  adornment="Cook"
                  value={zapAmount}
                  max={() => {
                    onChangeAmountCOOK(cookAvailable);
                  }}
                  setter={onChangeAmountCOOK}
                />

              </Col>
              <Col xs={6} style={{ textAlign: "center" }}>
                <ActionButton
                  type="cancel"
                  label="Cancel"
                  onClick={() => {
                    close()
                  }}
                  disabled={false}
                />
              </Col>
              <Col xs={6} style={{ textAlign: "center" }}>
                <ActionButton
                  type="filled"
                  label={"Zap"}
                  onClick={() => {
                    console.log(selectedPool)
                    if (selectedPool) {
                      console.log(CookDistribution,
                        selectedPool,
                        zapAmount,
                        toBaseUnitBN(zapAmount, COOK.decimals))
                      cookDistributionZap(
                        CookDistribution,
                        selectedPool,
                        toBaseUnitBN(zapAmount, COOK.decimals),
                        (hash) => {
                          close()
                        }
                      );
                    }

                  }}
                  disabled={selectedPool === '' || user === ''}
                />
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    )
  }

  return (
    renderPoolZap()
  );
}

export default DistributionZap;
