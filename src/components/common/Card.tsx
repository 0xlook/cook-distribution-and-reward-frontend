import React from 'react';
import colors from '../../constants/colors';

function Card({ label, value }: { label: string, value: any }) {
  return (
    <div style={{ padding: 20, backgroundColor: colors.secondary, width: "100%", margin: "10pt auto", textAlign: "center", borderRadius: 10 }}>
      <span style={{ fontSize: 20 }}>
        {label}
      </span>
      <hr />
      <span style={{ fontSize: 40, color: colors.button }}>
        {value}
      </span>
    </div>
  );
}


export default Card;
