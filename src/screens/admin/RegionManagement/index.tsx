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
import {
  deleteRegion,
  updateRegionStatus,
} from "src/Query/Region/region.mutation";
import { getRegion } from "src/Query/Region/region.query";
import queryClient from "src/queryClient";

import { SvgPenToEdit, SvgTrash } from "src/assets/images";
import "./region.scss";
import { Strings } from "src/resources";
import { checkUserPermission } from "src/utils/users";
import { PERMISSION, PERMISSION_VALUE } from "src/constants/permissionEnum";

function RegionManagement() {

  const [blocksLabels, setBlocksLabels] = useState([
    // {
    //   name: Strings.sr_no,
    //   sort: false,
    //   sortName: "",
    //   sortOrder: false,
    // },
    {
      name: Strings.region_label,
      sort: true,
      sortName: "regionName",
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

  const [regionFilter, setRegionFilter] = useState({
    limit: 10,
    search: "",
    page: 1,
    filterPage: 1,
    sort: "regionName",
    sortOrder: "asc",
  });

  // get Region
  const { data, isFetching } = useQuery({
    queryKey: ["getRegion", regionFilter],
    queryFn: () => getRegion(regionFilter),
    select: (data) => data?.data,
  });

  // Delete Region
  const deleteRegionMutation = useMutation(deleteRegion, {
    onSuccess: (data) => {
      toast.success(data?.message);
      handleCloseTrashModal();
      setRegionFilter({
        limit: 10,
        search: "",
        page: 1,
        filterPage: 1,
        sort: "regionName",
        sortOrder: "asc",
      })
      queryClient.invalidateQueries(["getRegion"]);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
      handleCloseTrashModal();
    },
  });

  function handleDeleteModalConfirm(id: string) {
    deleteRegionMutation.mutate(id);
  }

  function onDelete(id: string) {
    setTrashModal({ id, open: true });
  }

  function handleCloseTrashModal() {
    setTrashModal({ id: "", open: false });
  }

  const handleSearch = (search: string) => {
    setRegionFilter({
      limit: 10,
      search: search,
      page: 1,
      filterPage: 1,
      sort: "regionName",
      sortOrder: "asc",
    });
  };

  const handlePagination = (page: string) => {
    if (data?.page) {
      if (page === "next") {
        setRegionFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: data?.page,
          filterPage: regionFilter?.filterPage + 1,
        }));
      } else if (page === "prev") {
        setRegionFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: data?.page,
          filterPage: regionFilter?.filterPage - 1,
        }));
      } else if (page === "first") {
        setRegionFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: 1,
          filterPage: 1,
        }));
      }
    } else {
      if (page === "prev" && data?.prevEndBeforeDocId != null) {
        setRegionFilter((prevState) => ({
          ...prevState,
          prevEndBeforeDocId: data?.prevEndBeforeDocId,
          nextStartAfterDocId: "",
          page: Number(regionFilter?.page) - 1,
        }));
      } else if (page === "next" && data?.nextStartAfterDocId != null) {
        setRegionFilter((prevState) => ({
          ...prevState,
          nextStartAfterDocId: data?.nextStartAfterDocId,
          prevEndBeforeDocId: "",
          page: Number(regionFilter?.page) + 1,
        }));
      } else if (page === "first") {
        setRegionFilter({
          limit: 10,
          search: "",
          page: 1,
          filterPage: 0,
          sort: "regionName",
          sortOrder: "asc",
        });
      }
    }
  };

  const handlePageSizeChange = (newPageSize: any) => {
    setRegionFilter({
      limit: newPageSize,
      search: "",
      page: 1,
      filterPage: 1,
      sort: "regionName",
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
      setRegionFilter((prevState) => ({
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
    const block: AsyncResponseType = await updateRegionStatus({
      isActive: value?.value,
      blockId,
    });
    if (block?.success) {
      toast.success(block?.message);
      setTimeout(() => {
        queryClient.invalidateQueries(["getRegion"]);
      }, 1000)
    } else {
      toast.error(block?.message);
    }
  };

  return (
    <>
      <section className="region">
        <TableHeader
          title={Strings.region_management}
          searchBox
          searchBoxPlaceholder={Strings.search}
          handleSearch={handleSearch}
          addBtn={checkUserPermission(PERMISSION.region, PERMISSION_VALUE.create) ? Strings.region_add : ""}
          addBtnPath={
            checkUserPermission(PERMISSION.region, PERMISSION_VALUE.create) ? allRoutes.regionAdd : ""
          }
          showPagination
          pageLength={regionFilter?.limit.toString()}
          onPageSizeChange={handlePageSizeChange}
        />
        <ThemeTable
          labels={blocksLabels}
          isLoading={isFetching}
          length={data?.regions?.length}
          handleSorting={handleSorting}
        >
          {data?.regions?.map((item: RegionType, index: number) => {
            const { id, regionName, isActive } = item;
            // let serialNumber = 0;
            // if (data?.page) {
            //   serialNumber =
            //     (regionFilter?.filterPage! - 1) * regionFilter?.limit! +
            //     index +
            //     1;
            // } else {
            //   serialNumber =
            //     (regionFilter?.page! - 1) * regionFilter?.limit! + index + 1;
            // }

            return (
              <tr key={index}>
                {/* <td>{serialNumber}</td> */}
                <td>{regionName}</td>
                <td>
                  {/* <Badge bg={isActive ? "success" : "danger"}>
                    {isActive ? "Active" : "Inactive"}
                  </Badge> */}
                  <StatusSelect
                    onselectionchange={(e) => handleChangeSelect(e, id)}
                    defaultValue={isActive}
                    className='mx-auto'
                    isDisabled={!checkUserPermission(PERMISSION.region, PERMISSION_VALUE.activeInactive)}
                  />
                </td>
                <td>
                  <div className="actions">
                    {checkUserPermission(PERMISSION.region, PERMISSION_VALUE.update) && (
                      <Link
                        to={`${allRoutes.regionUpdate}?regionId=${id}`}
                        className="table-icon"
                      >
                        <SvgPenToEdit size="24" />
                      </Link>
                    )}
                    {checkUserPermission(PERMISSION.region, PERMISSION_VALUE.delete) && (
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
          // pageSize={`${(regionFilter?.page - 1) * regionFilter?.limit + 1} - ${((regionFilter?.page - 1) * regionFilter?.limit + data?.regions?.length) || 0} of ${data?.count || 0}`}
          handlePagination={handlePagination}
          disabledFirst={
            regionFilter?.filterPage == 1 && data?.page
              ? true
              : data?.prevEndBeforeDocId || data?.page > 0
                ? false
                : true
          }
          disabledPrev={
            regionFilter?.filterPage == 1 && data?.page
              ? true
              : data?.prevEndBeforeDocId || data?.page > 0
                ? false
                : true
          }
          disabledNext={
            data?.page == regionFilter?.filterPage
              ? true
              : data?.nextStartAfterDocId || data?.page > 0
                ? false
                : true
          }
        />
        <TrashModal
          title={Strings.region}
          body={Strings.region_delete}
          trashModal={trashModal?.open}
          handleCLoseTrashModal={handleCloseTrashModal}
          handleDeleteData={() => handleDeleteModalConfirm(trashModal?.id)}
          disabled={deleteRegionMutation?.isLoading}
        />
      </section>
    </>
  );
}

export default RegionManagement;
