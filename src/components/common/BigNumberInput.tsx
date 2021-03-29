import React from 'react';

import BigNumber from 'bignumber.js';
import {
  TextInput, Text
} from '@aragon/ui';
import colors from '../../constants/colors';
import { Container, Row, Col } from 'react-grid-system';
import MaxButton from './MaxButton';
type BigNumberInputProps = {
  value: BigNumber,
  setter: (value: BigNumber) => void
  adornment?: any,
  disabled?: boolean
  max?: Function
}

function BigNumberInput({ value, setter, adornment, disabled = false, max }: BigNumberInputProps) {
  return (
    <Container style={{ marginBottom: 30 }}>
      <Row align="center" style={{ height: '75px' }}>
        <Col xs={11} style={{ paddingLeft: 0 }}>
          <TextInput
            type="number"
            style={{
              background: `rgba(70, 72, 137,0.2)`, height: 56, fontSize: 40, fontWeight: 60, color: colors.linear
              , border: '1.2px solid rgba(113, 164, 221,0.2)'
            }}
            adornmentPosition="end"
            adornmentSettings={{ padding: 5, width: 70 }}
            adornment={max && <MaxButton onClick={max} />}
            wide
            value={value.isNegative() ? '' : value}
            onChange={(event) => {
              if (event.target.value) {
                setter(new BigNumber(event.target.value));
              } else {
                setter(new BigNumber(-1));
              }
            }}
            onBlur={() => {
              if (value.isNegative()) {
                setter(new BigNumber(0))
              }
            }}
            disabled={disabled}
          /></Col>
        <Col xs={1} style={{ fontSize: 14, color: "white", fontWeight: 700, padding: 0 }}><span >{adornment}</span></Col>
      </Row>
    </Container>
  );
}

export default BigNumberInput;
