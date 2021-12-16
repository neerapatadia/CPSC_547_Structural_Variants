import React, { useEffect, useMemo, useRef } from "react";
import { GoslingComponent, validateGoslingSpec } from "gosling.js";

const GenomePlots = ({ width, selectedChrom, pathLevels, colourMap }) => {
  const gosRef = useRef(null);

  const spec = useMemo(
    () => ({
      spacing: 10,
      views: [
        {
          static: true,
          layout: "circular",
          centerRadius: 0.5,
          tracks: [
            //All events
            {
              alignment: "overlay",
              style: { background: "lightgray", backgroundOpacity: 0.2 },
              data: {
                url: "https://raw.githubusercontent.com/armtsf/tmp/main/all_hg.csv",
                type: "csv",
                chromosomeField: "CHROM",
                genomicFields: ["POS", "END"],
              },
              mark: "rect",
              color: {
                field: "TYPE",
                type: "nominal",
                domain: ["DEL", "INS"],
                range: ["#BDBDBD", "#636363"],
              },
              x: { field: "POS", type: "genomic" },
              // xe: { field: "END", type: "genomic" },
              stroke: { value: colourMap["No match"] },
              strokeWidth: { value: 0.1 },
              width,
              height: 10,
              tracks: [
                { mark: "rect" },
                {
                  mark: "brush",
                  x: { linkingId: "detail" },
                  color: { value: "steelBlue" },
                },
              ],
            },

            //Insertions and Translocations
            {
              alignment: "overlay",
              tracks: [
                //Events
                {
                  data: {
                    url: "/data/allmatched_clean.tsv",
                    type: "csv",
                    separator: "\t",
                    chromosomeField: "CHROM",
                    genomicFields: ["POS", "END"],
                  },
                  dataTransform: [
                    {
                      type: "filter",
                      field: "SVTYPE",
                      // oneOf: ["Insertion", "Deletion", "Translocation"],
                    },
                  ],
                  mark: "rect",
                  color: {
                    field: "ClinicalSignificance",
                    type: "nominal",
                    domain: pathLevels,
                    range: pathLevels.map((l) => colourMap[l]),
                  },
                  x: { field: "POS", type: "genomic" },
                  // xe: { field: "END", type: "genomic" },
                  stroke: { value: "lightgray" },
                  strokeWidth: { value: 0.1 },
                  tracks: [
                    { mark: "rect" },
                    {
                      mark: "brush",
                      x: { linkingId: "detail" },
                      color: { value: "steelBlue" },
                    },
                  ],
                },

                //Links
                {
                  alignment: "overlay",
                  data: {
                    type: "csv",
                    url: "https://raw.githubusercontent.com/armtsf/tmp/main/matched-new.csv",
                    separator: "\t",
                    genomicFieldsToConvert: [
                      {
                        chromosomeField: "chr1",
                        genomicFields: ["p1s", "p1e"],
                      },
                      {
                        chromosomeField: "chr2",
                        genomicFields: ["p2s", "p2e"],
                      },
                    ],
                  },
                  mark: "withinLink",
                  x: { field: "p1s", type: "genomic" },
                  xe: { field: "p1e", type: "genomic" },
                  x1: { field: "p2s", type: "genomic" },
                  x1e: { field: "p2e", type: "genomic" },
                  stroke: {
                    field: "ClinicalSignificance",
                    type: "nominal",
                    domain: pathLevels,
                    range: pathLevels.map((l) => colourMap[l]),
                  },
                  strokeWidth: { value: 1 },
                },
              ],
              width,
              height: 30,
            },
          ],
        },
        {
          spacing: 10,
          arrangement: "horizontal",
          // linear track
          tracks: [
            {
              id: "linear-track",
              data: {
                type: "csv",
                separator: "\t",
                url: "/data/allmatched_clean.tsv",
                chromosomeField: "CHROM",
                genomicFields: ["POS", "END"],
              },
              mark: "rect",
              x: {
                field: "POS",
                type: "genomic",
                linkingId: "detail",
              },
              xe: {
                field: "END",
                type: "genomic",
              },
              color: {
                field: "ClinicalSignificance",
                type: "nominal",
                domain: pathLevels,
                range: pathLevels.map((l) => colourMap[l]),
              },
              stroke: {
                field: "ClinicalSignificance",
                type: "nominal",
                domain: pathLevels,
                range: pathLevels.map((l) => colourMap[l]),
              },
              strokeWidth: { value: 3 },
              width,
              height: 60,
              tooltip: [
                { field: "POS", type: "genomic", alt: "Start Position" },
                { field: "END", type: "genomic", alt: "End Position" },
                {
                  field: "SVTYPE",
                  type: "nominal",
                  alt: "SV Type",
                },
                {
                  field: "ClinicalSignificance",
                  type: "nominal",
                  alt: "Clinical Significance",
                },
                {
                  field: "Similarity",
                  type: "continuous",
                  alt: "Similarity",
                },
              ],
            },
          ],
        },
      ],
    }),
    [width, colourMap, pathLevels]
  );

  useEffect(() => {
    if (
      !(
        gosRef.current &&
        gosRef.current.api.getViewIds().includes("linear-track")
      )
    )
      return;

    if (selectedChrom) {
      gosRef.current.api.zoomTo("linear-track", `chr${selectedChrom}`);
    } else {
      gosRef.current.api.zoomToExtent("linear-track");
    }
  }, [selectedChrom]);

  const validity = validateGoslingSpec(spec);
  if (validity.state === "error") {
    console.warn("Gosling spec is invalid!", validity.messages);
    return;
  }

  return (
    <GoslingComponent
      spec={spec}
      padding={0}
      ref={gosRef}
      experimental={{ reactive: true }}
    />
  );
};

export default GenomePlots;
