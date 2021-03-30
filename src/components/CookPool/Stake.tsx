import React, { useState } from "react";
import Modal from "react-modal";
import BigNumber from "bignumber.js";
import { BalanceBlock } from "../common/index";
import { approve, stake } from "../../utils/web3";
import { isPos, toBaseUnitBN } from "../../utils/number";
import { COOK } from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";
import ActionButton from "../common/ActionButton";
import colors from "../../constants/colors";
import { Container, Row, Col } from "react-grid-system";
import ListTable from "../PoolList/ListTable";
import { useGlobal } from "contexts";

type StakeProps = {
  user: string;
  poolAddress: string;
  balance: BigNumber;
  allowance: BigNumber;
  staked: BigNumber;
  pools?: Array<any>;
};

function Stake({
  user,
  poolAddress,
  staked,
  balance,
  allowance,
  pools,
}: StakeProps) {
  const [stakeAmount, setStakeAmount] = useState(new BigNumber(0));
  const [opened, setOpened] = useState(false);
  const { setTransactionModalVisible, setInformModalVisible } = useGlobal();

  return (
    <div>
      <ActionButton
        label={"Deposit"}
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
            Deposit
          </h1>
          <ListTable pools={pools} selectedPool={poolAddress} />
          <Row>
            <Col xs={12}>
              <BalanceBlock
                asset="Balance"
                balance={balance}
                suffix={"Cook"}
                type={"row"}
              />
            </Col>
            <Col xs={12}>
              <>
                <BigNumberInput
                  adornment="Cook"
                  value={stakeAmount}
                  setter={setStakeAmount}
                  max={() => {
                    setStakeAmount(balance);
                  }}
                />
              </>
            </Col>
            <Col xs={6}>
              <ActionButton
                type="cancel"
                label="Cancel"
                onClick={() => {
                  setOpened(false);
                }}
                disabled={false}
              />
            </Col>
            {allowance.comparedTo(stakeAmount) > 0 ? (
              <Col xs={6}>
                <ActionButton
                  label={"Deposit"}
                  type="filled"
                  onClick={() => {
                    if (stakeAmount.isZero() || stakeAmount.comparedTo(balance) > 0) {
                      setInformModalVisible(true, "Invalid Number");
                      return
                    }
                    setTransactionModalVisible(
                      true,
                      "",
                      "Follow wallet instructions"
                    );
                    stake(
                      poolAddress,
                      toBaseUnitBN(stakeAmount, COOK.decimals),

                      (txHash) => {
                        setTransactionModalVisible(true, txHash);
                      },
                      () => {
                        setTransactionModalVisible(false);
                        setStakeAmount(new BigNumber(0));
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
                    !isPos(stakeAmount) ||
                    stakeAmount.isGreaterThan(balance)
                  }
                />
              </Col>
            ) : (
                <Col xs={6}>
                  <ActionButton
                    label={"Approve"}
                    type="filled"
                    onClick={() => {
                      setTransactionModalVisible(
                        true,
                        "",
                        "Follow wallet instructions"
                      );
                      approve(
                        COOK.addr,
                        poolAddress,
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
                    }}
                    disabled={poolAddress === "" || user === ""}
                  />
                </Col>
              )}
          </Row>
        </div>
      </Modal>
    </div>
  );
}

export default Stake;
