import React, { useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import { range } from "lodash";
import BarChart from "./components/BarChart";
import GenomePlots from "./components/GenomePlots";
import Legend from "./components/Legend";
import MatchTable from "./components/MatchTable";
import Select from "react-select";
import { getDimensions } from "./utils/getDimensions";
import "./App.css";

// dimensions:
// main container = 90% width
// circos / linear track = 60% width of main
// bar charts / hover details = 40% width of main
// see App.css

// TODO: try layout with one track for all SVs, one track for matches

const chromosomes = range(1, 23)
  .map((c) => `${c}`)
  .concat(["X", "Y"]);

const chromOptions = [{ value: null, label: "All" }];
for (const chrom of chromosomes) {
  chromOptions.push({ value: chrom, label: `Chromosome ${chrom}` });
}

const pathLevels = [
  "Uncertain significance",
  "Benign",
  "Likely pathogenic",
  "Pathogenic",
];

const colourMap = {
  "No match": "#818589",
  "Uncertain significance": "#0092D0",
  Benign: "#4dac26",
  "Likely pathogenic": "#eb95df",
  Pathogenic: "#d01c8b",
};

function App() {
  const [clinvarSummary, setClinvarSummary] = useState([]);
  const [matchSummary, setMatchSummary] = useState([]);
  const [matchData, setMatchData] = useState(null);
  const [selectedChrom, setSelectedChrom] = useState(null);

  const [tableLoading, setTableLoading] = useState(true);

  const [circosWidth, setCircosWidth] = useState(getDimensions(0.6));
  const [barChartDims, setBarChartDims] = useState({
    wrapperWidth: getDimensions(0.4),
    wrapperHeight: getDimensions(0.4 * 0.7), // height of bar chart is 0.8 of width
  });

  // fetch clinvar summary
  useEffect(() => {
    const fetchData = async () => {
      const d = await d3.tsv("/data/clinvar_counts_by_chromosome.tsv");

      // remove MT chromosome
      const variants = d.filter((v) => chromosomes.includes(v.Chromosome));
      setClinvarSummary(variants);
    };

    fetchData();
  }, []);

  // fetch match summary
  useEffect(() => {
    const fetchData = async () => {
      const d = await d3.tsv("/data/hg002_matches_counts_by_chromosome.tsv");
      setMatchSummary(d);
    };

    fetchData();
  }, []);

  // fetch match details by selected chromosome
  useEffect(() => {
    const fetchData = async () => {
      setTableLoading(true);
      const d = await d3.tsv("/data/allmatched_clean.tsv");

      if (selectedChrom) {
        const matches = d.filter((v) => v.CHROM === selectedChrom);
        setMatchData(matches);
      } else {
        setMatchData(d);
      }

      setTableLoading(false);
    };

    fetchData();
  }, [selectedChrom]);

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

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Chr",
        accessor: "CHROM",
      },
      {
        Header: "Position",
        accessor: "POS",
      },
      {
        Header: "Type",
        accessor: "Type",
      },
      {
        Header: "Clinical Significance",
        accessor: "ClinicalSignificance",
      },
      {
        Header: "Similarity",
        accessor: "Similarity",
      },
      {
        Header: "Allele ID",
        accessor: "AlleleID",
      },
      {
        Header: "Associated Phenotypes",
        accessor: "PhenotypeList",
      },
      {
        Header: "Gene",
        accessor: "HGNC_ID",
      },
    ],
    []
  );

  const handleSelectedChromChange = (e) => {
    setSelectedChrom(e.value);
  };

  return (
    <>
      <h1>Structural Variant Pathogenicity</h1>

      <main className="container dashboard">
        <GenomePlots
          width={circosWidth}
          selectedChrom={selectedChrom}
          pathLevels={pathLevels}
          colourMap={colourMap}
        />
        <div className="side">
          <div className="sidebar-margin-left">
            <h3 className="legend-title">Select Chromosome</h3>
            <Select
              options={chromOptions}
              defaultValue={{ value: null, label: "All" }}
              onChange={handleSelectedChromChange}
            />
          </div>
          <Legend colourMap={colourMap} />
          {clinvarSummary.length > 0 && (
            <BarChart
              data={clinvarSummary}
              chromosomes={chromosomes}
              pathLevels={pathLevels}
              colourMap={colourMap}
              title="ClinVar Variants"
              wrapperWidth={barChartDims.wrapperWidth}
              wrapperHeight={barChartDims.wrapperHeight}
              leftOffset={50}
            />
          )}
          {matchSummary.length > 0 && (
            <BarChart
              data={matchSummary}
              chromosomes={chromosomes}
              pathLevels={pathLevels}
              colourMap={colourMap}
              title="HG002 Matches"
              wrapperWidth={barChartDims.wrapperWidth}
              wrapperHeight={barChartDims.wrapperHeight}
              leftOffset={50}
            />
          )}
        </div>
      </main>
      {tableLoading ? (
        <p className="text-center">Loading matches...</p>
      ) : (
        <MatchTable columns={columns} data={matchData} />
      )}
    </>
  );
}

export default App;
