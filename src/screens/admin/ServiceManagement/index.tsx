import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Badge } from "react-bootstrap";
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
  deleteServices,
  updateServiceStatus,
} from "src/Query/Service/service.mutation";
import { getServices } from "src/Query/Service/service.query";
import queryClient from "src/queryClient";

import { SvgEyeFill, SvgPenToEdit, SvgTrash } from "src/assets/images";
import { allRoutes } from "src/constants/AllRoutes";
import "./services.scss";
import { Strings } from "src/resources";
import { checkUserPermission } from "src/utils/users";
import { PERMISSION, PERMISSION_VALUE } from "src/constants/permissionEnum";

const ServiceManagement = () => {
  const [blocksLabels, setBlocksLabels] = useState([
    {
      name: Strings.service_label,
      sort: true,
      sortName: "serviceName",
      sortOrder: true,
    },
    {
      name: Strings.service_type_label,
      sort: true,
      sortName: "serviceType",
      sortOrder: true,
    },
    {
      name: Strings.supplier_label,
      sort: true,
      sortName: "supplierName",
      sortOrder: true,
    },
    {
      name: Strings.region,
      sort: true,
      sortName: "region",
      sortOrder: true,
    },
    {
      name: Strings.internal_cost_label,
      sort: true,
      sortName: "internalCost",
      sortOrder: true,
    },
    {
      name: Strings.external_cost_label,
      sort: true,
      sortName: "externalCost",
      sortOrder: true,
    },
    {
      name: Strings.price_per_person_label,
      sort: true,
      sortName: "pricePerPerson",
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

  const [serviceFilter, setServiceFilter] = useState({
    limit: 10,
    search: "",
    page: 1,
    filterPage: 1,
    sort: "serviceName",
    sortOrder: "asc",
  });

  // get Service
  const { data, isFetching } = useQuery({
    queryKey: ["getService", serviceFilter],
    queryFn: () => getServices(serviceFilter),
    select: (data) => data?.data,
  });

  // Delete Service
  const deleteServiceMutation = useMutation(deleteServices, {
    onSuccess: (data) => {
      toast.success(data?.message);
      handleCloseTrashModal();
      setServiceFilter({
        limit: 10,
        search: "",
        page: 1,
        filterPage: 1,
        sort: "serviceName",
        sortOrder: "asc",
      })
      queryClient.invalidateQueries(["getService"]);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
      handleCloseTrashModal();
    },
  });

  function handleDeleteModalConfirm(id: string) {
    deleteServiceMutation.mutate(id);
  }

  function onDelete(id: string) {
    setTrashModal({ id, open: true });
  }

  function handleCloseTrashModal() {
    setTrashModal({ id: "", open: false });
  }

  const handleSearch = (search: string) => {
    setServiceFilter({
      limit: 10,
      search: search,
      page: 1,
      filterPage: 1,
      sort: "serviceName",
      sortOrder: "asc",
    });
  };

  const handlePagination = (page: string) => {
    if (data?.page) {
      if (page === "next") {
        setServiceFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: data?.page,
          filterPage: serviceFilter?.filterPage + 1,
        }));
      } else if (page === "prev") {
        setServiceFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: data?.page,
          filterPage: serviceFilter?.filterPage - 1,
        }));
      } else if (page === "first") {
        setServiceFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: 1,
          filterPage: 1,
        }));
      }
    } else {
      if (page === "prev" && data?.prevEndBeforeDocId != null) {
        setServiceFilter((prevState) => ({
          ...prevState,
          prevEndBeforeDocId: data?.prevEndBeforeDocId,
          nextStartAfterDocId: "",
          page: Number(serviceFilter?.page) - 1,
        }));
      } else if (page === "next" && data?.nextStartAfterDocId != null) {
        setServiceFilter((prevState) => ({
          ...prevState,
          nextStartAfterDocId: data?.nextStartAfterDocId,
          prevEndBeforeDocId: "",
          page: Number(serviceFilter?.page) + 1,
        }));
      } else if (page === "first") {
        setServiceFilter({
          limit: 10,
          search: "",
          page: 1,
          filterPage: 0,
          sort: "serviceName",
          sortOrder: "asc",
        });
      }
    }
  };

  const handlePageSizeChange = (newPageSize: any) => {
    setServiceFilter({
      limit: newPageSize,
      search: "",
      page: 1,
      filterPage: 1,
      sort: "serviceName",
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
      setServiceFilter((prevState) => ({
        ...prevState,
        sort: sortName,
        sortOrder: sortOrder ? "asc" : "desc",
      }));
    }
  };

  const handleChangeSelect = async (value: any, blockId: string) => {
    // updateStatusMutation.mutate({
    // isActive: value?.value,
    // blockId
    // })
    const block: AsyncResponseType = await updateServiceStatus({
      isActive: value?.value,
      blockId,
    });
    if (block?.success) {
      toast.success(block?.message);
      queryClient.invalidateQueries(["getService"]);
    } else {
      toast.error(block?.message);
    }
  };

  return (
    <>
      <section className="services">
        <TableHeader
          title={Strings.service_management}
          searchBox
          searchBoxPlaceholder={Strings.search}
          handleSearch={handleSearch}
          // addBtn={Strings.service_add}
          // addBtnPath={allRoutes.servicesAdd}
          addBtn={checkUserPermission(PERMISSION.services, PERMISSION_VALUE.create) ? Strings.service_add : ""}
          addBtnPath={
            checkUserPermission(PERMISSION.services, PERMISSION_VALUE.create) ? allRoutes.servicesAdd : ""
          }
          showPagination
          pageLength={serviceFilter?.limit.toString()}
          onPageSizeChange={handlePageSizeChange}
        />
        <ThemeTable
          labels={blocksLabels}
          isLoading={isFetching}
          length={data?.services?.length}
          handleSorting={handleSorting}
        >
          {data?.services?.map((item: ServicesType, index: number) => {
            const {
              id,
              serviceName,
              serviceType,
              internalCost,
              externalCost,
              pricePerPerson,
              isActive,
              supplierName,
              region,
            } = item;
            return (
              <tr key={index}>
                <td>{serviceName}</td>
                <td>{serviceType}</td>
                <td>{supplierName}</td>
                <td>{region}</td>
                <td>{Strings.euro + internalCost}</td>
                <td>{Strings.euro + externalCost}</td>
                <td>
                  <Badge bg={pricePerPerson ? "success" : "danger"}>
                    {pricePerPerson ? "Yes" : "No"}
                  </Badge>
                </td>
                <td>
                  {/* <Badge bg={isActive ? "success" : "danger"}>
                    {isActive ? "Active" : "Inactive"}
                  </Badge> */}
                  <StatusSelect
                    onselectionchange={(e) => handleChangeSelect(e, id)}
                    defaultValue={isActive}
                    isDisabled={!checkUserPermission(PERMISSION.services, PERMISSION_VALUE.activeInactive)}
                  />
                </td>
                <td>
                  <div className="actions">
                    {checkUserPermission(PERMISSION.services, PERMISSION_VALUE.read) && (
                      <Link
                        to={`${allRoutes.serviceDetails}?serviceId=${id}`}
                        className="table-icon"
                      >
                        <SvgEyeFill size="24" />
                      </Link>
                    )}
                    {checkUserPermission(PERMISSION.services, PERMISSION_VALUE.update) && (
                      <Link
                        to={`${allRoutes.servicesUpdate}?serviceId=${id}`}
                        className="table-icon"
                      >
                        <SvgPenToEdit size="24" />
                      </Link>
                    )}
                    {checkUserPermission(PERMISSION.services, PERMISSION_VALUE.delete) && (
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
            serviceFilter?.filterPage == 1 && data?.page
              ? true
              : data?.prevEndBeforeDocId || data?.page > 0
                ? false
                : true
          }
          disabledPrev={
            serviceFilter?.filterPage == 1 && data?.page
              ? true
              : data?.prevEndBeforeDocId || data?.page > 0
                ? false
                : true
          }
          disabledNext={
            data?.page == serviceFilter?.filterPage
              ? true
              : data?.nextStartAfterDocId || data?.page > 0
                ? false
                : true
          }
        />
      </section>

      <TrashModal
        title={Strings.service}
        body={Strings.service_delete}
        trashModal={trashModal?.open}
        handleCLoseTrashModal={handleCloseTrashModal}
        handleDeleteData={() => handleDeleteModalConfirm(trashModal?.id)}
        disabled={deleteServiceMutation?.isLoading}
      />
    </>
  );
};

export default ServiceManagement;
