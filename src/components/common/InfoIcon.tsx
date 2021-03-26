import React from 'react';
import { FiInfo } from "react-icons/fi";
function InfoIcon({ text, size }: { size?: string, text: string }) {
  return (
    <>
      <div className="popover__wrapper">
        < FiInfo />
        <div className="popover__content">
          {text}
        </div>
      </div>

    </>
  );
}


export default InfoIcon;
