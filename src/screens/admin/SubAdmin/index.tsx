import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// component
import CustomPagination from "src/components/CustomPagination";
import TrashModal from "src/components/Modal/TrashModal";
import StatusSelect from "src/components/StatusSelect";
import TableHeader from "src/components/TableHeader";
import { allRoutes } from "src/constants/AllRoutes";
import ThemeTable from "src/components/ThemeTable";

// query
import { deleteSubAdmin, updateSubAdminStatus, } from "src/Query/SubAdmin/subAdmin.mutation";
import { getSubAdmin } from "src/Query/SubAdmin/subAdmin.query";
import queryClient from "src/queryClient";

import { SvgEyeFill, SvgPenToEdit, SvgTrash } from "src/assets/images";
import { checkUserPermission } from "src/utils/users";
import { Strings } from "src/resources";
import { PERMISSION, PERMISSION_VALUE } from "src/constants/permissionEnum";


const SubAdmin = () => {
  const [blocksLabels, setBlocksLabels] = useState([
    {
      name: Strings.sub_admin_name,
      sort: true,
      sortName: "name",
      sortOrder: true,
    },
    {
      name: Strings.email,
      sort: false,
      sortName: "emailId",
      sortOrder: false,
    },
    {
      name: Strings.user_type,
      sort: false,
      sortName: "userType",
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

  const [trashModal, setTrashModal] = useState({
    id: "",
    open: false,
  });

  const [subAdminFilter, setSubAdminFilter] = useState({
    limit: 10,
    search: "",
    page: 1,
    filterPage: 1,
    sort: "name",
    sortOrder: "asc",
  });

  // get SubAdmin
  const { data, isFetching } = useQuery({
    queryKey: ["getSubAdmin", subAdminFilter],
    queryFn: () => getSubAdmin(subAdminFilter),
    select: (data) => data?.data,
  });

  // Delete SubAdmin
  const deleteSubAdminMutation = useMutation(deleteSubAdmin, {
    onSuccess: (data) => {
      toast.success(data?.message);
      handleCloseTrashModal();
      setSubAdminFilter({
        limit: 10,
        search: "",
        page: 1,
        filterPage: 1,
        sort: "name",
        sortOrder: "asc",
      });
      queryClient.invalidateQueries(["getSubAdmin"]);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
      handleCloseTrashModal();
    },
  });

  function handleDeleteModalConfirm(id: string) {
    deleteSubAdminMutation.mutate(id);
  }

  function onDelete(id: string) {
    setTrashModal({ id, open: true });
  }

  function handleCloseTrashModal() {
    setTrashModal({ id: "", open: false });
  }

  const handleSearch = (search: string) => {
    setSubAdminFilter({
      limit: 10,
      search: search,
      page: 1,
      filterPage: 1,
      sort: "name",
      sortOrder: "asc",
    });
  };

  const handlePagination = (page: string) => {
    if (data?.page) {
      if (page === "next") {
        setSubAdminFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: data?.page,
          filterPage: subAdminFilter?.filterPage + 1,
        }));
      } else if (page === "prev") {
        setSubAdminFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: data?.page,
          filterPage: subAdminFilter?.filterPage - 1,
        }));
      } else if (page === "first") {
        setSubAdminFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: 1,
          filterPage: 1,
        }));
      }
    } else {
      if (page === "prev" && data?.prevEndBeforeDocId != null) {
        setSubAdminFilter((prevState) => ({
          ...prevState,
          prevEndBeforeDocId: data?.prevEndBeforeDocId,
          nextStartAfterDocId: "",
          page: Number(subAdminFilter?.page) - 1,
        }));
      } else if (page === "next" && data?.nextStartAfterDocId != null) {
        setSubAdminFilter((prevState) => ({
          ...prevState,
          nextStartAfterDocId: data?.nextStartAfterDocId,
          prevEndBeforeDocId: "",
          page: Number(subAdminFilter?.page) + 1,
        }));
      } else if (page === "first") {
        setSubAdminFilter({
          limit: 10,
          search: "",
          page: 1,
          filterPage: 0,
          sort: "name",
          sortOrder: "asc",
        });
      }
    }
  };

  const handlePageSizeChange = (newPageSize: any) => {
    setSubAdminFilter({
      limit: newPageSize,
      search: "",
      page: 1,
      filterPage: 1,
      sort: "name",
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
      setBlocksLabels(updatedBlocksLabels);
      setSubAdminFilter((prevState) => ({
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
    const block: AsyncResponseType = await updateSubAdminStatus({
      isActive: value?.value,
      blockId,
    });
    if (block?.success) {
      toast.success(block?.message);
      queryClient.invalidateQueries(["getSubAdmin"]);
    } else {
      toast.error(block?.message);
    }
  };
  return (
    <>
      <section className="sub-admin">
        <TableHeader
          title={Strings.sub_admin_title}
          searchBox
          searchBoxPlaceholder={Strings.search}
          handleSearch={handleSearch}
          addBtn={checkUserPermission(PERMISSION.subAdmin, PERMISSION_VALUE.create) ? Strings.sub_admin_add : ""}
          addBtnPath={
            checkUserPermission(PERMISSION.subAdmin, PERMISSION_VALUE.create) ? allRoutes.subAdminAdd : ""
          }
          showPagination
          pageLength={subAdminFilter?.limit.toString()}
          onPageSizeChange={handlePageSizeChange}
        />
        <ThemeTable
          labels={blocksLabels}
          isLoading={isFetching}
          length={data?.admins?.length}
          handleSorting={handleSorting}
        >
          {data?.admins?.map((el: SubAdminListType) => {
            const { id, name, emailId, userType, isActive } = el;

            return (
              <tr key={id}>
                <td>{name}</td>
                <td>{emailId}</td>
                <td>{userType}</td>
                <td>
                  <StatusSelect
                    onselectionchange={(e) => handleChangeSelect(e, id)}
                    defaultValue={isActive}
                    className="mx-auto"
                    isDisabled={!checkUserPermission(PERMISSION.subAdmin, PERMISSION_VALUE.activeInactive)}
                  />
                </td>
                <td>
                  <div className="actions">
                    {checkUserPermission(PERMISSION.subAdmin, PERMISSION_VALUE.read) && (
                      <Link
                        to={`${allRoutes.subAdminView}?adminId=${id}`}
                        className="table-icon"
                      >
                        <SvgEyeFill size="24" />
                      </Link>
                    )}
                    {checkUserPermission(PERMISSION.subAdmin, PERMISSION_VALUE.update) && (
                      <Link
                        to={`${allRoutes.subAdminEdit}?adminId=${id}`}
                        className="table-icon"
                      >
                        <SvgPenToEdit size="24" />
                      </Link>
                    )}
                    {checkUserPermission(PERMISSION.subAdmin, PERMISSION_VALUE.delete) && (
                      <button
                        className="table-icon"
                        onClick={() => onDelete(id)}
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
          handlePagination={handlePagination}
          disabledFirst={
            subAdminFilter?.filterPage == 1 && data?.page
              ? true
              : data?.prevEndBeforeDocId || data?.page > 0
                ? false
                : true
          }
          disabledPrev={
            subAdminFilter?.filterPage == 1 && data?.page
              ? true
              : data?.prevEndBeforeDocId || data?.page > 0
                ? false
                : true
          }
          disabledNext={
            data?.page == subAdminFilter?.filterPage
              ? true
              : data?.nextStartAfterDocId || data?.page > 0
                ? false
                : true
          }
        />
      </section>

      <TrashModal
        title={Strings.sub_admin}
        body={Strings.sub_admin_delete}
        trashModal={trashModal?.open}
        handleCLoseTrashModal={handleCloseTrashModal}
        handleDeleteData={() => handleDeleteModalConfirm(trashModal?.id)}
        disabled={deleteSubAdminMutation?.isLoading}
      />

    </>
  );
};

export default SubAdmin;
