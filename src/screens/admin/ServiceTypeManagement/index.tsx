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
import {
  deleteServiceType,
  updateServiceTypeStatus,
} from "src/Query/ServiceTypes/serviceTypes.mutation";
import { getServiceTypes } from "src/Query/ServiceTypes/serviceTypes.query";
import queryClient from "src/queryClient";

import { SvgPenToEdit, SvgTrash } from "src/assets/images";
import { checkUserPermission } from "src/utils/users";
import { allRoutes } from "src/constants/AllRoutes";
import "./service-type.scss";
import { Strings } from "src/resources";
import { PERMISSION, PERMISSION_VALUE } from "src/constants/permissionEnum";

const ServiceTypeManagement = () => {
  const [blocksLabels, setBlocksLabels] = useState([
    {
      name: Strings.service_type_label,
      sort: true,
      sortName: "serviceType",
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

  const [serviceTypeFilter, setServiceTypeFilter] = useState({
    limit: 10,
    search: "",
    page: 1,
    filterPage: 1,
    sort: "serviceType",
    sortOrder: "asc",
  });

  // get ServiceType
  const { data, isFetching } = useQuery({
    queryKey: ["getServiceType", serviceTypeFilter],
    queryFn: () => getServiceTypes(serviceTypeFilter),
    select: (data) => data?.data,
  });

  // Delete ServiceType
  const deleteServiceTypeMutation = useMutation(deleteServiceType, {
    onSuccess: (data) => {
      toast.success(data?.message);
      handleCloseTrashModal();
      setServiceTypeFilter({
        limit: 10,
        search: "",
        page: 1,
        filterPage: 1,
        sort: "serviceType",
        sortOrder: "asc",
      })
      queryClient.invalidateQueries(["getServiceType"]);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
      handleCloseTrashModal();
    },
  });

  function handleDeleteModalConfirm(id: string) {
    deleteServiceTypeMutation.mutate(id);
  }

  function onDelete(id: string) {
    setTrashModal({ id, open: true });
  }

  function handleCloseTrashModal() {
    setTrashModal({ id: "", open: false });
  }

  const handleSearch = (search: string) => {
    setServiceTypeFilter({
      limit: 10,
      search: search,
      page: 1,
      filterPage: 1,
      sort: "serviceType",
      sortOrder: "asc",
    });
  };

  const handlePagination = (page: string) => {
    if (data?.page) {
      if (page === "next") {
        setServiceTypeFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: data?.page,
          filterPage: serviceTypeFilter?.filterPage + 1,
        }));
      } else if (page === "prev") {
        setServiceTypeFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: data?.page,
          filterPage: serviceTypeFilter?.filterPage - 1,
        }));
      } else if (page === "first") {
        setServiceTypeFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: 1,
          filterPage: 1,
        }));
      }
    } else {
      if (page === "prev" && data?.prevEndBeforeDocId != null) {
        setServiceTypeFilter((prevState) => ({
          ...prevState,
          prevEndBeforeDocId: data?.prevEndBeforeDocId,
          nextStartAfterDocId: "",
          page: Number(serviceTypeFilter?.page) - 1,
        }));
      } else if (page === "next" && data?.nextStartAfterDocId != null) {
        setServiceTypeFilter((prevState) => ({
          ...prevState,
          nextStartAfterDocId: data?.nextStartAfterDocId,
          prevEndBeforeDocId: "",
          page: Number(serviceTypeFilter?.page) + 1,
        }));
      } else if (page === "first") {
        setServiceTypeFilter({
          limit: 10,
          search: "",
          page: 1,
          filterPage: 0,
          sort: "serviceType",
          sortOrder: "asc",
        });
      }
    }
  };

  const handlePageSizeChange = (newPageSize: any) => {
    setServiceTypeFilter({
      limit: newPageSize,
      search: "",
      page: 1,
      filterPage: 1,
      sort: "serviceType",
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
      setServiceTypeFilter((prevState) => ({
        ...prevState,
        sort: sortName,
        sortOrder: sortOrder ? "asc" : "desc",
      }));
    }
  };

  const handleChangeSelect = async (value: any, typeId: string) => {
    const block: AsyncResponseType = await updateServiceTypeStatus(
      value?.value,
      typeId
    );
    if (block?.success) {
      toast.success(block?.message);
      queryClient.invalidateQueries(["getServiceType"]);
    } else {
      toast.error(block?.message);
    }
  };
  return (
    <>
      <section className="service-type">
        <TableHeader
          title={Strings.service_type_management}
          searchBox
          searchBoxPlaceholder={Strings.search}
          handleSearch={handleSearch}
          // addBtn={Strings.service_type_add}
          // addBtnPath={allRoutes.serviceTypeAdd}
          addBtn={
            checkUserPermission(PERMISSION.serviceType, PERMISSION_VALUE.create)
              ? Strings.service_type_add
              : ""
          }
          addBtnPath={
            checkUserPermission(PERMISSION.serviceType, PERMISSION_VALUE.create)
              ? allRoutes.serviceTypeAdd
              : ""
          }
          showPagination
          pageLength={serviceTypeFilter?.limit.toString()}
          onPageSizeChange={handlePageSizeChange}
        />
        <ThemeTable
          labels={blocksLabels}
          isLoading={isFetching}
          length={data?.serviceTypes?.length}
          handleSorting={handleSorting}
        >
          {data?.serviceTypes?.map((item: ServiceTypeType, index: number) => {
            const { serviceType, isActive, id } = item;
            return (
              <tr key={index}>
                <td>{serviceType}</td>
                <td>
                  {/* <Badge bg={isActive ? "success" : "danger"}>
                    {isActive ? "Active" : "Inactive"}
                  </Badge> */}
                  <StatusSelect
                    onselectionchange={(e) => handleChangeSelect(e, id)}
                    defaultValue={isActive}
                    className='mx-auto'
                    isDisabled={!checkUserPermission(PERMISSION.serviceType, PERMISSION_VALUE.activeInactive)}
                  />
                </td>
                <td>
                  <div className="actions">
                    {checkUserPermission(PERMISSION.serviceType, PERMISSION_VALUE.update) && (
                      <Link
                        to={`${allRoutes.serviceTypeUpdate}?serviceTypeId=${id}`}
                        className="table-icon"
                      >
                        <SvgPenToEdit size="24" />
                      </Link>
                    )}
                    {checkUserPermission(PERMISSION.serviceType, PERMISSION_VALUE.delete) && (
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
            serviceTypeFilter?.filterPage == 1 && data?.page
              ? true
              : data?.prevEndBeforeDocId || data?.page > 0
                ? false
                : true
          }
          disabledPrev={
            serviceTypeFilter?.filterPage == 1 && data?.page
              ? true
              : data?.prevEndBeforeDocId || data?.page > 0
                ? false
                : true
          }
          disabledNext={
            data?.page == serviceTypeFilter?.filterPage
              ? true
              : data?.nextStartAfterDocId || data?.page > 0
                ? false
                : true
          }
        />
      </section>
      <TrashModal
        title={Strings.service_type_label}
        body={Strings.service_type_delete}
        trashModal={trashModal?.open}
        handleCLoseTrashModal={handleCloseTrashModal}
        handleDeleteData={() => handleDeleteModalConfirm(trashModal?.id)}
        disabled={deleteServiceTypeMutation?.isLoading}
      />
    </>
  );
};

export default ServiceTypeManagement;
