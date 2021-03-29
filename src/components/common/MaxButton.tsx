import React from 'react';
import colors from '../../constants/colors';
import {
  ButtonBase,
} from '@aragon/ui';

function MaxButton({ onClick }: { onClick: Function }) {
  return (
    <div style={{ padding: 3 }}>
      <ButtonBase onClick={onClick} style={{ background: colors.linear, width: 50, height: 44, opacity: 0.75, borderRadius: '2px' }}>
        <span style={{ color: 'white' }}> Max </span>
      </ButtonBase>
    </div>
  );
}

export default MaxButton;
