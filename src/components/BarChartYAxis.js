import React from "react";

const BarChartYAxis = ({
  wrapperHeight,
  yStart,
  yEnd,
  xPosition,
  axisObject,
  axisTitle,
}) => {
  return (
    <>
      {/* axis line */}
      <path
        d={`M ${xPosition} ${yStart} V ${yEnd}`}
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* ticks */}
      {axisObject.map(({ value, offset }) => {
        return (
          <g key={value} transform={`translate(0, ${offset})`}>
            <line x1="45" x2={xPosition} y={value} stroke="black" />
            <text className="axis-tick-text y-axis-tick-text" key={value}>
              {value}
            </text>
          </g>
        );
      })}

      {/* axis title */}
      <text
        transform={`translate(${xPosition - 40}, ${
          wrapperHeight / 2
        }) rotate(270)`}
      >
        {axisTitle}
      </text>
    </>
  );
};

export default BarChartYAxis;
