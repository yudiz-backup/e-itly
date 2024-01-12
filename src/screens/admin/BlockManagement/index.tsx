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
import { deleteBlock, updateBlockStatus } from "src/Query/Block/block.mutation";
import { getBlock } from "src/Query/Block/block.query";
import queryClient from "src/queryClient";

import { SvgEyeFill, SvgPenToEdit, SvgTrash, defaultImage } from "src/assets/images";
import { checkUserPermission } from "src/utils/users";
import { allRoutes } from "src/constants/AllRoutes";
import "./block-management.scss";
import { Strings } from "src/resources";
import { truncateAndRemoveImages } from "src/utils";
import { PERMISSION, PERMISSION_VALUE } from "src/constants/permissionEnum";



const BlockManagement = () => {
  const [trashModal, setTrashModal] = useState({
    id: "",
    open: false,
  });
  const [blocksLabels, setBlocksLabels] = useState([
    {
      name: Strings.block_label,
      sort: true,
      sortName: "blockName",
      sortOrder: true,
    },
    {
      name: Strings.img,
      sort: false,
      sortName: "",
      sortOrder: false,
    },
    {
      name: "Description",
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
  ]);
  const [blockManageFilter, setBlockManageFilter] = useState({
    limit: 10,
    search: "",
    page: 1,
    filterPage: 1,
    sort: "blockName",
    sortOrder: "asc",
  });
  // get Blocks
  const { data, isFetching } = useQuery({
    queryKey: ["getBlock", blockManageFilter],
    queryFn: () => getBlock(blockManageFilter),
    select: (data) => data?.data,
  });
  function handleCloseTrashModal() {
    setTrashModal({ id: "", open: false });
  }
  function handleDeleteModalConfirm(id: string) {
    deleteBlockMutation.mutate(id);
  }

  // Delete Block
  const deleteBlockMutation = useMutation(deleteBlock, {
    onSuccess: (data) => {
      toast.success(data?.message);
      handleCloseTrashModal();
      setBlockManageFilter({
        limit: 10,
        search: "",
        page: 1,
        filterPage: 1,
        sort: "blockName",
        sortOrder: "asc",
      })
      queryClient.invalidateQueries(["getBlock"]);
    },
  });

  function onDelete(id: string) {
    setTrashModal({ id, open: true });
  }

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
      setBlockManageFilter((prevState) => ({
        ...prevState,
        sort: sortName,
        sortOrder: sortOrder ? "asc" : "desc",
      }));
    }
  };
  const handleSearch = (search: string) => {
    setBlockManageFilter({
      limit: 10,
      search: search,
      page: 1,
      filterPage: 1,
      sort: "blockName",
      sortOrder: "asc",
    });
  };

  const handlePagination = (page: string) => {
    if (data?.page) {
      if (page === "next") {
        setBlockManageFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: data?.page,
          filterPage: blockManageFilter?.filterPage + 1,
        }));
      } else if (page === "prev") {
        setBlockManageFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: data?.page,
          filterPage: blockManageFilter?.filterPage - 1,
        }));
      } else if (page === "first") {
        setBlockManageFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: 1,
          filterPage: 1,
        }));
      }
    } else {
      if (page === "prev" && data?.prevEndBeforeDocId != null) {
        setBlockManageFilter((prevState) => ({
          ...prevState,
          prevEndBeforeDocId: data?.prevEndBeforeDocId,
          nextStartAfterDocId: "",
          page: Number(blockManageFilter?.page) - 1,
        }));
      } else if (page === "next" && data?.nextStartAfterDocId != null) {
        setBlockManageFilter((prevState) => ({
          ...prevState,
          nextStartAfterDocId: data?.nextStartAfterDocId,
          prevEndBeforeDocId: "",
          page: Number(blockManageFilter?.page) + 1,
        }));
      } else if (page === "first") {
        setBlockManageFilter({
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
    setBlockManageFilter({
      limit: newPageSize,
      search: "",
      page: 1,
      filterPage: 1,
      sort: "blockName",
      sortOrder: "asc",
    });
  };

  const handleChangeSelect = async (value: any, blockId: string) => {
    const block: AsyncResponseType = await updateBlockStatus(
      value?.value,
      blockId
    );
    if (block?.success) {
      toast.success(block?.message);
      queryClient.invalidateQueries(["getBlock"]);
      // fetchBlocks();
    } else {
      toast.error(block?.message);
    }
  };
  return (
    <>
      <section className="block-m">
        <TableHeader
          title={Strings.block_management}
          searchBox
          searchBoxPlaceholder={Strings.search}
          handleSearch={handleSearch}
          addBtn={checkUserPermission(PERMISSION.block, PERMISSION_VALUE.create) ? Strings.block_add : ""}
          addBtnPath={
            checkUserPermission(PERMISSION.block, PERMISSION_VALUE.create) ? allRoutes.blocksAdd : ""
          }
          showPagination
          pageLength={blockManageFilter?.limit.toString()}
          onPageSizeChange={handlePageSizeChange}
        />
        <ThemeTable
          labels={blocksLabels}
          isLoading={isFetching}
          length={data?.blocks?.length}
          handleSorting={handleSorting}
        >
          {data?.blocks?.map((el: BlockType) => {
            const { id, blockName, image, description, isActive } = el;
            return (
              <tr key={id}>
                <td>{blockName}</td>
                <td>
                  <img src={image || defaultImage} alt={blockName} className="user-img" />
                </td>

                <td>
                  <div dangerouslySetInnerHTML={{ __html: truncateAndRemoveImages(description, 30) }} />
                </td>
                <td>
                  <StatusSelect
                    // selectOptions={selectOptions}
                    onselectionchange={(e) => handleChangeSelect(e, id)}
                    defaultValue={isActive}
                    className='mx-auto'
                    isDisabled={!checkUserPermission(PERMISSION.block, PERMISSION_VALUE.activeInactive)}
                  />
                </td>
                <td>
                  <div className="actions">
                    {checkUserPermission(PERMISSION.block, PERMISSION_VALUE.read) && (
                      <Link
                        to={`${allRoutes.blocksDetails}?blockId=${id}`}
                        className="table-icon"
                      >
                        <SvgEyeFill size="24" />
                      </Link>
                    )}
                    {checkUserPermission(PERMISSION.block, PERMISSION_VALUE.update) && (
                      <Link
                        to={`${allRoutes.blocksEdit}?blockId=${id}`}
                        className="table-icon"
                      >
                        <SvgPenToEdit size="24" />
                      </Link>
                    )}
                    {checkUserPermission(PERMISSION.block, PERMISSION_VALUE.delete) && (
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
            blockManageFilter?.filterPage == 1 && data?.page
              ? true
              : data?.prevEndBeforeDocId || data?.page > 0
                ? false
                : true
          }
          disabledPrev={
            blockManageFilter?.filterPage == 1 && data?.page
              ? true
              : data?.prevEndBeforeDocId || data?.page > 0
                ? false
                : true
          }
          disabledNext={
            data?.page == blockManageFilter?.filterPage
              ? true
              : data?.nextStartAfterDocId || data?.page > 0
                ? false
                : true
          }
        />
      </section>

      <TrashModal
        title={Strings.blocks}
        body={Strings.block_delete}
        trashModal={trashModal?.open}
        handleCLoseTrashModal={handleCloseTrashModal}
        handleDeleteData={() => handleDeleteModalConfirm(trashModal?.id)}
        disabled={deleteBlockMutation?.isLoading}
      />
    </>
  );
};
export default BlockManagement;
