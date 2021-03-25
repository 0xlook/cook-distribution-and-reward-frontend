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
    <Container style={{ marginBottom: 15 }}>
      <Row align="center" style={{ height: '75px' }}>
        <Col xs={11} style={{ paddingLeft: 0 }}>
          <TextInput
            type="number"
            style={{ background: `${colors.linearOpacity}`, height: 56, fontSize: 24, fontWeight: 'bold' }}
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
        <Col xs={1} style={{ fontSize: 16, color: "white", padding: 0 }}><Text >{adornment}</Text></Col>
      </Row>
    </Container>
  );
}

export default BigNumberInput;
