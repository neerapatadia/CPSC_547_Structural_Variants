import React from "react";

const BarChartXAxis = ({
  wrapperWidth,
  wrapperHeight,
  xStart,
  xEnd,
  yPosition,
  stepSize,
  axisObject,
  axisTitle,
}) => {
  return (
    <>
      {/* axis line */}
      <path
        d={`M ${xStart} ${yPosition} H ${xEnd} `}
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* ticks */}
      {axisObject.map(({ value, offset }) => {
        return (
          <g
            key={value}
            transform={`translate(${
              xStart + offset + stepSize * 0.5
            }, ${yPosition})`}
          >
            <line y1="0" y2="5" x={offset} stroke="black" />
            <text className="axis-tick-text x-axis-tick-text" key={value}>
              {value}
            </text>
          </g>
        );
      })}

      {/* axis label */}
      <text transform={`translate(${wrapperWidth / 2}, ${wrapperHeight})`}>
        {axisTitle}
      </text>
    </>
  );
};

export default BarChartXAxis;
