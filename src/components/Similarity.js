import React from "react";

const Similarity = ({ value }) => {
  return (
    <td>
      <div
        style={{ width: `${value}%`, backgroundColor: "grey", height: "1.375em" }}
        className="similarity"
      ></div>
    </td>
  );
};

export default Similarity;
