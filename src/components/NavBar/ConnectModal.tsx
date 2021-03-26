import React, { useEffect } from 'react';
import { Modal, Button, Header } from '@aragon/ui';
import { useWallet } from 'use-wallet';
import styled from 'styled-components';

type ConnectModalProps = {
  visible: boolean,
  onClose: Function,
  onConnect: Function
};

function ConnectModal({
  visible, onClose, onConnect
}:ConnectModalProps) {
  const wallet = useWallet();

  const connectMetamask = () => {
    wallet.connect("injected");
  };

  const connectWalletConnect = () => {
    wallet.connect("walletconnect");
  };

  const connectCoinbase = () => {
    wallet.connect("walletlink");
  };

  useEffect(() => {
    if (wallet.account) {
      onConnect && onConnect(wallet);
      onClose && onClose();
    }
  }, [wallet, onConnect, onClose]);

  return (
    <StyledModal visible={visible} onClose={onClose}>
      <StyledHeader primary="Connect" />

      <StyledDiv>
        <StyledButton
          wide
          style={{height: '55px', justifyContent: 'space-between'}}
          children={
            <>
                <span>Metamask</span>
                <img src={`./wallets/metamask-fox.svg`} style={{ height: 24, width:24 }} alt="Metamask"/>
            </>
          }
          onClick={connectMetamask}
        />
      </StyledDiv>
      <StyledDiv>
        <StyledButton
          wide
          style={{height: '55px', justifyContent: 'space-between'}}
          children={
            <>
                <span>WalletConnect</span>
                <img src={`./wallets/wallet-connect.svg`} style={{ height: 24, width:24 }} alt="WalletConnect"/>
            </>
          }
          onClick={connectWalletConnect}
        />
      </StyledDiv>
      <StyledDiv>
        <StyledButton
          wide
          style={{height: '55px', justifyContent: 'space-between'}}
          children={
            <>
                <span>Coinbase Wallet</span>
                <img src={`./wallets/coinbase-wallet.png`} style={{ height: 24, width:24 }} alt="Coinbase Wallet"/>
            </>
          }
          onClick={connectCoinbase}
        />
      </StyledDiv>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
    z-index: 1;
    div[role="alertdialog"] {
        border-radius: 8px !important;
    }
`

const StyledHeader = styled(Header)`
    h1 {
        margin-left: auto;
        margin-right: auto;
    }
`

const StyledDiv = styled.div`
    width: 100%;
    margin: auto;
    padding: 1%;
`

const StyledButton = styled(Button)`
    border-radius: 8px;
`
export default ConnectModal;