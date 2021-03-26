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
    <Modal style={{zIndex:1}} visible={visible} onClose={onClose}>
      <StyledHeader primary="Connect" />

      <div style={{width: '100%', margin: 'auto', padding: '1%'}}>
        <Button
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
      </div>
      <div style={{width: '100%', margin: 'auto', padding: '1%'}}>
        <Button
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
      </div>
      <div style={{width: '100%', margin: 'auto', padding: '1%'}}>
        <Button
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
      </div>
    </Modal>
  );
}

const StyledHeader = styled(Header)`
    h1 {
        margin-left: auto;
        margin-right: auto;
    }
`
export default ConnectModal;