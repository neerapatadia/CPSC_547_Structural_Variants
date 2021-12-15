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
		"static": true,
  		"spacing": 1,
  		"centerRadius": 0.3,
		"assembly": "hg19",
		"tracks": [
			//Deletions
			{
						"data": {
						  "url": "https://raw.githubusercontent.com/armtsf/tmp/main/allmatched.csv",
						  "type": "csv",
						  "chromosomeField": "CHROM",
						  "genomicFields": ["POS", "END"]
						},
						"dataTransform": [{ "type": "filter", "field": "SVTYPE", "oneOf": ["Deletion"] }],
						"mark": "rect",
						"color": {
						  "field": "ClinicalSignificance",
						  "type": "nominal",
						  "domain": [
					"Uncertain significance",
					"Benign",
					"Likely pathogenic",
					"Pathogenic"
						  ],
						  "range": [
					"#818589",
					"#4DAC26",
					"#EB95DF",
					"#D01C8B"
						  ]
						},
						"x": {"field": "POS", "type": "genomic"},
				// "xe": {"field": "END", "type": "genomic"},
						"stroke": {"value": "lightgray"},
						"strokeWidth": {"value": 0.1},
						"width": 700,
						"height": 10
					},
		
			//All events
			{
			  "style": {"background": "lightgray", "backgroundOpacity": 0.2},
			  "data": {
						"url": "https://raw.githubusercontent.com/armtsf/tmp/main/all_hg.csv",
						"type": "csv",
						"chromosomeField": "CHROM",
						"genomicFields": ["POS", "END"]
					  },
					  "mark": "rect",
				"color": {
						  "field": "TYPE",
						  "type": "nominal",
						  "domain": [
							  "DEL",
							  "INS"
						  ],
						  "range": [
						  "#BDBDBD",
					"#636363"
						  ]
						},
					  "x": {"field": "POS", "type": "genomic"},
				// "xe": {"field": "END", "type": "genomic"},
					  "stroke": {"value": "gray"},
					  "strokeWidth": {"value": 0.1},
					  "width": 700,
					  "height": 30
			},
		
			//Insertions and Translocations
			{
			  "alignment": "overlay",
			  "tracks":[
				//Events
				{
				  "data": {
						  "url": "https://raw.githubusercontent.com/armtsf/tmp/main/allmatched.csv",
						  "type": "csv",
						  "chromosomeField": "CHROM",
						  "genomicFields": ["POS", "END"]
						},
						"dataTransform": [{ "type": "filter", "field": "SVTYPE", "oneOf": ["Deletion"], "not": true }],
						"mark": "rect",
						"color": {
						  "field": "ClinicalSignificance",
						  "type": "nominal",
						  "domain": [
					"Uncertain significance",
					"Benign",
					"Likely pathogenic",
					"Pathogenic"
						  ],
						  "range": [
					"#818589",
					"#4dac26",
					"#eb95df",
					"#d01c8b"
						  ]
						},
						"x": {"field": "POS", "type": "genomic"},
				// "xe": {"field": "END", "type": "genomic"},
						"stroke": {"value": "lightgray"},
						"strokeWidth": {"value": 1}
					},
		
			  //Links
			  {
				"data": {
							"type": "csv",
							"url": "https://raw.githubusercontent.com/armtsf/tmp/main/allmatched.csv",
							"genomicFieldsToConvert": [
							  {"chromosomeField": "CHROM", "genomicFields": ["POS", "END"]},
							  {"chromosomeField": "Chromosome", "genomicFields": ["Start", "Stop"]}
							]
						  },
		    "dataTransform": [{ "type": "filter", "field": "Type", "oneOf": ["Deletion", "Insertion"], "not": true }],
						  "mark": "withinLink",
						  "x": {"field": "POS", "type": "genomic"},
						  // "xe": {"field": "END", "type": "genomic"},
						  // "x1": {"field": "Start", "type": "genomic"},
						  "xe": {"field": "Stop", "type": "genomic"},
						  "stroke": {
					"field": "ClinicalSignificance",
					"type": "nominal",
					"domain": [
					  "Uncertain significance",
					  "Benign",
					  "Likely pathogenic",
					  "Pathogenic"
					],
					"range": [
					  "#818589",
					  "#4dac26",
					  "#eb95df",
					  "#d01c8b"
					]
						  },
						  "strokeWidth": {"value": 1}
			  }
			  ],
			  "width": 700,
			  "height": 30
			}
		  ]
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
