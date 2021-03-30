import React, { useState } from "react";
import Modal from "react-modal";
import BigNumber from "bignumber.js";
import { BalanceBlock } from "../common/index";
import { harvest } from "../../utils/web3";
import { isPos, toBaseUnitBN } from "../../utils/number";
import { COOK } from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";
import ActionButton from "../common/ActionButton";
import colors from "../../constants/colors";
import { Container, Row, Col } from "react-grid-system";
import ListTable from "../PoolList/ListTable";
import InfoIcon from "../common/InfoIcon";
import { useGlobal } from "contexts";
type HarvestProps = {
  user: string;
  poolAddress: string;
  userTotalRewarded: BigNumber;
  userTotalInVesting: BigNumber;
  pools?: Array<any>;
};

function Harvest({
  user,
  poolAddress,
  userTotalRewarded,
  userTotalInVesting,
  pools,
}: HarvestProps) {
  const [harvestAmount, setHarvestAmount] = useState(new BigNumber(0));
  const [opened, setOpened] = useState(false);
  const { setTransactionModalVisible, setInformModalVisible } = useGlobal();

  return (
    <div>
      <ActionButton
        label={"Harvest"}
        icon={<InfoIcon text="zap description" />}
        type="filled"
        onClick={() => {
          if (poolAddress) {
            setOpened(true);
          }
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
            Harvest
          </h1>
          <ListTable pools={pools} selectedPool={poolAddress} />
          <Row>
            <Col xs={12}>
              <BalanceBlock
                asset="To Be Vested"
                balance={userTotalRewarded}
                suffix={"Cook"}
                type={"row"}
              />
            </Col>
            <Col xs={12}>
              <BalanceBlock
                asset="In Vesting"
                balance={userTotalInVesting}
                suffix={"Cook"}
                type={"row"}
              />
            </Col>
            {/* Harvest Cook-WETH within Pool */}
            <Col xs={12}>
              <BigNumberInput
                adornment="Cook"
                value={harvestAmount}
                setter={setHarvestAmount}
                max={() => {
                  setHarvestAmount(userTotalRewarded);
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
                label={"Harvest"}
                type="filled"
                onClick={() => {
                  if (harvestAmount.isZero() || harvestAmount.comparedTo(userTotalRewarded) > 0) {
                    setInformModalVisible(true, "Invalid Number");
                    return
                  }
                  setTransactionModalVisible(
                    true,
                    "",
                    "Follow wallet instructions"
                  );
                  harvest(
                    poolAddress,
                    toBaseUnitBN(harvestAmount, COOK.decimals),

                    (txHash) => {
                      setTransactionModalVisible(true, txHash);
                    },
                    () => {
                      setTransactionModalVisible(false);
                      setHarvestAmount(new BigNumber(0));
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
                  !isPos(harvestAmount) ||
                  harvestAmount.isGreaterThan(userTotalRewarded)
                }
              />
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
}

export default Harvest;
