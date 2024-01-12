import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Offcanvas } from "react-bootstrap";
import { Fragment, VNode } from "preact";
import { useRecoilState } from "recoil";

// component
import SearchBox from "src/components/SearchBox";
import Checkbox from "src/components/Checkbox";
import Button from "src/components/Button";
import Chips from "src/components/Chips";

// query
import { getItineraryOwner } from "src/Query/Itinerary/itinerary.query";

// recoil-state
import { itineraryAppliedOwnerFilter } from "src/recoilState/itinerary/itineraryFilter";

import { Strings } from "src/resources";
const INITIAL_USER_TYPE = [
  { id: 'Sub Admin' },
  { id: 'Super Admin' },
]

const FilterSidebar = ({
  filterShow,
  filterHandle,
  handleApplyFilter
}: FilterSidebarProps): VNode<any> => {


  const [appliedOwnerRecoil, setAppliedOwnerRecoil] = useRecoilState<ItineraryAppliedOwnerFilter>(itineraryAppliedOwnerFilter)
  const appliedOwnerRef = useRef(appliedOwnerRecoil)
  const [params, setParams] = useState({
    search: "",
    userType: INITIAL_USER_TYPE
  });

  // get Itinerary Owner Filter
  const { data } = useQuery({
    queryKey: ["getItineraryOwner", params],
    queryFn: () => getItineraryOwner(params),
    select: (data) => data?.data,
    enabled: filterShow,
  });

  function handleCheckOwner(checked: boolean, owner: any) {
    if (checked) {
      setAppliedOwnerRecoil((prevOwners) => [...prevOwners, owner]);
    } else {
      handleUncheckOwner(owner);
    }
  }

  function handleUncheckOwner(owner) {
    setAppliedOwnerRecoil((prevOwners) =>
      prevOwners.filter((selectedOwner) => selectedOwner?.id !== owner?.id)
    );
  }
  function handleApply(selectedData) {
    appliedOwnerRef.current = selectedData
    handleApplyFilter(selectedData);
  }

  function handleClearAllFilter() {
    filterHandle();
    setAppliedOwnerRecoil([])
    appliedOwnerRef.current = []
    handleApply([])
  }

  function handleCloseFilter() {
    filterHandle()
    setAppliedOwnerRecoil(appliedOwnerRef.current)
  }

  function handleSearch(search: string) {
    setParams((prev) => ({
      ...prev,
      search
    }));
  }

  return (
    <div className="filter-sidebar">
      <Offcanvas
        show={filterShow}
        onHide={handleCloseFilter}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{Strings.filter}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="filter-sidebar-head">
            <h5>{Strings.by_creator}</h5>
            <SearchBox
              placeholder={Strings.search_creator}
              handleSearch={handleSearch}
            />
            {appliedOwnerRecoil.length > 0 ? (
              <div className="chips-spacing">
                {appliedOwnerRecoil?.map((item, index) => {
                  return (
                    <Fragment key={index}>
                      <Chips
                        title={item?.userName}
                        closeIcon
                        onClick={() => handleUncheckOwner(item)}
                      />
                    </Fragment>
                  );
                })}
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="filter-sidebar-items">
            {data?.owner?.map?.((item) => {
              return (
                <Checkbox
                  key={item.id}
                  label={item?.userName}
                  checked={appliedOwnerRecoil.some(
                    (selectedOwner) => selectedOwner?.id === item.id
                  )}
                  onChange={(e: any) =>
                    handleCheckOwner(e?.target?.checked, item)
                  }
                />
              );
            })}
          </div>
          <div className="offcanvas-footer flex-between gap-4">
            <Button
              title={Strings.clear_all}
              variant="outline"
              fullWidth
              onClick={handleClearAllFilter}
            />
            <Button
              title={Strings.apply}
              variant="primary"
              fullWidth
              onClick={() => handleApply(appliedOwnerRecoil)}
            />
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};
type FilterSidebarProps = {
  filterShow: boolean;
  filterHandle: () => void;
  handleApplyFilter: (selectedOwners) => void;
};
export default FilterSidebar;
