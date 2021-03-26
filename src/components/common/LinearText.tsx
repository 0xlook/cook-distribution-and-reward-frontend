import React from 'react';

import styled from 'styled-components';
import colors from '../../constants/colors';
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation()
  return (
    <StyledLinearText size={size} >
      {t(text)}
    </StyledLinearText>
  );
}


export default LinearText;
