import { VNode } from "preact";
import React from "react";
import { Link } from "react-router-dom";

import Button from "../Button";
import Heading from "../Heading";
import SearchBox from "../SearchBox";
import "./table-header.scss";
import { SvgPenToEdit, iconMessage, iconFilter } from "src/assets/images";
import { allRoutes } from "src/constants/AllRoutes";
import ParPageDropdown from "../parPageDropDown";
import { Strings } from "src/resources";

const TableHeader = ({
  title,
  addBtn,
  titleIcon,
  btnFilter,
  btnFilterLength = false,
  searchBox,
  cancelBtn,
  addBtnPath,
  filterModal,
  handleSearch,
  messageThread,
  showPagination,
  cancelBtnPath,
  searchBoxPlaceholder,
  pageLength,
  onPageSizeChange,
}: TableHeader): VNode<any> => {
  return (
    <div className="table-header">
      <div className="block-m-head">
        <div className="block-m-add-h">
          <Heading title={title} />
          {titleIcon && (
            <button>
              <SvgPenToEdit size="24" />
            </button>
          )}
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {showPagination && (
            <div className="me-3">
              <ParPageDropdown
                pageLength={pageLength}
                onPageSizeChange={onPageSizeChange}
              />
            </div>
          )}
          {btnFilter && (
            <Button
              title={Strings.filter}
              variant="outline"
              onClick={filterModal}
              icon={iconFilter}
              className={btnFilterLength ? "filter-btn" : ''}
            />
          )}
          {messageThread && (
            <Link to={allRoutes.messageThread}>
              <Button
                title={Strings.message_thread}
                variant="outline"
                icon={iconMessage}
              />
            </Link>
          )}
          {searchBox && (
            <SearchBox
              placeholder={searchBoxPlaceholder}
              handleSearch={handleSearch}
            />
          )}
          {cancelBtnPath ? (
            <Link to={cancelBtnPath}>
              {cancelBtn && <Button title={cancelBtn} variant="outline" />}
            </Link>
          ) : (
            cancelBtn && <Button title={cancelBtn} variant="outline" />
          )}
          {addBtnPath ? (
            <Link to={addBtnPath}>
              {addBtn && <Button title={addBtn} variant="primary" />}
            </Link>
          ) : (
            addBtn && <Button title={addBtn} variant="primary" />
          )}
        </div>
      </div>
    </div>
  );
};
type TableHeader = {
  title: string;
  addBtn?: string;
  searchBox?: any;
  btnFilter?: boolean;
  btnFilterLength?: boolean;
  messageThread?: boolean;
  cancelBtn?: string;
  addBtnPath?: any;
  filterModal?: any;
  showPagination?: boolean;
  className?: string;
  handleSearch?: any;
  cancelBtnPath?: any;
  titleIcon?: boolean;
  searchBoxPlaceholder?: string;
  pageLength?: string;
  onPageSizeChange?: ((value: number) => void) | undefined;
};

export default TableHeader;
