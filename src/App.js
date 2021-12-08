import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import BarChart from "./components/BarChart";
import GenomePlots from "./components/GenomePlots";
import Legend from "./components/Legend";
import { getDimensions } from "./utils/getDimensions";
import "./App.css";

// dimensions:
// main container = 90% width
// circos / linear track = 60% width of main
// bar charts / hover details = 40% width of main
// see App.css

function App() {
  const [data, setData] = useState([]);
  const [circosWidth, setCircosWidth] = useState(getDimensions(0.6));
  const [barChartDims, setBarChartDims] = useState({
    wrapperWidth: getDimensions(0.4),
    wrapperHeight: getDimensions(0.4 * 0.6), // height of bar chart is 0.6 of width
  });

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      const d = await d3.tsv("/data/test.tsv");
      setData(d);
    };
    fetchData();
  }, []);

  // listen for resize events
  useEffect(() => {
    const handleResize = () => {
      setCircosWidth(
        0.54 * window.innerWidth > 756 ? 756 : 0.54 * window.innerWidth
      );
      setBarChartDims({
        wrapperWidth:
          0.36 * window.innerWidth > 540 ? 540 : 0.36 * window.innerWidth,
        wrapperHeight:
          0.2 * window.innerWidth > 224 ? 224 : 0.2 * window.innerWidth,
      });
    };

    window.addEventListener("resize", handleResize);
  }, []);

  const pathLevels = [
    "Uncertain significance",
    "Benign",
    "Likely pathogenic",
    "Pathogenic",
  ];

  const colourMap = {
    "Uncertain significance": "#818589",
    Benign: "#4dac26",
    "Likely pathogenic": "#eb95df",
    Pathogenic: "#d01c8b",
  };

  return (
    <>
      <h1>ClinVar Structural Variants</h1>

      <main className="dashboard">
        <GenomePlots width={circosWidth} />
        <div className="side">
          {data && data.length > 0 && (
            <BarChart
              data={data}
              pathLevels={pathLevels}
              colourMap={colourMap}
              title="ClinVar Variants"
              wrapperWidth={barChartDims.wrapperWidth}
              wrapperHeight={barChartDims.wrapperHeight}
              leftOffset={50}
            />
          )}
          <Legend pathLevels={pathLevels} colourMap={colourMap} />
        </div>
      </main>
    </>
  );
}

export default App;
