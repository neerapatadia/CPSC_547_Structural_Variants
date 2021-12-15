import React from "react";

const Legend = ({ colourMap }) => {
  const categories = Object.keys(colourMap);

  return (
    <div>
      <h2 className="legend-title text-center">Clinical Significance</h2>
      <div className="legend-colours sidebar-margin-left">
        {categories.map((l) => {
          return (
            <div className="legend-element" key={l}>
              <div
                style={{ background: colourMap[l] }}
                className="legend-bubble"
              ></div>
              <p>{l}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Legend;
