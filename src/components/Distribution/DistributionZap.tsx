import React, { useState, useEffect } from "react";
import { DropDown } from "@aragon/ui";
import BigNumber from "bignumber.js";
import { BalanceBlock, PriceSection } from "../common/index";
import {
  distributionZapLP,
  approve,
  distributionZapETH,
} from "../../utils/web3";
import { toBaseUnitBN, toTokenUnitsBN } from "../../utils/number";
import { COOK, WETH } from "../../constants/tokens";
import { CookDistribution } from "../../constants/contracts";
import BigNumberInput from "../common/BigNumberInput";
import colors from "../../constants/colors";
import ActionButton from "../common/ActionButton";
import HelpText from "../common/HelpText";
import { Row, Col } from "react-grid-system";
import ListTable from "../PoolList/ListTable";
import InfoIcon from "../common/InfoIcon";
import Modal from "react-modal";
import { useTranslation } from "react-i18next";
import { useGlobal } from "contexts";
import InformModal from "./InformModal";

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
  wethBalance: Array<BigNumber>;
  wethAllowance: BigNumber;
  pairBalanceWETH: Array<BigNumber>;
  pairBalanceCOOK: BigNumber;
  selected?: string;
};

function DistributionZap({
  user,
  pools,
  cookAvailable,
  wethBalance,
  wethAllowance,
  pairBalanceWETH,
  pairBalanceCOOK,
  selected,
}: ZapProps) {
  const ETHIndex = 1;
  const [zapAmount, setZapAmount] = useState(new BigNumber(0));
  const [wethAmount, setWethAmount] = useState(new BigNumber(0));
  const [opened, setOpened] = useState(false);
  const [selectedPool, setSelectedPool] = useState(selected || "");
  const [balanceType, setBalanceType] = useState(0);
  const [openInform, setOpenInform] = useState(false);
  const { t } = useTranslation();
  const { setTransactionModalVisible } = useGlobal();

  useEffect(() => {
    if (selected) {
      setSelectedPool(selected);
    }
  }, [selectedPool, selected]);

  useEffect(() => {
    onChangeAmountCOOK(zapAmount);
  }, [balanceType]);

  const close = () => {
    setOpened(false);
    setZapAmount(new BigNumber(0));
    setWethAmount(new BigNumber(0));
  };

  const WETHToCOOKRatio = new Array();
  for (let i = 0; i < pairBalanceWETH.length; i++) {
    WETHToCOOKRatio.push(
      pairBalanceWETH[i].isZero()
        ? new BigNumber(1)
        : pairBalanceWETH[i].div(pairBalanceCOOK)
    );
  }

  const onChangeAmountCOOK = (amountCOOK) => {
    if (!amountCOOK) {
      setWethAmount(new BigNumber(0));
      return;
    }

    const amountCOOKBN = new BigNumber(amountCOOK);
    setZapAmount(amountCOOKBN);
    const amountCOOKBU = toBaseUnitBN(amountCOOKBN, COOK.decimals);
    const newAmountWETH = toTokenUnitsBN(
      amountCOOKBU
        .multipliedBy(WETHToCOOKRatio[balanceType])
        .integerValue(BigNumber.ROUND_FLOOR),
      COOK.decimals
    );
    setWethAmount(newAmountWETH);
  };
  const renderPoolZap = () => {
    return (
      <div>
        <ActionButton
          label={t("Zap LP Mining")}
          icon={
            <InfoIcon text="Transfer your claimable cook token to Cook-WETH Uniswap pool with WETH/ETH from your wallet, then stake Cook-WETH token to start liquidity mining right away." />
          }
          color={colors.linear}
          onClick={() => {
            setOpened(true);
          }}
          disabled={!user}
        />
        <Modal
          isOpen={opened}
          onRequestClose={() => close()}
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
              {t("Zap LP Mining")}
            </h1>
            <ListTable
              pools={pools}
              selectedPool={selectedPool}
              setSelectedPool={setSelectedPool}
            />
            <Row style={{ padding: 10 }}>
              <Col xs={12}>
                <BalanceBlock
                  asset="Available Cook"
                  balance={cookAvailable}
                  suffix={"Cook"}
                  type={"row"}
                />
              </Col>
              <Col xs={12}>
                <BalanceBlock
                  asset={"WETH"}
                  balance={wethBalance[balanceType]}
                  type={"row"}
                  suffix={<span style={{ fontSize: 14 }}> WETH</span>}
                />
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
                <PriceSection
                  label="Requires "
                  amt={wethAmount}
                  symbol={"WETH"}
                />
              </Col>
              <Col xs={6} style={{ textAlign: "center" }}>
                <ActionButton
                  label="Cancel"
                  type="cancel"
                  onClick={() => {
                    close();
                  }}
                  disabled={false}
                />
              </Col>
              {balanceType == ETHIndex ||
              wethAllowance.comparedTo(wethAmount) > 0 ? (
                <Col xs={6} style={{ textAlign: "center" }}>
                  <ActionButton
                    label={"Zap"}
                    type="filled"
                    onClick={() => {
                      if (selectedPool) {
                        if (balanceType == ETHIndex) {
                          setTransactionModalVisible(
                            true,
                            "",
                            "Follow wallet instructions"
                          );
                          distributionZapETH(
                            CookDistribution,
                            selectedPool,
                            toBaseUnitBN(zapAmount, COOK.decimals),
                            (txHash) => {
                              setTransactionModalVisible(true, txHash);
                            },
                            () => {
                              setTransactionModalVisible(false);
                              close();
                            },
                            (error) => {
                              console.error(error);
                              setTransactionModalVisible(false);
                            }
                          );
                        } else {
                          setTransactionModalVisible(
                            true,
                            "",
                            "Follow wallet instructions"
                          );
                          distributionZapLP(
                            CookDistribution,
                            selectedPool,
                            toBaseUnitBN(zapAmount, COOK.decimals),
                            (txHash) => {
                              setTransactionModalVisible(true, txHash);
                            },
                            () => {
                              setTransactionModalVisible(false);
                              close();
                            },
                            (error) => {
                              console.error(error);
                              setTransactionModalVisible(false);
                            }
                          );
                        }
                      } else {
                        setOpenInform(true);
                      }
                    }}
                    disabled={user === ""}
                  />
                </Col>
              ) : (
                <Col xs={6} style={{ textAlign: "center" }}>
                  <ActionButton
                    label="Approve"
                    type="filled"
                    onClick={() => {
                      if (selectedPool) {
                        setTransactionModalVisible(
                          true,
                          "",
                          "Follow wallet instructions"
                        );
                        approve(
                          WETH.addr,
                          CookDistribution,
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
                      }
                    }}
                    disabled={selectedPool === "" || user === ""}
                  />
                </Col>
              )}
            </Row>
          </div>
        </Modal>
        <InformModal isOpen={openInform} close={() => setOpenInform(false)} />
      </div>
    );
  };

  return renderPoolZap();
}

export default DistributionZap;
