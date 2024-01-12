/* eslint-disable no-unsafe-optional-chaining */
// @ts-nocheck
import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import queryClient from "src/queryClient";
import { useRecoilValue } from "recoil";
import { toast } from "react-toastify";

//component
import AVESDetailsModal from "src/components/Modal/AVESDetailsModal";
import CustomPagination from "src/components/CustomPagination";
import TrashModal from "src/components/Modal/TrashModal";
import FilterSidebar from "./components/FilterSidebar";
import OptionsButton from "./components/OptionsButton";
import TableHeader from "src/components/TableHeader";
import ThemeTable from "src/components/ThemeTable";

// query
import { deleteItinerary, updateItineraryStatus } from "src/Query/Itinerary/itinerary.mutation";
import ItineraryStatusSelect from "./components/ItineraryStatusSelect";
import { getItinerary } from "src/Query/Itinerary/itinerary.query";
import { hasError } from "src/services/ApiHelpers";

// Recoil States
import { itineraryAppliedOwnerFilter } from "src/recoilState/itinerary/itineraryFilter";

import { calculateTotalExternalCost } from "src/utils/calculation";
import { checkUserPermission, isBooker } from "src/utils/users";
import { allRoutes } from "src/constants/AllRoutes";
import useModal from "src/hooks/useModal";
import { Strings } from "src/resources";
import { PERMISSION, PERMISSION_VALUE } from "src/constants/permissionEnum";

const BLOCKS_LABELS_INITIAL_VALUE = [
  {
    name: Strings.itinerary_id,
    sort: true,
    sortName: "",
    sortOrder: true,
  },
  {
    name: Strings.itinerary_name,
    sort: true,
    sortName: "itineraryName",
    sortOrder: true,
  },
  {
    name: Strings.members,
    sort: true,
    sortName: "participants",
    sortOrder: true,
  },
  {
    name: Strings.start_date,
    sort: true,
    sortName: "startDate",
    sortOrder: true,
  },
  {
    name: Strings.no_of_days,
    sort: true,
    sortName: "noOfDay",
    sortOrder: true,
  },
  {
    name: Strings.total_price,
    sort: true,
    sortName: "",
    sortOrder: true,
  },
  {
    name: Strings.invoice,
    sort: false,
    sortName: "",
    sortOrder: false,
  },
  {
    name: Strings.status,
    sort: false,
    sortName: "",
    sortOrder: false,
  },
  {
    name: Strings.action,
    sort: false,
    sortName: "",
    sortOrder: false,
  },
]

