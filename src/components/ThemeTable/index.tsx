import React from "react";
import { VNode } from "preact";
import { Spinner, Table } from "react-bootstrap";
import { iconArrowDown, iconArrowTop } from "src/assets/images";
import { Strings } from "src/resources";

const ThemeTable = ({
  labels,
  children,
  length,
  isLoading,
  handleSorting,
}: ThemeTableProps): VNode<any> => {
  return (
    <Table key={Math.random() * 100} responsive="xl" borderless>
      <thead>
        <tr>
          {labels?.map((i: any, index: any) => {
            return (
              <th key={index}>
                {i?.sort && (
                  <button
                    onClick={() => handleSorting(i?.sortName, !i?.sortOrder)}
                    className="sort-icon"
                  >
                    <img
                      src={i?.sortOrder ? iconArrowTop : iconArrowDown}
                      alt="icon"
                    />
                  </button>
                )}
                {i?.name}
              </th>
            );
          })}
        </tr>
      </thead>
      {length && length > 0 && !isLoading ? (
        <tbody>{children}</tbody>
      ) : isLoading ? (
        <tr>
          <td
            colSpan={labels?.length}
            className={`text-center ${labels ? "table-empty-item" : ""}`}
          >
            <Spinner animation="border" role="status" />
          </td>
        </tr>
      ) : (
        <tr>
          <td
            colSpan={labels?.length}
            className={`text-center ${labels ? "table-empty-item" : ""}`}
          >
            <span style={{ background: "none" }}>{Strings.no_found}</span>
          </td>
        </tr>
      )}
    </Table>
  );
};
type ThemeTableProps = {
  labels: any;
  className?: string;
  children: any;
  length?: number;
  isLoading?: boolean;
  handleSorting?: (sortName: string, sortOrder: boolean) => void;
};
export default ThemeTable;
