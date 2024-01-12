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
import { deleteAgent, updateAgentStatus } from "src/Query/Agent/agent.mutation";
import { getAgent } from "src/Query/Agent/agent.query";
import queryClient from "src/queryClient";

import { SvgPenToEdit, SvgTrash } from "src/assets/images";
import { PERMISSION, PERMISSION_VALUE } from "src/constants/permissionEnum";
import { allRoutes } from "src/constants/AllRoutes";
import { Strings } from "src/resources";
import { checkUserPermission } from "src/utils/users";


const AgentManagement = () => {
  const [blocksLabels, setBlocksLabels] = useState([
    {
      name: Strings.agent_label,
      sort: true,
      sortName: "name",
      sortOrder: true,
    },
    {
      name: Strings.agent_email,
      sort: true,
      sortName: "email",
      sortOrder: true,
    },
    {
      name: Strings.agency_label,
      sort: true,
      sortName: "agencyName",
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

  const [agentFilter, setAgentFilter] = useState({
    limit: 10,
    search: "",
    page: 1,
    filterPage: 1,
    sort: "name",
    sortOrder: "asc",
  });

  // get Agent
  const { data, isFetching } = useQuery({
    queryKey: ["getAgent", agentFilter],
    queryFn: () => getAgent(agentFilter),
    select: (data) => data?.data,
  });

  // Delete Agent
  const deleteAgentMutation = useMutation(deleteAgent, {
    onSuccess: (data) => {
      toast.success(data?.message);
      handleCloseTrashModal();
      setAgentFilter({
        limit: 10,
        search: "",
        page: 1,
        filterPage: 1,
        sort: "name",
        sortOrder: "asc",
      })
      queryClient.invalidateQueries(["getAgent"]);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
      handleCloseTrashModal();
    },
  });

  function handleDeleteModalConfirm(id: string) {
    deleteAgentMutation.mutate(id);
  }

  function onDelete(id: string) {
    setTrashModal({ id, open: true });
  }

  function handleCloseTrashModal() {
    setTrashModal({ id: "", open: false });
  }

  const handleSearch = (search: string) => {
    setAgentFilter({
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
        setAgentFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: data?.page,
          filterPage: agentFilter?.filterPage + 1,
        }));
      } else if (page === "prev") {
        setAgentFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: data?.page,
          filterPage: agentFilter?.filterPage - 1,
        }));
      } else if (page === "first") {
        setAgentFilter((prevState) => ({
          ...prevState,
          limit: 10,
          page: 1,
          filterPage: 1,
        }));
      }
    } else {
      if (page === "prev" && data?.prevEndBeforeDocId != null) {
        setAgentFilter((prevState) => ({
          ...prevState,
          prevEndBeforeDocId: data?.prevEndBeforeDocId,
          nextStartAfterDocId: "",
          page: Number(agentFilter?.page) - 1,
        }));
      } else if (page === "next" && data?.nextStartAfterDocId != null) {
        setAgentFilter((prevState) => ({
          ...prevState,
          nextStartAfterDocId: data?.nextStartAfterDocId,
          prevEndBeforeDocId: "",
          page: Number(agentFilter?.page) + 1,
        }));
      } else if (page === "first") {
        setAgentFilter({
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
    setAgentFilter({
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
          // Assuming you want to toggle sortOrder
          return { ...label, sortOrder: sortOrder };
        }
        return label;
      });
      setBlocksLabels(updatedBlocksLabels);
      setAgentFilter((prevState) => ({
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
    const block: AsyncResponseType = await updateAgentStatus({
      isActive: value?.value,
      blockId,
    });
    if (block?.success) {
      toast.success(block?.message);
      queryClient.invalidateQueries(["getAgent"]);
    } else {
      toast.error(block?.message);
    }
  };
  return (
    <>
      <section className="pt-2">
        <TableHeader
          title={Strings.agent_management}
          searchBox
          searchBoxPlaceholder={Strings.search}
          handleSearch={handleSearch}
          addBtn={checkUserPermission(PERMISSION.agent, PERMISSION_VALUE.create) ? Strings.agent_add : ""}
          addBtnPath={
            checkUserPermission(PERMISSION.agent, PERMISSION_VALUE.create) ? allRoutes.agentAdd : ""
          }
          // addBtn={Strings.agent_add}
          // addBtnPath={allRoutes.agentAdd}
          showPagination
          pageLength={agentFilter?.limit.toString()}
          onPageSizeChange={handlePageSizeChange}
        />
        <ThemeTable
          labels={blocksLabels}
          isLoading={isFetching}
          length={data?.agents?.length}
          handleSorting={handleSorting}
        >
          {data?.agents?.map((item: AgentType, index: number) => {
            const { id, name, email, agencyName, isActive } = item;
            return (
              <tr key={index}>
                <td>{name}</td>
                <td>{email}</td>
                <td>{agencyName}</td>
                <td>
                  {/* <Badge bg={isActive ? "success" : "danger"}>
                    {isActive ? "Active" : "Inactive"}
                  </Badge> */}
                  <StatusSelect
                    // selectOptions={selectOptions}
                    onselectionchange={(e) => handleChangeSelect(e, id)}
                    defaultValue={isActive}
                    className='mx-auto'
                    isDisabled={!checkUserPermission(PERMISSION.agent, PERMISSION_VALUE.activeInactive)}
                  />
                </td>
                <td>
                  <div className="actions">
                    {checkUserPermission(PERMISSION.agent, PERMISSION_VALUE.update) && (
                      <Link
                        to={`${allRoutes.agentUpdate}?agentId=${id}`}
                        className="table-icon"
                      >
                        <SvgPenToEdit size="24" />
                      </Link>
                    )}
                    {checkUserPermission(PERMISSION.agent, PERMISSION_VALUE.delete) && (
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
            agentFilter?.filterPage == 1 && data?.page
              ? true
              : data?.prevEndBeforeDocId || data?.page > 0
                ? false
                : true
          }
          disabledPrev={
            agentFilter?.filterPage == 1 && data?.page
              ? true
              : data?.prevEndBeforeDocId || data?.page > 0
                ? false
                : true
          }
          disabledNext={
            data?.page == agentFilter?.filterPage
              ? true
              : data?.nextStartAfterDocId || data?.page > 0
                ? false
                : true
          }
        />
      </section>

      <TrashModal
        title={Strings.agent}
        body={Strings.agent_delete}
        trashModal={trashModal?.open}
        handleCLoseTrashModal={handleCloseTrashModal}
        handleDeleteData={() => handleDeleteModalConfirm(trashModal?.id)}
        disabled={deleteAgentMutation?.isLoading}
      />
    </>
  );
};

export default AgentManagement;
