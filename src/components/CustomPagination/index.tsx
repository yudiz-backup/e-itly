import React from "react";
import { VNode } from "preact";
import { Pagination } from "react-bootstrap";

const CustomPagination = ({
  className,
  handlePagination = () => { },
  disabledFirst,
  disabledPrev,
  disabledNext,
  pageSize,
}: HeadingProps): VNode<any> => {
  return (
    <div className="custom-pagination">
      <div className="d-flex gap-4 align-items-center">
        <span>{pageSize}</span>
      </div>
      <Pagination className={className}>
        <Pagination.Item
          onClick={() => handlePagination("first")}
          disabled={disabledFirst}
        >
          First
        </Pagination.Item>
        <Pagination.Item
          onClick={() => handlePagination("prev")}
          disabled={disabledPrev}
        >
          Prev
        </Pagination.Item>
        <Pagination.Item
          onClick={() => handlePagination("next")}
          disabled={disabledNext}
        >
          Next
        </Pagination.Item>
      </Pagination>
    </div>
  );
};
type HeadingProps = {
  className?: string;
  handlePagination?: (value: string) => void;
  disabledFirst?: boolean;
  disabledPrev?: boolean;
  disabledNext?: boolean;
  pageSize?: string;
};
export default CustomPagination;
