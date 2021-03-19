import React from 'react';
import {
  ButtonBase, useViewport
} from '@aragon/ui';
import styled from 'styled-components';
import colors from '../../constants/colors';
const StyledButton = styled(ButtonBase)`

  margin: 5px;
  border: 2px solid;
  border-image-slice: 1;
  ${props => `
    border-image-source: ${props.color};
    width: ${props.width};
    padding: ${props.padding};
    &:hover {
        background: ${props.color};
    }
  `}

`;

function ActionButton({ onClick, color, label, disabled, size, width }: { label: string, color?: string, onClick: Function, disabled: boolean, size?: number, width?: string }) {
  const { below } = useViewport()
  return (
    <StyledButton
      onClick={onClick}
      width={width || "100%"}
      color={color || colors.linear}
      padding={below("medium") ? "12px" : "8px"}
      disabled={disabled}
    >
      <span style={{ fontSize: size || '1rem', color: "white", fontWeight: "bold" }}> {label} </span>
    </StyledButton>
  );
}

export default ActionButton;
