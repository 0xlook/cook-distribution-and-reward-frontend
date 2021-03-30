import React, { useState } from "react";
import Modal from "react-modal";
import BigNumber from "bignumber.js";
import { BalanceBlock } from "../common/index";
import { unstake } from "../../utils/web3";
import { isPos, toBaseUnitBN } from "../../utils/number";
import { UNI } from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";
import ActionButton from "../common/ActionButton";
import colors from "../../constants/colors";
import { Container, Row, Col } from "react-grid-system";
import ListTable from "../PoolList/ListTable";
import { useGlobal } from "contexts";

type UnstakeProps = {
  user: string;
  poolAddress: string;
  unstakable: BigNumber;
  locked: BigNumber;
  pools?: Array<any>;
};

function Unstake({
  user,
  poolAddress,
  unstakable,
  locked,
  pools,
}: UnstakeProps) {
  const [unstakeAmount, setUnstakeAmount] = useState(new BigNumber(0));
  const [opened, setOpened] = useState(false);
  const { setTransactionModalVisible, setInformModalVisible } = useGlobal();

  return (
    <div>
      <ActionButton
        label={"Withdraw"}
        size={14}
        onClick={() => {
          setOpened(true);
        }}
        disabled={poolAddress === "" || user === ""}
      />
      <Modal
        isOpen={opened}
        onRequestClose={() => setOpened(false)}
        className="Modal"
        overlayClassName="Overlay"
      >
        <div style={{ padding: 20 }}>
          <h1 style={{ textAlign: "center", fontSize: 40, fontWeight: 700 }}>
            Withdraw
          </h1>
          <ListTable pools={pools} selectedPool={poolAddress} />
          <Row>
            <Col xs={12}>
              <BalanceBlock
                asset="Locked"
                balance={locked}
                suffix={"Cook-WETH"}
                type={"row"}
              />
            </Col>
            <Col xs={12}>
              <BalanceBlock
                asset="Available"
                balance={unstakable}
                suffix={"Cook-WETH"}
                type={"row"}
              />
            </Col>
            <Col xs={12}>
              <BigNumberInput
                adornment="Cook-WETH"
                value={unstakeAmount}
                setter={setUnstakeAmount}
                max={() => {
                  setUnstakeAmount(unstakable);
                }}
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
                label={"Withdraw"}
                type="filled"
                onClick={() => {
                  if (unstakeAmount.isZero() || unstakeAmount.comparedTo(unstakable) > 0) {
                    setInformModalVisible(true, "Invalid Number");
                    return
                  }
                  unstake(
                    poolAddress,
                    toBaseUnitBN(unstakeAmount, UNI.decimals),
                    (txHash) => {
                      setTransactionModalVisible(true, txHash);
                    },
                    () => {
                      setTransactionModalVisible(false);
                      setUnstakeAmount(new BigNumber(0));
                      setOpened(false);
                    },
                    (error) => {
                      console.error(error);
                      setTransactionModalVisible(false);
                    }
                  );
                }}
                disabled={
                  poolAddress === "" ||
                  user === "" ||
                  !isPos(unstakeAmount) ||
                  unstakeAmount.isGreaterThan(unstakable)
                }
              />
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
}

export default Unstake;
