import React, { useEffect, useState } from 'react';
import styled, { CSSProp } from 'styled-components';
import {
  Button, IdentityBadge, IconDown, LinkBase,
} from '@aragon/ui';
import Web3 from 'web3';

// import { connect } from '../../utils/web3';
import SignOutButtonWrapper from '../common/SignOutButtonWrapper';
import ConnectModal from './ConnectModal';
import { useWallet } from 'use-wallet';
import { storePreference, getPreference } from '../../utils/storage';
import { useTranslation } from "react-i18next" 

type connectButtonProps = {
  user: string,
  setUser: Function,
  css?: CSSProp,
  mobile?: Boolean
}


function ConnectButton({ user, setUser, css, mobile }: connectButtonProps) {
  // const [isConnected, setIsConnected] = useState(user ? true: false);
  const storedAccount = getPreference('account', '');
  const [visible, setVisible] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false);
  const { status, reset } = useWallet();
    const closeModal = () => setModalOpen(false);
  const openModal = () => setModalOpen(true);
  const { t } = useTranslation()
    // const connectWeb3 = async () => {
  //   const address = await connect();
  //   if (address === false) return;
  //   setIsConnected(true);
  //   setUser(address);
  // };
  const wallet = useWallet();
  // console.log('wallet', wallet)

  const connectWeb3 = async (wallet) => {
    // connect(wallet.ethereum);
    // wallet.connect()
    setUser(wallet.account);
    storePreference('account', wallet.account);
    // @ts-expect-error
    window.web3 = new Web3(wallet.ethereum);
    // setIsConnected(true);
  };

  const disconnectWeb3 = async () => {
    // setIsConnected(false);
    setUser('');
    storePreference('account', '');
    reset();
    setVisible(false);
  };

  const showDropDown = async () => {
    setVisible(!visible)
  };

  useEffect(() => {
    // console.log('wallet', wallet.status)
    // console.log('storedAccount', storedAccount)
    if(storedAccount && wallet.status == 'disconnected') {
      wallet.connect("injected");
    }
    if(wallet.error && wallet.error.name == 'ChainUnsupportedError') {
      alert(wallet.error.message)
    }
  }, [storedAccount, wallet]);

  const isConnected = status === 'connected'
  return isConnected ? (
    mobile ? (
      <>
        <StyledMobileDiv>
          <IdentityBadge badgeOnly compact label={user}/>
        </StyledMobileDiv>
        <StyledSignOutMobileButton onClick={disconnectWeb3}>Sign Out</StyledSignOutMobileButton>
      </>
    ) : (
        <div>
          <StyledDiv style={{ marginLeft: '32px' }}>
            <IdentityBadge style={{ marginLeft: '7px' }} badgeOnly compact label={user} />
            <LinkBase onClick={showDropDown} size="small">
              <IconDown />
            </LinkBase>
          </StyledDiv>

          <SignOutButtonWrapper visible={visible} setVisible={setVisible}>
            <StyledSignOutButton style={{ marginTop: '3px', display: 'inherit' }} onClick={disconnectWeb3} size="small">
              Sign Out
          </StyledSignOutButton>
          </SignOutButtonWrapper>
        </div>
      )
  ) : (
      mobile ? (
        <>
          <ConnectModal visible={isModalOpen} onClose={closeModal} onConnect={connectWeb3} />
          <StyledButton style={{ width: '100%', height: '55px', marginTop: '28px' }} label={t("Connect Wallet")} onClick={openModal} />
        </>
      ) : (
          <>
            <ConnectModal visible={isModalOpen} onClose={closeModal} onConnect={connectWeb3} />
            <StyledButton style={{ marginLeft: '32px' }} label={t("Connect Wallet")} onClick={openModal} />
          </>
        )

    );
}

const StyledSignOutMobileButton = styled(Button)`
    width: 100%;
    height: 55px;
    margin-left: 0px;
    margin-top: 20px;
    z-index:0;
    background: transparent;
    border: 1px solid transparent;
    
    :before {
      content:"";
      position:absolute;
      z-index:-1;
      top:0;
      left:0;
      right:0;
      bottom:0;
      padding: 1px;
      border-radius: 4px;
      background: linear-gradient(90deg, #E611FF -6.85%, #03ABF9 109.03%);
      -webkit-mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: destination-out;
      mask-composite: exclude;
    }
`

const StyledSignOutButton = styled(Button)`
  position: absolute;
  width: 174px;
  height: 40px;
  margin-left: 32px;
  @media only screen and (max-width: 767px) {
    margin-left: 0px;
  }
`

const StyledButton = styled(Button)`
  padding: 0 5px;
  border: 0;
  width: 174px;
  font-size: 15px;
  background: linear-gradient(90deg, #E611FF -6.85%, #03ABF9 109.03%);
  :hover {
    box-shadow:4px 4px 12px 4px rgba(20%,20%,40%,0.8);
  }
  span {
    font-size: 15px;
  }
`

const StyledDiv = styled.div`
  height: 40px;
  width: 174px;
  display: flex;
  border: 0;
  border-radius: 4px;  
  font-size: 15px;
  background: linear-gradient(90deg, #E611FF -6.85%, #03ABF9 109.03%);
  :hover {
    opacity: 0.4;
  }
  span {
    font-size: 15px;
  }
  a {
    height: 100%
  }
`

const StyledMobileDiv = styled.div`
  width: 100%;
  height: 55px;
  margin-top: 28px;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  display: flex;
  border: 0;
  border-radius: 4px;  
  font-size: 15px;
  background: linear-gradient(90deg, #E611FF -6.85%, #03ABF9 109.03%);
  :hover {
    opacity: 0.4;
  }
  span {
    font-size: 15px;
  }
`


export default ConnectButton;
