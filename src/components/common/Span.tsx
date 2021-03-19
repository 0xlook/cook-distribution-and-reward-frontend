import React from 'react';
import styled from 'styled-components';
import colors from '../../constants/colors';
const StyledSpan = styled.span`
  padding: 5pt 10pt;
  color: white;
  font-weight: bold;
  ${props => `
    font-size: ${props.size}px;
    border-radius: ${props.border}px;`}
  ${props => props.color && `
    background: ${props.color};
  `}
`;

function Span({ label, color, size }: { label: string, color?: string, size?: number }) {
  return (
    <StyledSpan
      color={color || colors.linear} border={label.length > 10 ? 40 : 20} size={size || 14}
    >
      {label}
    </StyledSpan>
  );
}

export default Span;
