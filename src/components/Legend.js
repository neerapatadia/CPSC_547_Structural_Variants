import React from "react";

const Legend = ({ pathLevels, colourMap }) => {
  return (
    <>
      <h3 className="legend-title">Clinical Significance</h3>
      <div className="legend-colours">
        {pathLevels.map((l) => {
          return (
            <div className="legend-element">
              <div
                style={{ background: colourMap[l] }}
                className="legend-bubble"
              ></div>
              <p>{l}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Legend;
