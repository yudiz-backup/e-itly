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
import { getTermsCondition } from "src/Query/TermsCondition/termsCondition.query";
import { deleteTermsCondition, updateTermsConditionStatus } from "src/Query/TermsCondition/termsCondition.mutation";

import { SvgEyeFill, SvgPenToEdit, SvgTrash } from "src/assets/images";
import { checkUserPermission } from "src/utils/users";
import { allRoutes } from "src/constants/AllRoutes";
import { truncateAndRemoveImages } from "src/utils";
import queryClient from "src/queryClient";
import { Strings } from "src/resources";
import { PERMISSION, PERMISSION_VALUE } from "src/constants/permissionEnum";


const TermsConditionsManagement = () => {
  const [blocksLabels, setBlocksLabels] = useState([
    {
      name: Strings.terms_conditions_name,
      sort: true,
      sortName: "title",
      sortOrder: true,
    },
    {
      name: "Description",
      sort: true,
      sortName: "description",
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

  const [termsConditionFilter, setTermsConditionFilter] = useState({
    limit: 10,
    search: "",
    page: 1,
    filterPage: 1,
    sort: "title",
    sortOrder: "asc",
  });

  // get TermsCondition
  const { data, isFetching } = useQuery({
    queryKey: ["getTermsCondition", termsConditionFilter],
    queryFn: () => getTermsCondition(termsConditionFilter),
    select: (data) => data?.data,
  });

  // Delete TermsCondition
  const deleteTermsConditionMutation = useMutation(deleteTermsCondition, {
    onSuccess: (data) => {
      toast.success(data?.message);
      handleCloseTrashModal();
      setTermsConditionFilter({
        limit: 10,
        search: "",
        page: 1,
        filterPage: 1,
        sort: "title",
        sortOrder: "asc",
      })
      queryClient.invalidateQueries(["getTermsCondition"]);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
      handleCloseTrashModal();
    },
  });

  function handleDeleteModalConfirm(id: string) {
    deleteTermsConditionMutation.mutate(id);
  }

  function onDelete(id: string) {
    setTrashModal({ id, open: true });
  }

  function handleCloseTrashModal() {
    setTrashModal({ id: "", open: false });
  }

  const handleSearch = (search: string) => {
    setTermsConditionFilter({
      limit: 10,
      search: search,
      page: 1,
      filterPage: 1,
      sort: "title",
      sortOrder: "asc",
    });
  };

  const handlePagination = (page: string) => {
    if (data?.page) {
      if (page === "next") {
        setTermsConditionFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: data?.page,
          filterPage: termsConditionFilter?.filterPage + 1,
        }));
      } else if (page === "prev") {
        setTermsConditionFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: data?.page,
          filterPage: termsConditionFilter?.filterPage - 1,
        }));
      } else if (page === "first") {
        setTermsConditionFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: 1,
          filterPage: 1,
        }));
      }
    } else {
      if (page === "prev" && data?.prevEndBeforeDocId != null) {
        setTermsConditionFilter((prevState) => ({
          ...prevState,
          prevEndBeforeDocId: data?.prevEndBeforeDocId,
          nextStartAfterDocId: "",
          page: Number(termsConditionFilter?.page) - 1,
        }));
      } else if (page === "next" && data?.nextStartAfterDocId != null) {
        setTermsConditionFilter((prevState) => ({
          ...prevState,
          nextStartAfterDocId: data?.nextStartAfterDocId,
          prevEndBeforeDocId: "",
          page: Number(termsConditionFilter?.page) + 1,
        }));
      } else if (page === "first") {
        setTermsConditionFilter({
          limit: 10,
          search: "",
          page: 1,
          filterPage: 0,
          sort: "title",
          sortOrder: "asc",
        });
      }
    }
  };

  const handlePageSizeChange = (newPageSize: any) => {
    setTermsConditionFilter({
      limit: newPageSize,
      search: "",
      page: 1,
      filterPage: 1,
      sort: "title",
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
      setTermsConditionFilter(() => ({
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
    // isActive: value?.value,
    // blockId
    // })
    const block: AsyncResponseType = await updateTermsConditionStatus({
      isActive: value?.value,
      blockId,
    });
    if (block?.success) {
      toast.success(block?.message);
      queryClient.invalidateQueries(["getTermsCondition"]);
    } else {
      toast.error(block?.message);
    }
  };
  return (
    <>
      <section>
        <TableHeader
          title={Strings.terms_conditions_management}
          searchBox
          searchBoxPlaceholder={Strings.search}
          handleSearch={handleSearch}
          // addBtn={Strings.terms_conditions_add}
          // addBtnPath={allRoutes.termsConditionsAdd}
          addBtn={checkUserPermission(PERMISSION.termsCondition, PERMISSION_VALUE.create) ? Strings.terms_conditions_add : ""}
          addBtnPath={
            checkUserPermission(PERMISSION.termsCondition, PERMISSION_VALUE.create) ? allRoutes.termsConditionsAdd : ""
          }
          showPagination
          onPageSizeChange={handlePageSizeChange}
          pageLength={termsConditionFilter?.limit.toString()}
        />
        <ThemeTable
          labels={blocksLabels}
          isLoading={isFetching}
          length={data?.terms?.length}
          handleSorting={handleSorting}
        >
          {data?.terms?.map((item: TermsConditionType, index: number) => {
            const { id, title, description, isActive } = item;
            return (
              <tr key={index}>
                <td>{title}</td>
                <td>
                  <div dangerouslySetInnerHTML={{ __html: truncateAndRemoveImages(description, 30) }} />
                </td>
                <td>
                  <StatusSelect
                    // selectOptions={selectOptions}
                    onselectionchange={(e) => handleChangeSelect(e, id)}
                    defaultValue={isActive}
                    className='mx-auto'
                    isDisabled={!checkUserPermission(PERMISSION.termsCondition, PERMISSION_VALUE.activeInactive)}
                  />
                </td>
                <td>
                  <div className="actions">
                    {checkUserPermission(PERMISSION.termsCondition, PERMISSION_VALUE.read) && (
                      <Link
                        to={`${allRoutes.termsConditionsView}?termsConditionId=${id}`}
                        className="table-icon"
                      >
                        <SvgEyeFill size="24" />
                      </Link>
                    )}
                    {checkUserPermission(PERMISSION.termsCondition, PERMISSION_VALUE.update) && (
                      <Link
                        to={`${allRoutes.termsConditionsUpdate}?termsConditionId=${id}`}
                        className="table-icon"
                      >
                        <SvgPenToEdit size="24" />
                      </Link>
                    )}
                    {checkUserPermission(PERMISSION.termsCondition, PERMISSION_VALUE.delete) && (
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
          className="justify-content-end"
          handlePagination={handlePagination}
          disabledFirst={
            termsConditionFilter?.filterPage == 1 && data?.page
              ? true
              : data?.prevEndBeforeDocId || data?.page > 0
                ? false
                : true
          }
          disabledPrev={
            termsConditionFilter?.filterPage == 1 && data?.page
              ? true
              : data?.prevEndBeforeDocId || data?.page > 0
                ? false
                : true
          }
          disabledNext={
            data?.page == termsConditionFilter?.filterPage
              ? true
              : data?.nextStartAfterDocId || data?.page > 0
                ? false
                : true
          }
        />

      </section>
      <TrashModal
        title={Strings.terms_conditions_name}
        body={Strings.terms_conditions_delete}
        trashModal={trashModal?.open}
        handleCLoseTrashModal={handleCloseTrashModal}
        handleDeleteData={() => handleDeleteModalConfirm(trashModal?.id)}
        disabled={deleteTermsConditionMutation?.isLoading}
      />
    </>
  );
};
export default TermsConditionsManagement;

