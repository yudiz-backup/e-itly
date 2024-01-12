/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useQuery } from "@tanstack/react-query";
import { Col, Row } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";

// component
import AddAgentDetailSidebar from "../components/AddAgentDetailSidebar";
import AgentCard from "src/components/DNDCard/AgentCard";
import SearchBox from "src/components/SearchBox";
import DndUpload from "src/components/DndUpload";
import Heading from "src/components/Heading";
import Button from "src/components/Button";

// query
import { getAgent } from "src/Query/Agent/agent.query";

// recoil
import { itineraryAtom } from "src/recoilState/itinerary";

import { iconDndUpload } from "src/assets/images";
import useModal from "src/hooks/useModal";
import { Strings } from "src/resources";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const copy = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const item = sourceClone[droppableSource.index];
  if (destClone?.length > 0) {
    toast.error("Only one agent allowed");
  }
  else {
    destClone.splice(droppableDestination.index, 0, {
      ...item,
      dropeedId: uuid(),
    });
  }
  return destClone;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const EventBlock = () => {

  const { toggle, isShowing } = useModal();

  const [itineraryData, setItineraryData] = useRecoilState<ItineraryType | undefined>(
    itineraryAtom
  );

  const [agentId, setAgentId] = useState<{ dragId?: string, }>({ dragId: '' })
  const [agentDraggedList, serAgentDraggedList] = useState({ [uuid()]: [] });
  const [agentData, setAgentData] = useState()
  const [agentFilter, setAgentFilter] = useState<AgentFilterType>({
    limit: 100,
    search: "",
  });
  useEffect(() => {
    if (itineraryData?.agent) {
      const updatedAgentDraggedList = {
        [uuid()]: [
          { ...itineraryData.agent }
        ],
      };

      serAgentDraggedList(updatedAgentDraggedList);
    }
  }, [itineraryData?.agent]);
  
  useEffect(() => {
    if (!itineraryData?.agent) {
      addAgentInItinerary(agentDraggedList)
    }
  }, [agentDraggedList])

  // get Agent
  const { data } = useQuery({
    queryKey: ["getAgent", agentFilter],
    queryFn: () => getAgent(agentFilter),
    select: (data) => data?.data,
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    switch (source.droppableId) {
      case destination.droppableId:
        serAgentDraggedList((prevLists) => ({
          ...prevLists,
          [destination.droppableId]: reorder(
            prevLists[source.droppableId],
            source.index,
            destination.index
          ),
        }));
        break;
      case "ITEMS":
        serAgentDraggedList((prevLists) => ({
          ...prevLists,
          [destination.droppableId]: copy(
            data?.agents,
            prevLists[destination.droppableId],
            source,
            destination
          ),
        }));
        break;
      default:
        serAgentDraggedList((prevLists) =>
          move(
            prevLists[source.droppableId],
            prevLists[destination.droppableId],
            source,
            destination
          )
        );
        break;
    }
  };

  function addAgentInItinerary(AgentData) {
    const agentIdArray = Object.values(AgentData)
      .flat().map((agent) => {
        const { algoliaId, ...rest } = agent;
        return rest;
      });
    setItineraryData((prevItineraryData) => {
      return {
        ...prevItineraryData,
        agent: agentIdArray[0]
      };
    });
  }

  function agentModalCloseHandler() {
    toggle()
    setAgentId({ dragId: '' })
    setAgentData(null)
  }

  const handleSearch = (e: string) => {
    setAgentFilter((prev) => ({
      ...prev,
      search: e,
    }));
  };

  function handleDelete(id: string) {
    const dynamicData = { ...agentDraggedList };
    for (const key in dynamicData) {
      const index = dynamicData[key].findIndex((item: { dropeedId: string; }) => item.dropeedId === id);
      if (index !== -1) {
        dynamicData[key].splice(index, 1);
      }
    }
    const itinData = { ...itineraryData }
    delete itinData?.agent
    setItineraryData(itinData)
    serAgentDraggedList(dynamicData)
  }

  function handleEdit({ dragId }) {
    const updatedServiceDraggedList = { ...agentDraggedList };

    for (const key in updatedServiceDraggedList) {
      const filterBlock = updatedServiceDraggedList[key].find((item) => item?.dropeedId === dragId);
      if (filterBlock) {
        setAgentData(filterBlock);
        break;
      }
    }
    toggle()
    setAgentId({
      dragId,
    })
  }

  const updateAgentDraggedList = ({ agentNewData, agentId }) => {

    const updatedServiceDraggedList = { ...agentDraggedList };
    for (const key in updatedServiceDraggedList) {
      const updatedList = updatedServiceDraggedList[key].map((item) => {
        if (item.dropeedId === agentId?.dragId) {
          return {
            ...item,
            ...agentNewData,
          };
        }
        return item;
      });

      updatedServiceDraggedList[key] = updatedList;
    }
    serAgentDraggedList(updatedServiceDraggedList);
    addAgentInItinerary(updatedServiceDraggedList);
    agentModalCloseHandler()
  }
  return (
    <>
      <div className="event-w itineraryStep2">
        <DragDropContext onDragEnd={onDragEnd}>
          <Row className="g-3">
            <Col lg={7}>
              <div className='mb-22 itineraryAgent-select'>
                {/* {itineraryId && <Version /> }  */}
              </div>
              <div className="dnd-wrapper">
                <h5 className="mb-3">{Strings.agent}</h5>
                {Object.keys(agentDraggedList).map((list, i) => (
                  <Droppable droppableId={list} key={i}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        // isDraggingOver={snapshot.isDraggingOver}
                        className={`dnd-wrapper-container ${agentDraggedList[list].length ? "active" : ""
                          }`}
                      >
                        {agentDraggedList[list].length ? (
                          agentDraggedList[list].map((item: any, index: number) => (
                            <>
                              <Draggable
                                key={item?.dropeedId}
                                draggableId={item?.dropeedId}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    data-is-dragging={snapshot.isDragging}
                                    {...provided.dragHandleProps}
                                  >
                                    <AgentCard
                                      title={item?.name}
                                      address={item?.agencyName}
                                      email={item?.email}
                                      isDragging={snapshot.isDragging}
                                      editIcon
                                      trashIcon
                                      handleDelete={() => handleDelete(item?.dropeedId)}
                                      handleEdit={() => handleEdit({ dragId: item?.dropeedId })}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            </>
                          ))
                        ) : provided.placeholder ? (
                          <DndUpload
                            title={Strings.event_drag_title}
                            image={iconDndUpload}
                          />
                        ) : null}
                        {/* {provided.placeholder} */}
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </Col>
            <Col lg={5}>
              <div className="dnd-wrapper">
                <div className="dnd-wrapper-header">
                  <div className="dnd-wrapper-head">
                    <Heading title={Strings.agent} variant="small" />
                    <Button variant="outline" title={Strings.agent_add} onClick={toggle} />
                  </div>
                  <SearchBox
                    placeholder={Strings.search_here}
                    handleSearch={handleSearch}
                  />
                </div>
                <Droppable droppableId="ITEMS" isDropDisabled={true}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      data-is-dragging-over={snapshot.isDraggingOver}
                    >
                      <div className="dnd-wrapper-scroll">
                        {data?.agents.map((item, index) => (
                          <>
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.dragHandleProps}
                                  data-is-dragging={snapshot.isDragging}
                                  {...provided.draggableProps}
                                >
                                  <AgentCard
                                    title={item?.name}
                                    address={item?.agencyName}
                                    email={item?.email}
                                    dragBtn
                                  />
                                </div>
                              )}
                            </Draggable>
                          </>
                        ))}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            </Col>
          </Row>
        </DragDropContext>
      </div>
      <AddAgentDetailSidebar
        updateAgentDraggedList={updateAgentDraggedList}
        agentModalCloseHandler={agentModalCloseHandler}
        isShowing={isShowing}
        agentData={agentData}
        agentId={agentId}
        toggle={toggle}
      />
    </>
  );
};

export default EventBlock;
