import { ReactNode } from "react";

type DataTableProps = {
  title: string;
  columns: string[];
  rows: ReactNode[][];
};

export function DataTable({ title, columns, rows }: DataTableProps) {
  return (
    <section className="table-card">
      <div className="table-head">
        <h3>{title}</h3>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${title}-${index}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${title}-${index}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