const ItineraryManagement = () => {

  const navigate = useNavigate()
  const { toggle, isShowing } = useModal();

  const appliedOwnerRecoil = useRecoilValue<ItineraryAppliedOwnerFilter>(itineraryAppliedOwnerFilter)

  const ITINERARY_FILTER_INITIAL_VALUE = {
    limit: 10,
    search: "",
    page: 1,
    filterPage: 1,
    sort: "itineraryName",
    sortOrder: "asc",
    [isBooker() ? 'bookerId' : 'emailIds']: appliedOwnerRecoil
  }

  const [avesDetailsModal, setAvesDetailsModal] = useState({ open: false, itineraryData: '' });
  const [itineraryFilter, setItineraryFilter] = useState(ITINERARY_FILTER_INITIAL_VALUE)
  const [blocksLabels, setBlocksLabels] = useState(BLOCKS_LABELS_INITIAL_VALUE);
  const [filterShow, setFilterShow] = useState(false);
  const [itineraryId, setItineraryId] = useState('')

  // get Itinerary
  const { data, isFetching } = useQuery({
    queryKey: ["getItinerary", itineraryFilter],
    queryFn: () => getItinerary(itineraryFilter),
    select: (data) => data?.data,
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

  // Delete Itinerary
  const deleteItineraryMutation = useMutation(deleteItinerary, {
    onSuccess: (data) => {
      toast.success(data?.message);
      handleCloseTrashModal();
      setItineraryFilter(ITINERARY_FILTER_INITIAL_VALUE)
      queryClient.invalidateQueries(["getItinerary"]);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
      handleCloseTrashModal();
    },
  });

  function filterHandle() {
    setFilterShow(!filterShow)
  }

  function AVESDetailsModalHandle() {
    setAvesDetailsModal({ open: !avesDetailsModal?.open, id: '' });
  }

  function handleDelete(id: string) {
    toggle()
    setItineraryId(id)
  }

  function handleView(id: string) {
    navigate(`${allRoutes.itineraryView}?itineraryId=${id}`)
  }

  function handleEdit(id: string) {
    navigate(`${allRoutes.itineraryEdit}?itineraryId=${id}`)
  }

  function handleDeleteModalConfirm(id: string) {
    deleteItineraryMutation.mutate(id)
  }

  function handleCloseTrashModal() {
    toggle()
    setItineraryId('')
  }

  const handleSorting = (sortName: string, sortOrder: boolean) => {
    if (sortOrder != undefined && sortName != undefined) {
      const updatedBlocksLabels = blocksLabels.map((label) => {
        if (label.sortName === sortName) {
          return { ...label, sortOrder: sortOrder };
        }
        return label;
      });
      setBlocksLabels(updatedBlocksLabels);
      setItineraryFilter((prevState) => ({
        ...prevState,
        sort: sortName,
        sortOrder: sortOrder ? "asc" : "desc",
      }));
    }
  };

  const handlePageSizeChange = (newPageSize: any) => {
    setItineraryFilter({
      limit: newPageSize,
      search: "",
      page: 1,
      filterPage: 1,
      sort: "itineraryName",
      sortOrder: "asc",
      [isBooker() ? 'bookerId' : 'emailIds']: appliedOwnerRecoil,
    });
  };

  const handlePagination = (page: string) => {
    if (data?.page) {
      if (page === "next") {
        setItineraryFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: data?.page,
          filterPage: itineraryFilter?.filterPage + 1,
        }));
      } else if (page === "prev") {
        setItineraryFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: data?.page,
          filterPage: itineraryFilter?.filterPage - 1,
        }));
      } else if (page === "first") {
        setItineraryFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: 1,
          filterPage: 1,
        }));
      }
    } else {
      if (page === "prev" && data?.prevEndBeforeDocId != null) {
        setItineraryFilter((prevState) => ({
          ...prevState,
          prevEndBeforeDocId: data?.prevEndBeforeDocId,
          nextStartAfterDocId: "",
          page: Number(itineraryFilter?.page) - 1,
        }));
      } else if (page === "next" && data?.nextStartAfterDocId != null) {
        setItineraryFilter((prevState) => ({
          ...prevState,
          nextStartAfterDocId: data?.nextStartAfterDocId,
          prevEndBeforeDocId: "",
          page: Number(itineraryFilter?.page) + 1,
        }));
      } else if (page === "first") {
        setItineraryFilter({
          limit: 10,
          search: "",
          page: 1,
          filterPage: 0,
          sort: "itineraryName",
          sortOrder: "asc",
          [isBooker() ? 'bookerId' : 'emailIds']: appliedOwnerRecoil,
        });
      }
    }
  };

  const handleSearch = (search: string) => {
    setItineraryFilter({
      limit: 10,
      search: search,
      page: 1,
      filterPage: 1,
      sort: "itineraryName",
      sortOrder: "asc",
      [isBooker() ? 'bookerId' : 'emailIds']: appliedOwnerRecoil,
    });
  };

  function handleApplyFilter(selectedOwners) {
    setItineraryFilter({
      limit: 10,
      search: '',
      page: 1,
      filterPage: 1,
      sort: 'itineraryName',
      sortOrder: 'asc',
      emailIds: selectedOwners,
    });
    filterHandle();
  }

  // change status
  const handleChangeSelect = async (value: any, blockId: string) => {
    const block: AsyncResponseType = await updateItineraryStatus({
      status: value?.value,
      blockId,
    });
    if (block?.success) {
      toast.success(block?.message);
      queryClient.invalidateQueries(["getItinerary"]);
    } else {
      toast.error(block?.message);
    }
  };

  return (
    <>
      <section className="itinerary">
        <TableHeader
          title={Strings.itinerary_management}
          searchBox
          searchBoxPlaceholder={Strings.search_here}
          handleSearch={handleSearch}
          addBtn={checkUserPermission(PERMISSION.itinerary, PERMISSION_VALUE.create) ? Strings.itinerary_add : ""}
          addBtnPath={
            checkUserPermission(PERMISSION.itinerary, PERMISSION_VALUE.create) ? allRoutes.itineraryAdd : ""
          }
          btnFilter={!isBooker()}
          btnFilterLength={appliedOwnerRecoil?.length}
          filterModal={filterHandle}
          messageThread
          showPagination
          pageLength={itineraryFilter?.limit?.toString()}
          onPageSizeChange={handlePageSizeChange}
        />

        <FilterSidebar
          filterShow={filterShow}
          filterHandle={filterHandle}
          handleApplyFilter={handleApplyFilter}
        />

        <ThemeTable
          labels={blocksLabels}
          isLoading={isFetching}
          length={data?.itinerary?.length}
          handleSorting={handleSorting}
        >
          {data?.itinerary?.map((item) => {
            const { id, itineraryId, itineraryName, participants, startDate, noOfDay, status } = item;
            return (
              <tr key={id}>
                <td>{itineraryId}</td>
                <td>{itineraryName}</td>
                <td>{participants}</td>
                <td>{startDate}</td>
                <td>{noOfDay}</td>
                <td>{Strings.euro}{item?.editedCost ? (item?.editedCost).toFixed(2) : (calculateTotalExternalCost(item).toFixed(2))}</td>
                <td>{'View'}</td>
                <td>
                  <ItineraryStatusSelect
                    onselectionchange={(e) => handleChangeSelect(e, id)}
                    defaultValue={status}
                    isDisabled={!checkUserPermission(PERMISSION.itinerary, PERMISSION_VALUE.activeInactive)}
                  />
                </td>
                <td>
                  <OptionsButton
                    toggle={toggle}
                    AVESDetailsHandler={() => {
                      setAvesDetailsModal({ open: !avesDetailsModal?.open, itineraryData: item })
                    }}
                    id={id}
                    handleDelete={() => handleDelete(id)}
                    handleView={() => handleView(id)}
                    handleEdit={() => handleEdit(id)}
                    createdBy={item?.createdBy}
                  />
                </td>
              </tr>
            );
          })}
        </ThemeTable>

        <CustomPagination
          handlePagination={handlePagination}
          disabledFirst={
            itineraryFilter?.filterPage == 1 && data?.page
              ? true
              : data?.prevEndBeforeDocId || data?.page > 0
                ? false
                : true
          }
          disabledPrev={
            itineraryFilter?.filterPage == 1 && data?.page
              ? true
              : data?.prevEndBeforeDocId || data?.page > 0
                ? false
                : true
          }
          disabledNext={
            data?.page == itineraryFilter?.filterPage
              ? true
              : data?.nextStartAfterDocId || data?.page > 0
                ? false
                : true
          }
        />
      </section>

      <TrashModal
        title={Strings.itinerary}
        body={Strings.itinerary_delete}
        trashModal={isShowing}
        handleCLoseTrashModal={toggle}
        handleDeleteData={() => handleDeleteModalConfirm(itineraryId)}
        disabled={deleteItineraryMutation?.isLoading}
      />

      <AVESDetailsModal
        isShowing={avesDetailsModal?.open}
        toggle={AVESDetailsModalHandle}
        itineraryData={avesDetailsModal?.itineraryData}
      />
    </>
  );
};

export default ItineraryManagement;
