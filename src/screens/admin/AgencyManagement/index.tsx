import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// component
import CustomPagination from "src/components/CustomPagination";
import TrashModal from "src/components/Modal/TrashModal";
import StatusSelect from "src/components/StatusSelect";
import TableHeader from "src/components/TableHeader";
import ThemeTable from "src/components/ThemeTable";

// query
import { deleteAgency, updateAgencyStatus } from "src/Query/Agency/Agency.mutation";
import { getAgency } from "src/Query/Agency/Agency.query";
import queryClient from "src/queryClient";

import { SvgPenToEdit, SvgTrash } from "src/assets/images";
import { PERMISSION, PERMISSION_VALUE } from "src/constants/permissionEnum";
import { checkUserPermission } from "src/utils/users";
import { allRoutes } from "src/constants/AllRoutes";
import { Strings } from "src/resources";



const AgencyManagement = () => {
  const [blocksLabels, setBlocksLabels] = useState([
    {
      name: Strings.agency_label,
      sort: true,
      sortName: "agencyName",
      sortOrder: true,
    },
    {
      name: Strings.agency_location,
      sort: true,
      sortName: "location",
      sortOrder: true,
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

  const [trashModal, setTrashModal] = useState({
    id: "",
    open: false,
  });

  const [agencyFilter, setAgencyFilter] = useState({
    limit: 10,
    search: "",
    page: 1,
    filterPage: 1,
    sort: "agencyName",
    sortOrder: "asc",
  });


  // get agency List
  const { data, isFetching } = useQuery({
    queryKey: ['getAgency', agencyFilter],
    queryFn: () => getAgency(agencyFilter),
    select: (data) => data?.data,
  })

  // delete agency
  const deleteAgencyMutation = useMutation(deleteAgency, {
    onSuccess: (data) => {
      toast.success(data?.message)
      handleCloseTrashModal()
      setAgencyFilter({
        limit: 10,
        search: "",
        page: 1,
        filterPage: 1,
        sort: "agencyName",
        sortOrder: "asc",
      })
      queryClient.invalidateQueries(['getAgency'])
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
      handleCloseTrashModal();
    },
  })


  // update status mutation
  // const updateStatusMutation = useMutation(updateAgencyStatus, {
  //   onSuccess: (data) => {
  //     toast.success(data?.message)      
  //     queryClient.invalidateQueries(['getAgency'])
  //   },
  //   onError: (error: any) => {
  //     toast.error(error?.response?.data?.message);  
  //   },
  // })

  function handleDeleteModalConfirm(id: string) {
    deleteAgencyMutation.mutate(id)
  }

  function onDelete(id: string) {
    setTrashModal({ id, open: true })
  }

  function handleCloseTrashModal() {
    setTrashModal({ id: '', open: false })
  }

  const handleSearch = (search: string) => {
    setAgencyFilter({
      limit: 10,
      search: search,
      page: 1,
      filterPage: 1,
      sort: "agencyName",
      sortOrder: "asc",
    });
  };


  const handlePagination = (page: string) => {
    if (data?.page) {
      if (page === "next") {
        setAgencyFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: data?.page,
          filterPage: agencyFilter?.filterPage + 1,
        }));
      } else if (page === "prev") {
        setAgencyFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: data?.page,
          filterPage: agencyFilter?.filterPage - 1,
        }));
      } else if (page === "first") {
        setAgencyFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: 1,
          filterPage: 1,
        }));
      }
    } else {
      if (page === "prev" && data?.prevEndBeforeDocId != null) {
        setAgencyFilter((prevState) => ({
          ...prevState,
          prevEndBeforeDocId: data?.prevEndBeforeDocId,
          nextStartAfterDocId: "",
          page: Number(agencyFilter?.page) - 1,
        }));
      } else if (page === "next" && data?.nextStartAfterDocId != null) {
        setAgencyFilter((prevState) => ({
          ...prevState,
          nextStartAfterDocId: data?.nextStartAfterDocId,
          prevEndBeforeDocId: "",
          page: Number(agencyFilter?.page) + 1,
        }));
      } else if (page === "first") {
        setAgencyFilter({
          limit: 10,
          search: "",
          page: 1,
          filterPage: 0,
          sort: "agencyName",
          sortOrder: "asc",
        });
      }
    }
  };

  const handlePageSizeChange = (newPageSize: any) => {

    setAgencyFilter({
      limit: newPageSize,
      search: "",
      page: 1,
      filterPage: 1,
      sort: "agencyName",
      sortOrder: "asc",
    });
  };

  const handleSorting = (sortName: string, sortOrder: boolean) => {
    if (sortOrder != undefined && sortName != undefined) {
      const updatedBlocksLabels = blocksLabels.map((label) => {
        if (label.sortName === sortName) {
          // Assuming you want to toggle sortOrder
          return { ...label, sortOrder: sortOrder };
        }
        return label;
      });
      setBlocksLabels(updatedBlocksLabels);
      setAgencyFilter(() => ({
        limit: 10,
        search: "",
        page: 1,
        filterPage: 1,
        sort: sortName,
        sortOrder: sortOrder ? "asc" : "desc",
      }));
    }
  };

  const handleChangeSelect = async (value: any, blockId: string) => {
    // updateStatusMutation.mutate({
    //   isActive: value?.value,
    //   blockId
    // })
    const block: AsyncResponseType = await updateAgencyStatus({
      isActive: value?.value,
      blockId,
    });
    if (block?.success) {
      toast.success(block?.message);
      queryClient.invalidateQueries(['getAgency'])
    } else {
      toast.error(block?.message);
    }
  };

  return (
    <>
      <section className="supplier-management">
        <TableHeader
          title={Strings.agency_management}
          searchBox
          searchBoxPlaceholder={Strings.search}
          handleSearch={handleSearch}
          addBtn={checkUserPermission(PERMISSION.agency, PERMISSION_VALUE.create) ? Strings.agency_add : ""}
          addBtnPath={
            checkUserPermission(PERMISSION.agency, PERMISSION_VALUE.create) ? allRoutes.agencyAdd : ""
          }
          // addBtn={Strings.agency_add}
          // addBtnPath={allRoutes.agencyAdd}
          showPagination
          pageLength={agencyFilter?.limit.toString()}
          onPageSizeChange={handlePageSizeChange}
        />
        <ThemeTable
          labels={blocksLabels}
          isLoading={isFetching}
          length={data?.agencies?.length}
          handleSorting={handleSorting}
        >
          {data?.agencies?.map((item: AgencyType, index: number) => {
            const { id, agencyName, isActive, location } = item;
            return (
              <tr key={index}>
                <td>{agencyName}</td>
                <td>{location}</td>
                <td>
                  <StatusSelect
                    // selectOptions={selectOptions}
                    onselectionchange={(e) => handleChangeSelect(e, id)}
                    defaultValue={isActive}
                    className="mx-auto"
                    isDisabled={!checkUserPermission(PERMISSION.agency, PERMISSION_VALUE.activeInactive)}
                  />
                </td>
                <td>
                  <div className="actions">
                    {checkUserPermission(PERMISSION.agency, PERMISSION_VALUE.update) && (
                      <button className="table-icon">
                        <Link
                          to={`${allRoutes.agencyUpdate}?agencyId=${id}`}
                          className="table-icon"
                        >
                          <SvgPenToEdit size="24" />
                        </Link>
                      </button>
                    )}
                    {checkUserPermission(PERMISSION.agency, PERMISSION_VALUE.delete) && (
                      <button className="table-icon" onClick={() => onDelete(id)}>
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
          handlePagination={handlePagination}
          disabledFirst={
            agencyFilter?.filterPage == 1 && data?.page
              ? true
              : data?.prevEndBeforeDocId || data?.page > 0
                ? false
                : true
          }
          disabledPrev={
            agencyFilter?.filterPage == 1 && data?.page
              ? true
              : data?.prevEndBeforeDocId || data?.page > 0
                ? false
                : true
          }
          disabledNext={
            data?.page == agencyFilter?.filterPage
              ? true
              : data?.nextStartAfterDocId || data?.page > 0
                ? false
                : true
          }
        />
      </section>

      <TrashModal
        title={Strings.agency}
        body={Strings.agency_delete}
        trashModal={trashModal?.open}
        handleCLoseTrashModal={handleCloseTrashModal}
        handleDeleteData={() => handleDeleteModalConfirm(trashModal?.id)}
        disabled={deleteAgencyMutation?.isLoading}
      />
    </>
  );
};

export default AgencyManagement;
