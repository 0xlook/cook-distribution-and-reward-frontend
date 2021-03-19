import React, { useState } from 'react';
import styled, { CSSProp } from 'styled-components';
import {
  Button, IdentityBadge, IconConnect, IconPower, LinkBase,
} from '@aragon/ui';

import { connect } from '../../utils/web3';

type connectButtonProps = {
  user: string,
  setUser: Function,
  css?: CSSProp
}

function ConnectButton({ user, setUser, css }: connectButtonProps) {
  const [isConnected, setIsConnected] = useState(user ? true: false);
  const connectWeb3 = async () => {
    const address = await connect();
    if (address === false) return;
    setIsConnected(true);
    setUser(address);
  };

  const disconnectWeb3 = async () => {
    setIsConnected(false);
    setUser('');
  };

  return isConnected ? (
    <StyledButton style={css}>
      <div style={{ paddingTop: 5, paddingRight: 5 }}>
        <LinkBase onClick={disconnectWeb3} size="small">
          {' '}
          <IconPower />
          {' '}
        </LinkBase>
      </div>
      <IdentityBadge compact entity={user}  />

    </StyledButton>
  ) : (
    <StyledButton style={css} label="Connect Wallet" onClick={connectWeb3} />
  );
}

const StyledButton = styled(Button)`
  background: linear-gradient(90deg, #E611FF -6.85%, #03ABF9 109.03%);
`


export default ConnectButton;
