import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import BigNumber from "bignumber.js";
import { BalanceBlock, PriceSection } from "../common/index";
import { cookDistributionZap, approve } from "../../utils/web3";
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
  selected?: string;
};

function DistributionZap({ user, pools, cookAvailable, selected }: ZapProps) {
  const [zapAmount, setZapAmount] = useState(new BigNumber(0));
  const [opened, setOpened] = useState(false);
  const [selectedPool, setSelectedPool] = useState(selected || "");
  const { t } = useTranslation();
  const { setTransactionModalVisible, setInformModalVisible } = useGlobal();

  useEffect(() => {
    if (selected) {
      setSelectedPool(selected);
    }
  }, [selectedPool, selected]);

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
          label={t("Zap Cook Mining")}
          icon={
            <InfoIcon text="Transfer your claimable cook token to cook mining pool and start staking to gain more cook." />
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
              {t("Zap Cook Mining")}
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
                    close();
                  }}
                  disabled={false}
                />
              </Col>
              <Col xs={6} style={{ textAlign: "center" }}>
                <ActionButton
                  type="filled"
                  label={"Zap"}
                  onClick={() => {
                    if (selectedPool) {
                      if (zapAmount.isZero() || zapAmount.comparedTo(cookAvailable) > 0) {
                        setInformModalVisible(true, "Invalid Number");
                        return
                      }
                      setTransactionModalVisible(
                        true,
                        "",
                        "Follow wallet instructions"
                      );
                      cookDistributionZap(
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
                      setInformModalVisible(true, "Please select a pool to zap");
                    }
                  }}
                  disabled={user === ""}
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

export default DistributionZap;
