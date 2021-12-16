import React from "react";

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return [r, g, b];
};

const ClinicalSignificance = ({ value, colourMap }) => {
  const backgroundColor = colourMap[value];
  const [r, g, b] = hexToRgb(backgroundColor);

  return (
    <td>
      <p
        style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, 0.75)` }}
        className="clinical-significance"
      >
        {value}
      </p>
    </td>
  );
};

export default ClinicalSignificance;
