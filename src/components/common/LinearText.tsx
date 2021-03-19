import React from 'react';

import styled from 'styled-components';
import colors from '../../constants/colors';

const StyledLinearText = styled.span`
  font-size: 16px;
  background: ${colors.linear};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  ${props => props.size && `
    font-size: ${props.size};
  `}
`;

function LinearText({ text, size }: { size?: string, text: string }) {
  return (
    <StyledLinearText size={size} >
      {text}
    </StyledLinearText>
  );
}


export default LinearText;
