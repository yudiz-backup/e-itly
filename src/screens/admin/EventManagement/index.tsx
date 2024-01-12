import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { SvgEyeFill, SvgPenToEdit, SvgTrash } from "src/assets/images";
import CustomPagination from "src/components/CustomPagination";
import TrashModal from "src/components/Modal/TrashModal";
import StatusSelect from "src/components/StatusSelect";
import TableHeader from "src/components/TableHeader";
import ThemeTable from "src/components/ThemeTable";
import { allRoutes } from "src/constants/AllRoutes";
import { deleteEvent } from "src/Query/Events/event.mutation";
import { getEvents } from "src/Query/Events/event.query";
import queryClient from "src/queryClient";
import { Strings } from "src/resources";
import { updateEventStatus } from "src/services/EventManagementService";
import { checkUserPermission } from "src/utils/users";
import { PERMISSION, PERMISSION_VALUE } from "src/constants/permissionEnum";


const EventManagement = () => {
  const [trashModal, setTrashModal] = useState({
    id: "",
    open: false,
  });
  const [blocksLabels, setBlocksLables] = useState([
    {
      name: Strings.event_label,
      sort: true,
      sortName: "eventTitle",
      sortOrder: true,
    },
    {
      name: Strings.region,
      sort: true,
      sortName: "",
      sortOrder: false,
    },
    {
      name: Strings.day,
      sort: true,
      sortName: "eventDay",
      sortOrder: false,
    },
    {
      name: Strings.duration,
      sort: true,
      sortName: "eventDuration",
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
  ]);
  const [eventFilter, setEventFilter] = useState({
    limit: 10,
    search: "",
    page: 1,
    filterPage: 1,
    sort: "eventTitle",
    sortOrder: "asc",
  });
  const { data: eventData, isFetching } = useQuery({
    queryKey: ["getEvent", eventFilter],
    queryFn: () => getEvents(eventFilter),
    select: (data) => data?.data,
    // onSuccess: (data) => {
    //   setPaginationData(data);
    // },
  });

  const handleSearch = (search: string) => {
    setEventFilter({
      limit: 10,
      search: search,
      page: 1,
      filterPage: 1,
      sort: "eventTitle",
      sortOrder: "asc",
    });
  };
  const handleSorting = (sortName: string, sortOrder: boolean) => {
    if (sortOrder != undefined && sortName != undefined) {
      const updatedBlocksLabels = blocksLabels.map((label) => {
        if (label.sortName === sortName) {
          return { ...label, sortOrder: sortOrder };
        }
        return label;
      });
      setBlocksLables(updatedBlocksLabels);
      setEventFilter((prevState) => ({
        ...prevState,
        sort: sortName,
        sortOrder: sortOrder ? "asc" : "desc",
      }));
    }
  };
  const handleChangeSelect = async (value: any, blockId: string) => {
    const block: AsyncResponseType = await updateEventStatus(
      value?.value,
      blockId
    );
    if (block?.success) {
      toast.success(block?.message);
      queryClient.invalidateQueries(["getEvent"]);
      // fetchBlocks();
    } else {
      toast.error(block?.message);
    }
  };
  function onDelete(id: string) {
    setTrashModal({ id, open: true });
  }
  function handleCloseTrashModal() {
    setTrashModal({ id: "", open: false });
  }
  const deleteEventMutation = useMutation(deleteEvent, {
    onSuccess: (data) => {
      toast.success(data?.message);
      handleCloseTrashModal();
      setEventFilter({
        limit: 10,
        search: "",
        page: 1,
        filterPage: 1,
        sort: "eventTitle",
        sortOrder: "asc",
      })
      queryClient.invalidateQueries(["getEvent"]);
    },
  });
  function handleDeleteModalConfirm(id: string) {
    deleteEventMutation.mutate(id);
  }
  const handlePagination = (page: string) => {
    if (eventData?.page) {
      if (page === "next") {
        setEventFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: eventData?.page,
          filterPage: eventFilter?.filterPage + 1,
        }));
      } else if (page === "prev") {
        setEventFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: eventData?.page,
          filterPage: eventFilter?.filterPage - 1,
        }));
      } else if (page === "first") {
        setEventFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: 1,
          filterPage: 1,
        }));
      }
    } else {
      if (page === "prev" && eventData?.prevEndBeforeDocId != null) {
        setEventFilter((prevState) => ({
          ...prevState,
          prevEndBeforeDocId: eventData?.prevEndBeforeDocId,
          nextStartAfterDocId: "",
          page: Number(eventFilter?.page) - 1,
        }));
      } else if (page === "next" && eventData?.nextStartAfterDocId != null) {
        setEventFilter((prevState) => ({
          ...prevState,
          nextStartAfterDocId: eventData?.nextStartAfterDocId,
          prevEndBeforeDocId: "",
          page: Number(eventFilter?.page) + 1,
        }));
      } else if (page === "first") {
        setEventFilter({
          limit: 10,
          search: "",
          page: 1,
          filterPage: 0,
          sort: "blockName",
          sortOrder: "asc",
        });
      }
    }
  };
  const handlePageSizeChange = (newPageSize: any) => {
    setEventFilter({
      limit: newPageSize,
      search: "",
      page: 1,
      filterPage: 1,
      sort: "eventTitle",
      sortOrder: "asc",
    });
  };
  return (
    <>
      <section className="event pt-2">
        <TableHeader
          title={Strings.event_management}
          searchBox
          searchBoxPlaceholder={Strings.search}
          handleSearch={handleSearch}
          // addBtn={Strings.event_add}
          // addBtnPath={allRoutes.eventAdd}
          addBtn={checkUserPermission(PERMISSION.event, PERMISSION_VALUE.create) ? Strings.event_add : ""}
          addBtnPath={
            checkUserPermission(PERMISSION.event, PERMISSION_VALUE.create) ? allRoutes.eventAdd : ""
          }
          showPagination
          pageLength={eventFilter?.limit.toString()}
          onPageSizeChange={handlePageSizeChange}
        />
        <ThemeTable
          labels={blocksLabels}
          isLoading={isFetching}
          length={eventData?.events?.length}
          handleSorting={handleSorting}
        >
          {eventData?.events?.map((el: eventType) => {
            const {
              id,
              eventTitle,
              region,
              eventDay,
              eventDuration,
              isActive,
            } = el;
            return (
              <tr key={id}>
                <td>{eventTitle}</td>
                <td>{region}</td>
                <td>{eventDay}</td>
                <td>{eventDuration + ' ' + Strings.hrs}</td>
                <td>
                  <StatusSelect
                    // selectOptions={selectOptions}
                    onselectionchange={(e) => handleChangeSelect(e, id)}
                    defaultValue={isActive}
                    className="mx-auto"
                    isDisabled={!checkUserPermission(PERMISSION.event, PERMISSION_VALUE.activeInactive)}
                  />
                </td>
                <td>
                  <div className="actions">
                    {checkUserPermission(PERMISSION.event, PERMISSION_VALUE.read) && (
                      <Link
                        to={`${allRoutes.eventDetails}?eventId=${id}`}
                        className="table-icon">
                        <SvgEyeFill size="24" />
                      </Link>
                    )}
                    {checkUserPermission(PERMISSION.event, PERMISSION_VALUE.update) && (
                      <Link
                        to={`${allRoutes.eventEdit}?eventId=${id}`}
                        className="table-icon"
                      >
                        <SvgPenToEdit size="24" />
                      </Link>
                    )}
                    {checkUserPermission(PERMISSION.event, PERMISSION_VALUE.delete) && (

                      <button
                        className="table-icon"
                        onClick={() => {
                          onDelete(id);
                        }}
                      >
                        <SvgTrash size="24" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </ThemeTable>
        <CustomPagination
          className="justify-content-end"
          handlePagination={handlePagination}
          disabledFirst={
            eventFilter?.filterPage == 1 && eventData?.page
              ? true
              : eventData?.prevEndBeforeDocId || eventData?.page > 0
                ? false
                : true
          }
          disabledPrev={
            eventFilter?.filterPage == 1 && eventData?.page
              ? true
              : eventData?.prevEndBeforeDocId || eventData?.page > 0
                ? false
                : true
          }
          disabledNext={
            eventData?.page == eventFilter?.filterPage
              ? true
              : eventData?.nextStartAfterDocId || eventData?.page > 0
                ? false
                : true
          }
        />
      </section>

      <TrashModal
        title={Strings.event}
        body={Strings.event_delete}
        trashModal={trashModal?.open}
        handleCLoseTrashModal={handleCloseTrashModal}
        handleDeleteData={() => handleDeleteModalConfirm(trashModal?.id)}
        disabled={deleteEventMutation?.isLoading}
      />
    </>
  );
};

export default EventManagement;
