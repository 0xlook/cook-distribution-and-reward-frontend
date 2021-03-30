import React, { useState } from "react";
import Modal from "react-modal";
import BigNumber from "bignumber.js";
import { BalanceBlock, PriceSection } from "../common/index";
import { zapCook } from "../../utils/web3";
import { toBaseUnitBN } from "../../utils/number";
import { COOK } from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";
import colors from "../../constants/colors";
import ActionButton from "../common/ActionButton";
import { Row, Col } from "react-grid-system";
import ListTable from "../PoolList/ListTable";
import InfoIcon from "../common/InfoIcon";
import { useGlobal } from "contexts";
type ZapProps = {
  user: string;
  pools: Array<{
    name: string;
    address: string;
    rewardPerBlock: BigNumber;
    lockedUpPeriod: BigNumber;
    isFull: boolean;
  }>;
  cookAvailable: BigNumber;
  selected: string;
  setSelectedPool: Function
};

function Zap({ user, pools, cookAvailable, selected, setSelectedPool }: ZapProps) {
  const [zapAmount, setZapAmount] = useState(new BigNumber(0));
  const [opened, setOpened] = useState(false);
  const { setTransactionModalVisible, setInformModalVisible } = useGlobal();

  const close = () => {
    setOpened(false);
    setZapAmount(new BigNumber(0));
  };

  const onChangeAmountCOOK = (amountCOOK) => {
    const amountCOOKBN = new BigNumber(amountCOOK);
    setZapAmount(amountCOOKBN);
  };
  const renderPoolZap = () => {
    return (
      <div>
        <ActionButton
          label={"Zap"}
          type="filled"
          icon={
            <InfoIcon text="zap description ljfklsdk tjerkltjlksjdkl tkrejklerjkltjerkltjeklsd sjdkljsdfkl" />
          }
          onClick={() => {
            if (selected) {
              setOpened(true);
            }

          }}
          disabled={!user}
        />
        <Modal
          isOpen={opened}
          onRequestClose={() => setOpened(false)}
          className="Modal"
          overlayClassName="Overlay"
        >
          <div style={{ padding: 20 }}>
            <h1 style={{ textAlign: "center", fontSize: 40, fontWeight: 700 }}>
              Zap
            </h1>
            <ListTable pools={pools} selectedPool={selected} setSelectedPool={setSelectedPool} />

            <Row>
              <Col xs={12}>
                <BalanceBlock
                  asset="Available Cook"
                  balance={cookAvailable}
                  suffix={"Cook"}
                  type={"row"}
                />
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
              </Col>
              <Col xs={6}>
                <ActionButton
                  label="Cancel"
                  type="cancel"
                  onClick={() => {
                    setOpened(false);
                  }}
                  disabled={false}
                />
              </Col>
              <Col xs={6}>
                <ActionButton
                  label={"Zap"}
                  type="filled"
                  onClick={() => {
                    if (selected) {
                      if (zapAmount.isZero() || zapAmount.comparedTo(cookAvailable) > 0) {
                        setInformModalVisible(true, "Invalid Number");
                        return
                      }
                      setTransactionModalVisible(
                        true,
                        "",
                        "Follow wallet instructions"
                      );
                      zapCook(
                        selected,
                        toBaseUnitBN(zapAmount, COOK.decimals),
                        (txHash) => {
                          setTransactionModalVisible(true, txHash);
                        },
                        () => {
                          setTransactionModalVisible(false);
                          setZapAmount(new BigNumber(0));
                          close();
                        },
                        (error) => {
                          console.error(error);
                          setTransactionModalVisible(false);
                        }
                      );
                    }
                  }}
                  disabled={selected === "" || user === ""}
                />
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    );
  };

  return renderPoolZap();
}

export default Zap;
