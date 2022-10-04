const mainColor = {
  blue: "#1153FC",
  orange: "#FF7E42",
  pink: "#FD5988",
  purple: "#8443F6",
  green: "#08C792",
};

const gradientColor = {
  blue: "#5F86FE",
  orange: "#FEBF7D",
  pink: "#F8A899",
  purple: "#7793FE",
  green: "#2AFEB7",
};

const bgColor = {
  light: "#F3F3F9",
};

const groupColor = {
  dark: "#3B465E",
  light: "#FFFFFF",
};

const fontColor = {
  dark: "#F3F2F2",
  light: "#737373",
};

const fontSize = {
  xs: "10px",
  sm: "12px",
  md: "16px",
  lg: "20px",
  xl: "32px",
  xxl: "48px",
};

const calculateWidth = (w, currentGroupWidth, currentGroupW) => {
  if (w === currentGroupW) {
    return currentGroupWidth;
  }
  const unitWidth = Math.round(currentGroupWidth / currentGroupW);
  return unitWidth * w;
};

const calculateLeft = (x, currentGroupWidth, currentGroupW) => {
  const unitWidth = Math.round(currentGroupWidth / currentGroupW);
  return unitWidth * x;
};

const calculateHeight = (h, currentGroupH, isNameVisible = true) => {
  if (isNameVisible) {
    const unitHeight = Math.round((currentGroupH * 75 + (currentGroupH - 1) * 10 - 30) / currentGroupH);
    return unitHeight * h;
  } else {
    const unitHeight = Math.round((currentGroupH * 75 + (currentGroupH - 1) * 10) / currentGroupH);
    return unitHeight * h;
  }
};

const calculateTop = (y, currentGroupH, isNameVisible = true) => {
  if (isNameVisible) {
    const unitHeight = Math.round((currentGroupH * 75 + (currentGroupH - 1) * 10 - 30) / currentGroupH);
    return 30 + y * unitHeight;
  } else {
    const unitHeight = Math.round((currentGroupH * 75 + (currentGroupH - 1) * 10) / currentGroupH);
    return unitHeight * y;
  }
};

export {
  mainColor,
  gradientColor,
  bgColor,
  groupColor,
  fontColor,
  fontSize,
  calculateHeight,
  calculateLeft,
  calculateTop,
  calculateWidth,
};
