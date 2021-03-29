import React, { useState, useEffect } from 'react';
import { DropDown } from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock, PriceSection
} from '../common/index';
import { approve, zapLP, zapLPWithEth } from '../../utils/web3';
import { toBaseUnitBN, toTokenUnitsBN } from '../../utils/number';
import { COOK, WETH } from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";
import colors from '../../constants/colors';
import ActionButton from "../common/ActionButton";
import HelpText from "../common/HelpText";
import { Row, Col } from 'react-grid-system';
import ListTable from "../PoolList/ListTable";
import InfoIcon from "../common/InfoIcon";
import Modal from 'react-modal';

type ZapProps = {
  user: string,
  pools: Array<{ name: string, address: string, rewardPerBlock: BigNumber, lockedUpPeriod: BigNumber, isFull: boolean }>,
  cookAvailable: BigNumber,
  wethBalance: Array<BigNumber>,
  wethAllowance: BigNumber,
  pairBalanceWETH: Array<BigNumber>,
  pairBalanceCOOK: BigNumber,
  selected: string,
};



function Zap({
  user, pools, cookAvailable, wethBalance, wethAllowance, pairBalanceWETH, pairBalanceCOOK, selected,
}: ZapProps) {
  const ETHIndex = 1
  const [zapAmount, setZapAmount] = useState(new BigNumber(0));
  const [wethAmount, setWethAmount] = useState(new BigNumber(0));
  const [opened, setOpened] = useState(false)
  const [balanceType, setBalanceType] = useState(0)
  const zapCurrency = ['WETH', 'ETH']
  const close = () => {
    setOpened(false);
    setZapAmount(new BigNumber(0));
    setWethAmount(new BigNumber(0));
  }

  useEffect(() => {
    onChangeAmountCOOK(zapAmount)
  }, [balanceType])

  const WETHToCOOKRatio = new Array()
  for (let i = 0; i < pairBalanceWETH.length; i++) {
    WETHToCOOKRatio.push(pairBalanceWETH[i].isZero() ? new BigNumber(1) : pairBalanceWETH[i].div(pairBalanceCOOK))
  }
  const onChangeAmountCOOK = (amountCOOK) => {
    if (!amountCOOK) {
      setWethAmount(new BigNumber(0));
      return;
    }

    const amountCOOKBN = new BigNumber(amountCOOK)
    setZapAmount(amountCOOKBN);

    const amountCOOKBU = toBaseUnitBN(amountCOOKBN, COOK.decimals);
    const newAmountWETH = toTokenUnitsBN(
      amountCOOKBU.multipliedBy(WETHToCOOKRatio[balanceType]).integerValue(BigNumber.ROUND_FLOOR),
      COOK.decimals);
    setWethAmount(newAmountWETH);
  };
  const renderPoolZap = () => {
    return (
      <div>
        <ActionButton label={"Zap"} type="filled"
          icon={<InfoIcon text="zap description" />}
          onClick={() => {
            setOpened(true)
          }} disabled={!user} />
        <Modal isOpen={opened} onRequestClose={() => close()}
          className="Modal"
          overlayClassName="Overlay">
          <div style={{ padding: 20 }}>
            <h1 style={{ textAlign: "center", fontSize: 40, fontWeight: 700 }}>Zap</h1>
            <ListTable pools={pools} selectedPool={selected} />

            <Row>
              <Col xs={12}><BalanceBlock asset="Available Cook" balance={cookAvailable} suffix={"Cook"} type={"row"} /></Col>
              <Col xs={12}>
                <BalanceBlock asset={<DropDown
                  style={{ border: "0px" }}
                  items={zapCurrency}
                  selected={balanceType}
                  onChange={setBalanceType} />}
                  balance={wethBalance[balanceType]} type={"row"} suffix={
                    <span style={{ fontSize: 14 }}> {zapCurrency[balanceType]}</span>
                  } />
              </Col>
              <Col xs={12}>
                <BigNumberInput
                  adornment="Cook"
                  value={zapAmount}
                  max={() => {
                    onChangeAmountCOOK(cookAvailable);
                  }}
                  setter={onChangeAmountCOOK}
                />
                <PriceSection label="Requires " amt={wethAmount} symbol={zapCurrency[balanceType]} />

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

              {balanceType == ETHIndex || wethAllowance.comparedTo(wethAmount) > 0 ?
                <Col xs={6} >
                  <ActionButton
                    label={"Zap"}
                    type="filled"
                    onClick={() => {
                      if (selected) {
                        if (balanceType == ETHIndex) {
                          zapLPWithEth(
                            selected,
                            toBaseUnitBN(zapAmount, COOK.decimals),
                            (hash) => {
                              setWethAmount(new BigNumber(0));
                              setZapAmount(new BigNumber(0));
                              close()
                            }
                          );
                        } else {
                          zapLP(
                            selected,
                            toBaseUnitBN(zapAmount, COOK.decimals),
                            (hash) => {
                              setWethAmount(new BigNumber(0));
                              setZapAmount(new BigNumber(0));
                              close()
                            }
                          );
                        }

                      }
                    }}
                    disabled={selected === '' || user === ''}
                  />
                </Col>
                :
                <Col xs={6} >
                  <ActionButton
                    label="Approve"
                    type="filled"
                    onClick={() => {
                      if (selected) {
                        approve(WETH.addr, selected);
                      }
                    }}
                    disabled={selected === '' || user === ''}
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

export default Zap;
