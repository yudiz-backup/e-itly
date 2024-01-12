import { VNode } from "preact";
import React from "react";
import { Dropdown } from "react-bootstrap";
import { Strings } from "src/resources";

const ParPageDropdown = ({
  pageLength,
  onPageSizeChange,
}: ParPageDropdownProps): VNode<any> => {
  return (
    <div className="par-page-dropdown d-flex gap-4 align-items-center">
      <div className="page-size-dropdown">
        <span className="page">{Strings.rows_par_page} </span>
        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic">{pageLength}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => onPageSizeChange?.(10)}>
              10
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onPageSizeChange?.(20)}>
              20
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};
type ParPageDropdownProps = {
  pageLength?: string;
  onPageSizeChange?: ((value: number) => void) | undefined;
};
export default ParPageDropdown;
