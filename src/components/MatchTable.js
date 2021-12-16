import React from "react";
import { useTable, usePagination } from "react-table";
import ClinicalSignificance from "./ClinicalSignificance";
import Select from "react-select";
import Similarity from "./Similarity";

const pageSelectOptions = [10, 20, 30].map((c) => ({
  value: c,
  label: `Show ${c}`,
}));

const MatchTable = ({ columns, data, colourMap }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  return (
    <div className="container match-table-container">
      <h2>HG002 Matches</h2>
      <table {...getTableProps()} className="match-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  if (cell.column.id === "ClinicalSignificance")
                    return (
                      <ClinicalSignificance
                        value={cell.value}
                        colourMap={colourMap}
                      />
                    );
                  if (cell.column.id === "Similarity") {
                    return <Similarity value={cell.value} />;
                  }
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="match-table-controls">
        <button
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          className="match-table-button"
        >
          {"<<"}
        </button>
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="match-table-button"
        >
          {"<"}
        </button>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="match-table-button"
        >
          {">"}
        </button>
        <button
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          className="match-table-button"
        >
          {">>"}
        </button>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <span className="match-table-jump-to">Go to page: </span>
        <input
          type="number"
          defaultValue={pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            gotoPage(page);
          }}
        />
        <Select
          options={pageSelectOptions}
          onChange={(e) => setPageSize(e.value)}
          defaultValue={{ value: 10, label: "Show 10" }}
        />
      </div>
    </div>
  );
};

export default MatchTable;
