import { Spinner } from "components/Loader";
import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import { useWallet } from "use-wallet";
import styled from "styled-components";

const ContentWrapper = styled.div`
  padding: 21px;
  padding-top: 15px;
  text-align: center;
`;

const TitleWrapper = styled.h1`
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const ViewTxWrapper = styled.a`
  display: inline-block;
  margin-top: 16px;
  text-decoration: none;
  transition: all 0.3s;
  background: linear-gradient(90deg, #e611ff -6.85%, #03abf9 109.03%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  &:hover {
    opacity: 0.7;
  }
`;

interface IProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  txId: string;
}

export const TransactionProgressModal = (props: IProps) => {
  const { t } = useTranslation();
  const {
    description = "We need to create a transaction and wait until it's confirmed on the network",
    title = "Pending transaction",
    txId,
  } = props;
  const { chainId } = useWallet();
  const blockExplorer =
    chainId === 4 ? "https://rinkeby.etherscan.io/" : "https://etherscan.io/";

  return (
    <Modal
      onRequestClose={props.onClose}
      isOpen={props.visible}
      className="Modal"
      overlayClassName="Overlay"
      style={{ zIndex: 1100 }}
    >
      <ContentWrapper>
        <TitleWrapper>{t(title)}</TitleWrapper>
        <Spinner />
        <p>{t(description)}</p>
        {txId && (
          <ViewTxWrapper
            href={`${blockExplorer}tx/${txId}`}
            rel="noreferrer"
            target="_blank"
          >
            View TX
          </ViewTxWrapper>
        )}
      </ContentWrapper>
    </Modal>
  );
};
