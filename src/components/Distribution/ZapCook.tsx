import React, { useState, useEffect } from 'react';
import {
  Modal, DropDown
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock, PriceSection
} from '../common/index';
import { distributionZap, approve } from '../../utils/web3';
import { toBaseUnitBN, toTokenUnitsBN } from '../../utils/number';
import { COOK, WETH } from "../../constants/tokens";
import { CookDistribution } from "../../constants/contracts";
import BigNumberInput from "../common/BigNumberInput";
import colors from '../../constants/colors';
import ActionButton from "../common/ActionButton";
import HelpText from "../common/HelpText";
import { Row, Col } from 'react-grid-system';
import ListTable from "../PoolList/ListTable";

type ZapProps = {
  user: string,
  pools: Array<{ name: string, address: string, rewardPerBlock: BigNumber, lockedUpPeriod: BigNumber }>,
  cookAvailable: BigNumber,
  wethBalance: BigNumber,
  wethAllowance: BigNumber,
  pairBalanceWETH: BigNumber,
  pairBalanceCOOK: BigNumber,
  selected?: string
};

function DistributionZap({
  user, pools, cookAvailable, wethBalance, wethAllowance, pairBalanceWETH, pairBalanceCOOK, selected
}: ZapProps) {
  const [zapAmount, setZapAmount] = useState(new BigNumber(0));
  const [wethAmount, setWethAmount] = useState(new BigNumber(0));
  const [opened, setOpened] = useState(false)
  const [selectedPool, setSelectedPool] = useState(selected || '')
  const [balanceType, setBalanceType] = useState(0)

  useEffect(() => {

    if (selected) {
      setSelectedPool(selected)
    }

  }, [selectedPool, selected])

  const close = () => {
    setOpened(false);
    setZapAmount(new BigNumber(0));
    setWethAmount(new BigNumber(0));
  }

  const WETHToCOOKRatio = pairBalanceWETH.isZero() ? new BigNumber(1) : pairBalanceWETH.div(pairBalanceCOOK);

  const onChangeAmountCOOK = (amountCOOK) => {
    if (!amountCOOK) {
      setWethAmount(new BigNumber(0));
      return;
    }

    const amountCOOKBN = new BigNumber(amountCOOK)
    setZapAmount(amountCOOKBN);

    const amountCOOKBU = toBaseUnitBN(amountCOOKBN, COOK.decimals);
    const newAmountWETH = toTokenUnitsBN(
      amountCOOKBU.multipliedBy(WETHToCOOKRatio).integerValue(BigNumber.ROUND_FLOOR),
      COOK.decimals);
    setWethAmount(newAmountWETH);
  };
  const renderPoolZap = () => {
    return (
      <div>
        <ActionButton label={"Zap Cook"} color={colors.linear} onClick={() => {
          setOpened(true)
        }} disabled={!user} />
        <Modal visible={opened} onClose={() => close()}>
          <div style={{ paddingTop: '5%', padding: 20 }}>
            <h1 style={{ textAlign: "center", fontSize: 45, fontWeight: 700 }}>Zap Cook</h1>
            <ListTable pools={pools} selectedPool={selectedPool} setSelectedPool={setSelectedPool} />
            <Row style={{ padding: 10 }}>
              <Col xs={12}><BalanceBlock asset="Available Cook" balance={cookAvailable} suffix={"Cook"} type={"row"} /></Col>
              <Col xs={12}>
                <BalanceBlock asset="WETH Balance" balance={wethBalance} type={"row"} suffix={
                  <span style={{ fontSize: 14 }}> WETH</span>} />
              </Col>
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
                <PriceSection label="Requires " amt={wethAmount} symbol=" WETH" />

              </Col>
              <Col xs={6} style={{ textAlign: "center" }}>
                <ActionButton
                  label="Cancel"
                  onClick={() => {
                    close()
                  }}
                  disabled={false}
                />
              </Col>
              {wethAllowance.comparedTo(wethAmount) > 0 ?
                <Col xs={6} style={{ textAlign: "center" }}>
                  <ActionButton
                    label={"Zap"} color={colors.button}
                    onClick={() => {
                      if (selectedPool) {
                        distributionZap(
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
                :
                <Col xs={6} style={{ textAlign: "center" }}>
                  <ActionButton
                    label="Approve"
                    onClick={() => {
                      if (selectedPool) {
                        approve(WETH.addr, CookDistribution);
                      }
                    }}
                    disabled={selectedPool === '' || user === ''}
                  />
                </Col>
              }
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
