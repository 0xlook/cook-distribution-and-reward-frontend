import React from 'react';
import {
  ButtonBase, useViewport
} from '@aragon/ui';

function ActionButton({ onClick, color, label, disabled }:{ label:string, color:string, onClick: Function, disabled:boolean }) {
  const { below } = useViewport()
  return (
      <ButtonBase
        onClick={onClick}
        style={{marginTop:10,marginBottom:10, padding: "8pt 20pt", borderRadius:40, backgroundColor:color, minWidth:below(768)?150:180 }}
        disabled={disabled}
      >
        <span style={{ fontSize:16, color:"black", fontWeight:"bold"}}> {label} </span>
      </ButtonBase>
  );
}

export default ActionButton;
