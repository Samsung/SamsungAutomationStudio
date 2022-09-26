import React from "react";
import { mainColor, gradientColor } from "../../assets/DesignOption";

const GradientSVG = ({ colorOption, idCSS, rotation }) => {
  let gradientTransform = `rotate(${rotation})`;

  return (
    <svg style={{ height: 0 }}>
      <defs>
        <linearGradient id={idCSS} gradientTransform={gradientTransform}>
          <stop offset="0%" stopColor={mainColor[colorOption]} />
          <stop offset="100%" stopColor={gradientColor[colorOption]} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default GradientSVG;
