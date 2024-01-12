// @ts-nocheck
import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { Col, Row } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import DndUpload from "src/components/DndUpload";
import { iconDndUpload } from "src/assets/images";
import AgentCard from "src/components/DNDCard/AgentCard";
import Heading from "src/components/Heading";
import { Strings } from "src/resources";
import { useQuery } from "@tanstack/react-query";
import { getTermsCondition } from "src/Query/TermsCondition/termsCondition.query";
import { toast } from "react-toastify";
import ItineraryModalTermsConditions from "../components/ItineraryModalTermsConditions";
import Button from "src/components/Button";

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


  const findCopyBlock: any = destClone?.find((e: any) => e?.id == item?.id);
  if (findCopyBlock?.id) {
    toast.error(Strings.term_condition_already_exist);
  } else {
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

const TermsConditions = ({ termsDraggedList, setTermsDraggedList }: TermsConditionsType) => {

  const [addTermsConditionModal, setAddTermsConditionModal] = useState(false);
  const [termsConditionId, setTermsConditionId] = useState<{ dragId?: string, }>({ dragId: '' })
  const [termsConditionData, setTermsConditionData] = useState()


  const [termsConditionFilter] = useState({
    limit: 100,
    search: "",
    isActive: true
  });

  // get TermsCondition
  const { data } = useQuery({
    queryKey: ["getTermsCondition", termsConditionFilter],
    queryFn: () => getTermsCondition(termsConditionFilter),
    select: (data) => data?.data,
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    switch (source.droppableId) {
      case destination.droppableId:
        setTermsDraggedList((prevLists) => ({
          ...prevLists,
          [destination.droppableId]: reorder(
            prevLists[source.droppableId],
            source.index,
            destination.index
          ),
        }));
        break;
      case "ITEMS":
        setTermsDraggedList((prevLists) => ({
          ...prevLists,
          [destination.droppableId]: copy(
            data?.terms,
            prevLists[destination.droppableId],
            source,
            destination
          ),
        }));
        break;
      default:
        setTermsDraggedList((prevLists) =>
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

  function termsModalOpenHandler() {
    setAddTermsConditionModal(true);
  }

  function TermsModalCloseHandler() {
    setAddTermsConditionModal(false);
    setTermsConditionId({ dragId: '' })
    setTermsConditionData(null)
  }

  function handleDelete(id: string) {
    const dynamicData = { ...termsDraggedList };
    for (const key in dynamicData) {
      const index = dynamicData[key].findIndex((item: { dropeedId: string; }) => item.dropeedId === id);
      if (index !== -1) {
        dynamicData[key].splice(index, 1);
      }
    }
    setTermsDraggedList(dynamicData)
  }

  function handleEdit({ dragId }) {
    const updatedServiceDraggedList = { ...termsDraggedList };

    for (const key in updatedServiceDraggedList) {
      const filterBlock = updatedServiceDraggedList[key].find((item) => item?.dropeedId === dragId);
      if (filterBlock) {
        setTermsConditionData(filterBlock);
        break;
      }
    }
    termsModalOpenHandler()
    setTermsConditionId({
      dragId,
    })
  }
  const updateTermsDraggedList = ({ newTermsConditionData, termsConditionId }) => {

    const updatedServiceDraggedList = { ...termsDraggedList };
    for (const key in updatedServiceDraggedList) {
      const updatedList = updatedServiceDraggedList[key].map((item) => {
        if (item.dropeedId === termsConditionId?.dragId) {
          return {
            ...item,
            ...newTermsConditionData,
          };
        }
        return item;
      });

      updatedServiceDraggedList[key] = updatedList;
    }
    setTermsDraggedList(updatedServiceDraggedList);

    TermsModalCloseHandler()

  };


  return (
    <>
      <div className="event-w">
        <DragDropContext onDragEnd={onDragEnd}>
          <Row className="g-3">
            <Col lg={7}>
              <div className="dnd-wrapper">
                <h5 className="mb-3">{Strings.terms_conditions}</h5>
                {Object.keys(termsDraggedList).map((list, i) => (
                  <>
                    <Droppable droppableId={list} key={i}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          // isDraggingOver={snapshot.isDraggingOver}
                          className={`dnd-wrapper-container ${termsDraggedList[list].length ? "active" : ""
                            }`}
                        >
                          {termsDraggedList[list].length ? (
                            termsDraggedList[list].map((item: any, index: number) => (
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
                                      title={item.title}
                                      description={item.description}
                                      isDragging={snapshot.isDragging}
                                      editIcon
                                      trashIcon
                                      handleDelete={() => handleDelete(item?.dropeedId)}
                                      handleEdit={() => handleEdit({ dragId: item?.dropeedId })}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))
                          ) : provided.placeholder ? (
                            <DndUpload
                              title={Strings.terms_conditions_drag}
                              image={iconDndUpload}
                            />
                          ) : null}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </>
                ))}
              </div>
            </Col>
            <Col lg={5}>
              <div className="dnd-wrapper">
                <div className="dnd-wrapper-header">
                  <div className="dnd-wrapper-head">
                    <Heading title={Strings.terms_conditions} variant="small" />
                    <Button
                      variant="outline"
                      title={Strings.terms_conditions_add}
                      onClick={termsModalOpenHandler}
                    />
                  </div>

                </div>
                <Droppable droppableId="ITEMS" isDropDisabled={true}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                    // isDraggingOver={snapshot.isDraggingOver}
                    >
                      <div className="dnd-wrapper-scroll terms-conditions-scroll">
                        {data?.terms.map((item, index) => (
                          <Draggable
                            key={item?.id}
                            draggableId={item?.id}
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
                                  title={item.title}
                                  dragBtn
                                  description={item.description}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                    </div>
                  )}
                </Droppable>
                <></>
              </div>
            </Col>
          </Row>
        </DragDropContext>
      </div>
      <ItineraryModalTermsConditions
        updateTermsDraggedList={updateTermsDraggedList}
        TermsModalCloseHandler={TermsModalCloseHandler}
        isShowing={addTermsConditionModal}
        termsConditionData={termsConditionData}
        termsConditionId={termsConditionId} />
    </>
  );
};

type TermsConditionsType = {
  termsDraggedList: any;
  setTermsDraggedList: any
}
export default TermsConditions;
