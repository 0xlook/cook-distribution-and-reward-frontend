import React, { useState } from 'react';
import {
  Modal, DropDown
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock, PriceSection
} from '../common/index';
import {approve, zap} from '../../utils/web3';
import {toBaseUnitBN, toTokenUnitsBN} from '../../utils/number';
import {COOK, WETH} from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";
import colors from '../../constants/colors';
import ActionButton from "../common/ActionButton";
import HelpText from "../common/HelpText";
import { Row, Col } from 'react-grid-system';
import ListTable from "../PoolList/ListTable";

type ZapProps = {
  user: string,
  pools: Array<{name:string,address:string,rewardPerBlock:BigNumber,lockedUpPeriod:BigNumber}>,
  cookAvailable: BigNumber,
  wethBalance: BigNumber,
  wethAllowance: BigNumber,
  pairBalanceWETH: BigNumber,
  pairBalanceCOOK: BigNumber,
  selected?:string,
  type:string,
};

function Zap({
  user, pools, cookAvailable, wethBalance, wethAllowance, pairBalanceWETH, pairBalanceCOOK, selected, type
}: ZapProps) {

  const [zapAmount, setZapAmount] = useState(new BigNumber(0));
  const [wethAmount, setWethAmount] = useState(new BigNumber(0));
  const [opened, setOpened] = useState(false)
  const [selectedPool, setSelectedPool] = useState(selected||'')
  const [balanceType, setBalanceType] = useState(0)

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
    return(
      <div>
      <ActionButton label={"Zap"} color={colors.button} onClick={()=>{
        setOpened(true)
      }} disabled={!user}/>
      <Modal visible={opened} onClose={()=>close()}>
      <div style={{flexBasis: '100%', paddingTop: '5%'}}>
          <ListTable pools={pools} selectedPool={selectedPool} setSelectedPool={setSelectedPool}/>
          <Row style={{padding:10}}>
          <Col><BalanceBlock asset="Available COOK" balance={cookAvailable} suffix={"COOK"} type={"row"}/></Col>
          <Col>
          <BalanceBlock asset="WETH Balance" balance={wethBalance} type={"row"} suffix={<DropDown
                items={['WETH']}
                selected={balanceType}
                onChange={setBalanceType}
              />}/>
          </Col>
          </Row>
        <Row>
          <Col xs={12}>
              <BigNumberInput
                adornment="COOK"
                value={zapAmount}
                max={() => {
                  onChangeAmountCOOK(cookAvailable);
                }}
                setter={onChangeAmountCOOK}
              />
              <PriceSection label="Requires " amt={wethAmount} symbol=" WETH"/>

          </Col>
          {wethAllowance.comparedTo(wethAmount) > 0 ?
            <Col xs={12} style={{textAlign:"center"}}>
              <ActionButton
                label={"Zap"} color={colors.button}
                onClick={() => {
                  if(selectedPool){
                    zap(
                        selectedPool,
                        toBaseUnitBN(zapAmount, COOK.decimals),
                        (hash) => {
                          setWethAmount(new BigNumber(0));
                          setZapAmount(new BigNumber(0));
                          close()
                        }
                      );
                  }
                }}
                disabled={selectedPool === '' || user === ''}
              />
            </Col>
          :
          <Col xs={12} style={{textAlign:"center"}}>
            <ActionButton
              color={colors.button}
              label="Approve"
              onClick={() => {
                if(selectedPool){
                  approve(WETH.addr, selectedPool);
                }
              }}
              disabled={selectedPool === '' || user === ''}
            />
          </Col>
          }
        </Row>
      </div>
      <HelpText label={"zap descript"} amt={''}/>
      </Modal>
      </div>
    )
  }

  return (
    renderPoolZap()
  );
}

export default Zap;
