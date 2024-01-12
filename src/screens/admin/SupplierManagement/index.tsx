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
  deleteSupplier,
  updateSupplierStatus,
} from "src/Query/Supplier/supplier.mutation";
import { getSupplier } from "src/Query/Supplier/supplier.query";
import queryClient from "src/queryClient";

import { SvgPenToEdit, SvgTrash } from "src/assets/images";
import { allRoutes } from "src/constants/AllRoutes";
import "./supplier-management.scss";
import { Strings } from "src/resources";
import { checkUserPermission } from "src/utils/users";
import { PERMISSION, PERMISSION_VALUE } from "src/constants/permissionEnum";

const SupplierManagement = () => {
  const [blocksLabels, setBlocksLabels] = useState([
    {
      name: Strings.supplier_label,
      sort: true,
      sortName: "supplierName",
      sortOrder: true,
    },
    {
      name: Strings.email,
      sort: true,
      sortName: "email",
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

  const [supplierFilter, setSupplierFilter] = useState({
    limit: 10,
    search: "",
    page: 1,
    filterPage: 1,
    sort: "supplierName",
    sortOrder: "asc",
  });

  // get supplier List
  const { data, isFetching } = useQuery({
    queryKey: ["getSupplier", supplierFilter],
    queryFn: () => getSupplier(supplierFilter),
    select: (data) => data?.data,
  });

  // delete supplier
  const deleteSupplierMutation = useMutation(deleteSupplier, {
    onSuccess: (data) => {
      toast.success(data?.message);
      handleCloseTrashModal();
      setSupplierFilter({
        limit: 10,
        search: "",
        page: 1,
        filterPage: 1,
        sort: "supplierName",
        sortOrder: "asc",
      })
      queryClient.invalidateQueries(["getSupplier"]);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
      handleCloseTrashModal();
    },
  });

  // update status
  // const updateStatusMutation = useMutation(updateSupplierStatus, {
  //   onSuccess: (data) => {
  //     toast.success(data?.message);
  //   },
  // })

  const handleChangeSelect = async (value: any, blockId: string) => {
    // updateStatusMutation.mutate({
    // isActive: value?.value,
    // blockId
    // })
    const block: AsyncResponseType = await updateSupplierStatus({
      isActive: value?.value,
      blockId,
    });
    if (block?.success) {
      toast.success(block?.message);
      setTimeout(() => {
        queryClient.invalidateQueries(["getSupplier"]);
      }, 1000)
    } else {
      toast.error(block?.message);
    }
  };

  function handleDeleteModalConfirm(id: string) {
    deleteSupplierMutation.mutate(id);
  }

  function onDelete(id: string) {
    setTrashModal({ id, open: true });
  }

  function handleCloseTrashModal() {
    setTrashModal({ id: "", open: false });
  }

  const handleSearch = (search: string) => {
    setSupplierFilter({
      limit: 10,
      search: search,
      page: 1,
      filterPage: 1,
      sort: "supplierName",
      sortOrder: "asc",
    });
  };

  const handlePagination = (page: string) => {
    if (data?.page) {
      if (page === "next") {
        setSupplierFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: data?.page,
          filterPage: supplierFilter?.filterPage + 1,
        }));
      } else if (page === "prev") {
        setSupplierFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: data?.page,
          filterPage: supplierFilter?.filterPage - 1,
        }));
      } else if (page === "first") {
        setSupplierFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: 1,
          filterPage: 1,
        }));
      }
    } else {
      if (page === "prev" && data?.prevEndBeforeDocId != null) {
        setSupplierFilter((prevState) => ({
          ...prevState,
          prevEndBeforeDocId: data?.prevEndBeforeDocId,
          nextStartAfterDocId: "",
          page: Number(supplierFilter?.page) - 1,
        }));
      } else if (page === "next" && data?.nextStartAfterDocId != null) {
        setSupplierFilter((prevState) => ({
          ...prevState,
          nextStartAfterDocId: data?.nextStartAfterDocId,
          prevEndBeforeDocId: "",
          page: Number(supplierFilter?.page) + 1,
        }));
      } else if (page === "first") {
        setSupplierFilter({
          limit: 10,
          search: "",
          page: 1,
          filterPage: 0,
          sort: "supplierName",
          sortOrder: "asc",
        });
      }
    }
  };

  const handlePageSizeChange = (newPageSize: any) => {
    setSupplierFilter(() => ({
      limit: newPageSize,
      search: "",
      page: 1,
      filterPage: 1,
      sort: "supplierName",
      sortOrder: "asc",
    }));
  };

  const handleSorting = (sortName: string, sortOrder: boolean) => {
    if (sortOrder != undefined && sortName != undefined) {
      const updatedBlocksLabels = blocksLabels.map((label) => {
        if (label.sortName === sortName) {
          return { ...label, sortOrder: sortOrder };
        }
        return label;
      });
      setBlocksLabels(updatedBlocksLabels);
      setSupplierFilter((prevState) => ({
        ...prevState,
        sort: sortName,
        sortOrder: sortOrder ? "asc" : "desc",
      }));
    }
  };

  return (
    <>
      <section className="supplier-management">
        <TableHeader
          title={Strings.supplier_management}
          searchBox
          searchBoxPlaceholder={Strings.search}
          handleSearch={handleSearch}
          // addBtn={Strings.supplier_add}
          // addBtnPath={allRoutes.supplierAdd}
          addBtn={checkUserPermission(PERMISSION.supplier, PERMISSION_VALUE.create) ? Strings.supplier_add : ""}
          addBtnPath={
            checkUserPermission(PERMISSION.supplier, PERMISSION_VALUE.create) ? allRoutes.supplierAdd : ""
          }
          showPagination
          pageLength={supplierFilter?.limit.toString()}
          onPageSizeChange={handlePageSizeChange}
        />
        <ThemeTable
          labels={blocksLabels}
          isLoading={isFetching}
          length={data?.suppliers?.length}
          handleSorting={handleSorting}
        >
          {data?.suppliers?.map((item: SupplierType, index: number) => {
            const { id, supplierName, email, isActive } = item;
            return (
              <tr key={index}>
                <td>{supplierName}</td>
                <td>{email}</td>
                <td>
                  {/* <Badge bg={isActive ? "success" : "danger"}>
                    {isActive ? "Active" : "Inactive"}
                  </Badge> */}
                  <StatusSelect
                    onselectionchange={(e) => handleChangeSelect(e, id)}
                    defaultValue={isActive}
                    className='mx-auto'
                    isDisabled={!checkUserPermission(PERMISSION.supplier, PERMISSION_VALUE.activeInactive)}
                  />
                </td>
                <td>
                  <div className="actions">
                    {checkUserPermission(PERMISSION.supplier, PERMISSION_VALUE.update) && (
                      <Link
                        to={`${allRoutes.supplierUpdate}?supplierId=${id}`}
                        className="table-icon"
                      >
                        <SvgPenToEdit size="24" />
                      </Link>
                    )}
                    {checkUserPermission(PERMISSION.supplier, PERMISSION_VALUE.delete) && (
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
            supplierFilter?.filterPage == 1 && data?.page
              ? true
              : data?.prevEndBeforeDocId || data?.page > 0
                ? false
                : true
          }
          disabledPrev={
            supplierFilter?.filterPage == 1 && data?.page
              ? true
              : data?.prevEndBeforeDocId || data?.page > 0
                ? false
                : true
          }
          disabledNext={
            data?.page == supplierFilter?.filterPage
              ? true
              : data?.nextStartAfterDocId || data?.page > 0
                ? false
                : true
          }
        />
      </section>

      <TrashModal
        title={Strings.supplier}
        body={Strings.supplier_delete}
        trashModal={trashModal?.open}
        handleCLoseTrashModal={handleCloseTrashModal}
        handleDeleteData={() => handleDeleteModalConfirm(trashModal?.id)}
        disabled={deleteSupplierMutation?.isLoading}
      />
    </>
  );
};

export default SupplierManagement;
