import React from "react";
import { range } from "lodash";
import * as d3 from "d3";
import BarChartXAxis from "./BarChartXAxis";
import BarChartYAxis from "./BarChartYAxis";

const BarChart = ({ data, wrapperWidth, wrapperHeight, title }) => {
  // sizing
  const margin = {
    top: 25,
    right: 5,
    bottom: 35,
    left: 50,
  };
  const boundsWidth = wrapperWidth - margin.left - margin.right;
  const boundsHeight = wrapperHeight - margin.top - margin.bottom;

  // order chromosomes
  const chromosomes = range(1, 23)
    .map((c) => `${c}`)
    .concat(["X", "Y", "MT"]);

  // get total # variants per chromosome
  const chromosomeTotals = data.map(
    (d) =>
      parseInt(d.Benign) +
      parseInt(d["Likely benign"]) +
      parseInt(d.Pathogenic) +
      parseInt(d["Likely pathogenic"])
  );

  const variantTypes = [
    "Likely benign",
    "Benign",
    "Likely pathogenic",
    "Pathogenic",
  ];

  // stack data
  const stack = d3.stack().keys(variantTypes)(data);

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
  const colourScale = d3
    .scaleOrdinal()
    .domain(variantTypes)
    .range(["#c2a5cf", "#7b3294", "#a6dba0", "#008837"]);

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
        style={{ textAnchor: "middle", fontWeight: "500", fontSize: "1.5rem" }}
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
              fill={colourScale(variantTypes[i])}
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
