import React from "react";
import * as d3 from "d3";
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
  const chromosomeTotals = data.map(
    (d) =>
      parseInt(d.Benign) +
      parseInt(d["Uncertain significance"]) +
      parseInt(d.Pathogenic) +
      parseInt(d["Likely pathogenic"])
  );

  // stack data
  const stack = d3.stack().keys(pathLevels)(data);

  // scales
  const xScale = d3
    .scaleBand()
    .domain(chromosomes)
    .range([margin.left, boundsWidth + margin.left])
    .padding([0.1]);
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
    <svg width={wrapperWidth} height={wrapperHeight} className="bar-chart">
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
          return (
            <rect
              key={`${d.data.Chromosome} ${d.data.ClinicalSignificance}`}
              width={xScale.bandwidth()}
              x={xScale(d.data.Chromosome)}
              y={yScale(d[1])}
              height={yScale(d[0]) - yScale(d[1])}
              fill={colourScale(pathLevels[i])}
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
