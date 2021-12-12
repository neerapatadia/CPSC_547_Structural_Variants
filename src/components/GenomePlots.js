import React from "react";
import { GoslingComponent, validateGoslingSpec } from "gosling.js";

const GenomePlots = ({ width }) => {
  // spec copied from https://gosling.js.org/?example=CIRCULAR_OVERVIEW_LINEAR_DETAIL
  const spec = {
    arrangement: "vertical",
    views: [
      {
        static: true,
        layout: "circular",
        alignment: "stack",
		"tracks": [
			{
			  "data": {
				"url": "https://raw.githubusercontent.com/armtsf/tmp/main/matches-copy.csv",
				"type": "csv",
				"separator": "\t",
				"chromosomeField": "CHROM",
				"genomicFields": ["POS"]
			  },
			  "mark": "rect",
			  "color": {
				"field": "Type",
				"type": "nominal",
				"domain": [
				  "Insertion",
				  "Deletion"
				],
				"range": [
				  "black",
				  "red"
				]
			  },
			  "x": {"field": "POS", "type": "genomic"},
			  // "xe": {"field": "p1e", "type": "genomic"},
			  "stroke": {"value": "lightgray"},
			  "strokeWidth": {"value": 0.5},
			  "width": 700,
			  "height": 30
			},
			{
			  "data": {
				"url": "https://raw.githubusercontent.com/armtsf/tmp/main/matches-copy.csv",
				"type": "csv",
				"separator": "\t",
				"chromosomeField": "CHROM",
				"genomicFields": ["POS"]
			  },
			  "mark": "rect",
			  "color": {
				"field": "ClinicalSignificance",
				"type": "nominal",
				"domain": [
				  "Benign",
				  "Uncertain significance",
				  "Pathogenic",
				  "Likely pathogenic"
				],
				"range": [
				  "green",
				  "blue",
				  "yellow",
				  "red"
				]
			  },
			  "x": {"field": "POS", "type": "genomic"},
			  // "xe": {"field": "p1e", "type": "genomic"},
			  "stroke": {"value": "lightgray"},
			  "strokeWidth": {"value": 0.5},
			  "width": 700,
			  "height": 30
			},
			{
				  "data": {
					"type": "csv",
					"url": "https://raw.githubusercontent.com/armtsf/tmp/main/matched-new.csv",
					"separator": "\t",
					"genomicFieldsToConvert": [
					  {"chromosomeField": "chr1", "genomicFields": ["p1s", "p1e"]},
					  {"chromosomeField": "chr2", "genomicFields": ["p2s", "p2e"]}
					]
				  },
				  // "dataTransform": [
				  //   {
				  //     "type": "filter",
				  //     "field": "chr1",
				  //     "oneOf": ["1", "16", "14", "9", "6", "5", "3"]
				  //   },
				  //   {
				  //     "type": "filter",
				  //     "field": "chr2",
				  //     "oneOf": ["1", "16", "14", "9", "6", "5", "3"]
				  //   }
				  // ],
				  "mark": "withinLink",
				  "x": {"field": "p1s", "type": "genomic"},
				  "xe": {"field": "p1e", "type": "genomic"},
				  "x1": {"field": "p2s", "type": "genomic"},
				  "x1e": {"field": "p2e", "type": "genomic"},
				  "stroke": {
					"field": "type",
					"type": "nominal",
					"domain": [
					  "Deletion",
					  "Inversion",
					  "Translocation",
					  "tandem-duplication",
					  "Insertion"
					]
				  },
				  "strokeWidth": {"value": 0.8},
				  "opacity": {"value": 0.15},
				  "width": 500,
				  "height": 100
		  }
		  ],
      },
      {
        spacing: 10,
        arrangement: "horizontal",
        views: [
          {
            tracks: [
              {
                data: {
                  url: "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
                  type: "multivec",
                  row: "sample",
                  column: "position",
                  value: "peak",
                  categories: ["Uncertain Significance", "Benign", "Likely Pathogenic", "Pathogenic"],
                  binSize: 4,
                },
                mark: "bar",
                x: {
                  field: "start",
                  type: "genomic",
                  linkingId: "detail-1",
                  domain: { chromosome: "5" },
                },
                xe: { field: "end", type: "genomic" },
                y: { field: "peak", type: "quantitative" },
                row: { field: "sample", type: "nominal" },
                color: { field: "sample", type: "nominal" },
                stroke: { value: "black" },
                strokeWidth: { value: 0.3 },
                style: { background: "blue" },
                width: width / 2,
                height: 150,
              },
            ],
          },
          {
            tracks: [
              {
                data: {
                  url: "https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec",
                  type: "multivec",
                  row: "sample",
                  column: "position",
                  value: "peak",
                  categories: ["Uncertain Significance", "Benign", "Likely Pathogenic", "Pathogenic"],
                  binSize: 4,
                },
                mark: "bar",
                x: {
                  field: "start",
                  type: "genomic",
                  domain: { chromosome: "16" },
                  linkingId: "detail-2",
                },
                xe: { field: "end", type: "genomic" },
                y: { field: "peak", type: "quantitative" },
                row: { field: "sample", type: "nominal" },
                color: { field: "sample", type: "nominal", legend: true },
                stroke: { value: "black" },
                strokeWidth: { value: 0.3 },
                style: { background: "red" },
                width: width / 2,
                height: 150,
              },
            ],
          },
        ],
        style: { backgroundOpacity: 0.1 },
      },
    ],
  };

  const validity = validateGoslingSpec(spec);
  if (validity.state === "error") {
    console.warn("Gosling spec is invalid!", validity.messages);
    return;
  }

  return (
    <GoslingComponent spec={spec} padding={0} />
  )
};

export default GenomePlots;
