import React, { useState } from 'react';
import {
  Modal, DropDown
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock, PriceSection
} from '../common/index';
import { zapCook } from '../../utils/web3';
import { toBaseUnitBN } from '../../utils/number';
import { COOK } from "../../constants/tokens";
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
  selected: string,
};

function Zap({
  user, pools, cookAvailable, selected,
}: ZapProps) {

  const [zapAmount, setZapAmount] = useState(new BigNumber(0));
  const [opened, setOpened] = useState(false)

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
        <ActionButton label={"Zap"}
          icon={<InfoIcon text="zap description" />}
          size={14}
          onClick={() => {
            setOpened(true)
          }} disabled={!user} />
        <Modal visible={opened} onClose={() => close()}>
          <div style={{ padding: 20 }}>
            <h1 style={{ textAlign: "center", fontSize: 40, fontWeight: 700 }}>Zap</h1>
            <ListTable pools={pools} selectedPool={selected} />

            <Row>
              <Col xs={12}><BalanceBlock asset="Available Cook" balance={cookAvailable} suffix={"Cook"} type={"row"} /></Col>
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
              <Col xs={6} >
                <ActionButton
                  label={"Zap"}
                  type="filled"
                  onClick={() => {
                    if (selected) {
                      zapCook(
                        selected,
                        toBaseUnitBN(zapAmount, COOK.decimals),
                        (hash) => {
                          setZapAmount(new BigNumber(0));
                          close()
                        }
                      );
                    }
                  }}
                  disabled={selected === '' || user === ''}
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

export default Zap;
