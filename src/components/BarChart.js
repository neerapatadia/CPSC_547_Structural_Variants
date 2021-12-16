import React from "react";
import * as d3 from "d3";
import { sum } from "lodash";
import BarChartXAxis from "./BarChartXAxis";
import BarChartYAxis from "./BarChartYAxis";

const BarChart = ({
  data,
  chromosomes,
  wrapperWidth,
  wrapperHeight,
  title,
  pathLevels,
  colourMap,
  leftOffset,
  selectedChrom,
}) => {
  // sizing
  const margin = {
    top: 25,
    right: 5,
    bottom: 35,
    left: leftOffset,
  };
  const boundsWidth = wrapperWidth - margin.left - margin.right;
  const boundsHeight = wrapperHeight - margin.top - margin.bottom;

  // get total # variants per chromosome
  const chromosomeTotals = data.map((d) =>
    sum(pathLevels.map((l) => parseInt(d[l])))
  );

  // stack data
  const stack = d3.stack().keys(pathLevels)(data);

  // scales
  const xScale = d3
    .scaleBand()
    .domain(chromosomes)
    .range([margin.left, boundsWidth + margin.left])
    .padding([0.15]);
  const yScale = d3
    .scaleLinear()
    .domain([0, Math.max(...chromosomeTotals)])
    .range([boundsHeight + margin.top, margin.top]);
  const colourRange = pathLevels.map((t) => colourMap[t]);
  const colourScale = d3.scaleOrdinal().domain(pathLevels).range(colourRange);

  // axes
  const xAxis = chromosomes.map((c, i) => ({
    value: c,
    offset: xScale.step() * i,
  }));
  const yAxis = yScale
    .ticks()
    .map((value) => ({ value, offset: yScale(value) }));

  return (
    <svg width={wrapperWidth} height={wrapperHeight}>
      {/* chart title */}
      <text
        transform={`translate(${wrapperWidth / 2}, ${margin.top / 2})`}
        className="chart-title"
      >
        {title}
      </text>

      {/* bars */}
      {stack.map((s, i) =>
        s.map((d) => {
          // place border around selected chromosome
          let strokeDashArray;
          if (d.data.Chromosome !== selectedChrom) {
            strokeDashArray = null;
          } else {
            const presentPathLevels = pathLevels
              .map((l) => d.data[l])
              .filter((d) => d !== "0");
            if (i === presentPathLevels.length - 1) {
              // border on top and sides
              strokeDashArray = [
                xScale.bandwidth() + 2,
                0,
                yScale(d[0]) - yScale(d[1]) - 2,
                xScale.bandwidth(),
                yScale(d[0]) - yScale(d[1]) + 2,
                0,
              ];
            } else {
              // border on sides
              strokeDashArray = [
                0,
                xScale.bandwidth(),
                yScale(d[0]) - yScale(d[1]),
                0,
              ];
            }
          }

          return (
            <rect
              key={`${d.data.Chromosome} ${d.data.ClinicalSignificance}`}
              width={xScale.bandwidth()}
              x={xScale(d.data.Chromosome)}
              y={yScale(d[1])}
              height={yScale(d[0]) - yScale(d[1])}
              fill={colourScale(pathLevels[i])}
              stroke={d.data.Chromosome === selectedChrom ? "black" : null}
              strokeWidth="2px"
              strokeDasharray={strokeDashArray}
            />
          );
        })
      )}

      <BarChartXAxis
        wrapperWidth={wrapperWidth}
        wrapperHeight={wrapperHeight}
        xStart={margin.left}
        xEnd={margin.left + boundsWidth}
        yPosition={margin.top + boundsHeight}
        stepSize={xScale.step()}
        axisObject={xAxis}
        axisTitle="Chromosome"
      />

      <BarChartYAxis
        wrapperHeight={wrapperHeight}
        yStart={margin.top}
        yEnd={margin.top + boundsHeight}
        xPosition={margin.left}
        axisObject={yAxis}
        axisTitle="# of Variants"
      />
    </svg>
  );
};

export default BarChart;
