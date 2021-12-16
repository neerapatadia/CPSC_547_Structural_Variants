import React, { useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import { range, indexOf, sortBy } from "lodash";
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

// TODO: allow sorting table

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
  "All variants": "#818589",
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
  const [selectedLevels, setSelectedLevels] = useState(pathLevels);

  const [tableLoading, setTableLoading] = useState(true);

  const [circosWidth, setCircosWidth] = useState(getDimensions(0.6));
  const [barChartDims, setBarChartDims] = useState({
    wrapperWidth: getDimensions(0.4),
    wrapperHeight: getDimensions(0.4 * 0.5),
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
      const filteredData = d.filter((v) =>
        selectedLevels.includes(v.ClinicalSignificance)
      );

      if (selectedChrom) {
        const matches = filteredData.filter((v) => v.CHROM === selectedChrom);
        setMatchData(matches);
      } else {
        setMatchData(filteredData);
      }

      setTableLoading(false);
    };

    fetchData();
  }, [selectedChrom, selectedLevels]);

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

  const sortClinicalSignificance = useMemo(
    () => (rowA, rowB, columnId, desc) => {
      if (
        indexOf(pathLevels, rowA.original[columnId]) >
        indexOf(pathLevels, rowB.original[columnId])
      ) {
        return 1;
      }
      return -1;
    },
    []
  );

  const sortChromosome = useMemo(
    () => (rowA, rowB, columnId, desc) => {
      if (
        indexOf(chromosomes, rowA.original[columnId]) >
        indexOf(chromosomes, rowB.original[columnId])
      ) {
        return 1;
      }
      return -1;
    },
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: "Chr",
        accessor: "CHROM",
        sortType: sortChromosome,
      },
      {
        Header: "Position",
        accessor: "POS",
      },
      {
        Header: "Type",
        accessor: "SVTYPE",
      },
      {
        Header: "Clinical Significance",
        accessor: "ClinicalSignificance",
        sortType: sortClinicalSignificance,
      },
      {
        Header: "Similarity",
        accessor: "Similarity",
      },
      {
        Header: "Allele ID",
        accessor: "AlleleID",
        disableSortBy: true,
      },
      {
        Header: "Associated Phenotypes",
        accessor: "PhenotypeList",
        disableSortBy: true,
      },
      {
        Header: "Gene",
        accessor: "HGNC_ID",
        disableSortBy: true,
      },
    ],
    []
  );

  const handleSelectedChromChange = (e) => {
    setSelectedChrom(e.value);
  };

  const checkLevelSelected = (level) => {
    return selectedLevels.includes(level);
  };

  const toggleLevelSelected = (e, level) => {
    const selected = selectedLevels.includes(level);
    if (selected) {
      const newLevels = selectedLevels.filter((l) => l !== level);
      setSelectedLevels(newLevels);
    } else {
      const newLevels = selectedLevels.concat(level);

      // maintain constant order of pathogenicity levels
      const orderedLevels = sortBy(newLevels, (o) => indexOf(pathLevels, o));
      setSelectedLevels(orderedLevels);
    }
  };

  return (
    <>
      <h1>Structural Variant Pathogenicity</h1>

      <main className="container dashboard">
        <GenomePlots
          width={circosWidth}
          selectedChrom={selectedChrom}
          selectedLevels={selectedLevels}
          pathLevels={pathLevels}
          colourMap={colourMap}
        />
        <section className="side">
          <Legend colourMap={colourMap} />
          <div className="sidebar-margin-left">
            <div className="select-levels">
              <h3>Select Pathogenicity</h3>
              {pathLevels.map((l) => (
                <label key={l}>
                  <input
                    type="checkbox"
                    checked={checkLevelSelected(l)}
                    onChange={(e) => toggleLevelSelected(e, l)}
                  />
                  {l}
                </label>
              ))}
            </div>
            <h3>Navigate to Chromosome</h3>
            <Select
              options={chromOptions}
              defaultValue={{ value: null, label: "All" }}
              onChange={handleSelectedChromChange}
            />
          </div>
          {clinvarSummary.length > 0 && (
            <BarChart
              data={clinvarSummary}
              chromosomes={chromosomes}
              pathLevels={selectedLevels}
              colourMap={colourMap}
              title="ClinVar Variants"
              wrapperWidth={barChartDims.wrapperWidth}
              wrapperHeight={barChartDims.wrapperHeight}
              leftOffset={50}
              selectedChrom={selectedChrom}
            />
          )}
          {matchSummary.length > 0 && (
            <BarChart
              data={matchSummary}
              chromosomes={chromosomes}
              pathLevels={selectedLevels}
              colourMap={colourMap}
              title="HG002 Matches"
              wrapperWidth={barChartDims.wrapperWidth}
              wrapperHeight={barChartDims.wrapperHeight}
              leftOffset={50}
              selectedChrom={selectedChrom}
            />
          )}
        </section>
      </main>
      {tableLoading ? (
        <p className="text-center">Loading matches...</p>
      ) : (
        <MatchTable
          columns={columns}
          data={matchData}
          colourMap={colourMap}
          pathLevels={pathLevels}
        />
      )}
    </>
  );
}

export default App;
