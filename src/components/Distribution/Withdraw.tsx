import React, { useState } from "react";
import Modal from "react-modal";
import BigNumber from "bignumber.js";
import { Container, Row, Col } from "react-grid-system";
import { BalanceBlock } from "../common/index";
import { withdraw } from "../../utils/web3";
import { toBaseUnitBN } from "../../utils/number";
import { COOK } from "../../constants/tokens";
import { CookDistribution } from "../../constants/contracts";
import BigNumberInput from "../common/BigNumberInput";
import colors from "../../constants/colors";
import ActionButton from "../common/ActionButton";
import { useGlobal } from "contexts";
import { waitSeconds } from "utils";

type WithdrawProps = {
  user: string;
  vestingAmount: BigNumber;
  availableAmount: BigNumber;
  records: Array<{ transactionHash: string; returnValues: { amount: string } }>;
};

function Withdraw({
  user,
  vestingAmount,
  availableAmount,
  records,
}: WithdrawProps) {
  const [withdrawAmount, setWithdrawAmount] = useState(new BigNumber(0));
  const [opened, setOpened] = useState(false);
  const { setTransactionModalVisible } = useGlobal();

  const onWithdraw = () => {
    setOpened(false);
    setTransactionModalVisible(true, "", "Follow wallet instructions");
    withdraw(
      CookDistribution,
      toBaseUnitBN(withdrawAmount, COOK.decimals),
      (txHash) => {
        setTransactionModalVisible(true, txHash);
      },
      () => {
        setTransactionModalVisible(false);
      },
      (error) => {
        console.error(error);
        setTransactionModalVisible(false);
      }
    );
  };

  return (
    <div>
      <ActionButton
        label={"Claim"}
        onClick={() => {
          setOpened(true);
        }}
        disabled={!user}
      />
      <Modal
        isOpen={opened}
        onRequestClose={() => setOpened(false)}
        className="Modal"
        overlayClassName="Overlay"
      >
        <div style={{ padding: "21px", paddingTop: "15px" }}>
          <h1
            style={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            Claim
          </h1>

          <Row>
            <Col xs={12}>
              <BalanceBlock
                asset="Total Available"
                balance={availableAmount}
                type={"row"}
                suffix={"Cook"}
              />
            </Col>
            <Col xs={12}>
              <BigNumberInput
                adornment="Cook"
                max={() => {
                  setWithdrawAmount(availableAmount);
                }}
                value={withdrawAmount}
                setter={setWithdrawAmount}
              />
            </Col>
            <Col xs={6} style={{ textAlign: "center" }}>
              <ActionButton
                label={"Cancel"}
                type="cancel"
                onClick={() => {
                  setOpened(false);
                }}
                disabled={false}
              />
            </Col>
            <Col xs={6} style={{ textAlign: "center" }}>
              <ActionButton
                label={"Claim"}
                type="filled"
                onClick={onWithdraw}
                disabled={false}
              />
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
}

export default Withdraw;
