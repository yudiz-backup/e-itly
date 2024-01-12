// @ts-nocheck
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useQuery } from "@tanstack/react-query";
import { Col, Row } from "react-bootstrap";
import { v4 as uuid } from "uuid";

// component
import EventServiceCard from "src/components/DNDCard/EventServiceCard";
import SearchBox from "src/components/SearchBox";
import DndUpload from "src/components/DndUpload";
import Heading from "src/components/Heading";
import Button from "src/components/Button";

// query
import { getServices } from "src/services/ServicesService";

import { iconDndUpload } from "src/assets/images";
import ItineraryModalAddService from "../../ItineraryManagement/components/ItineraryModalAddService";
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
  const item: any = sourceClone[droppableSource.index];

  // const findCopyService: any = destClone?.find((e: any) => e?.id == item?.id);
  // if (findCopyService?.id) {
  //   toast.error("Service already exists.");
  // } else {
  destClone.splice(droppableDestination.index, 0, {
    ...item,
    dropeedId: uuid(),
  });
  // }

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

type EventServiceProps = {
  setServiceDraggedList: React.SetStateAction<UnknownObject>
  serviceDraggedList: UnknownObject
}
const EventService = ({ setServiceDraggedList, serviceDraggedList }: EventServiceProps) => {

  const [addServiceModal, setAddServiceModal] = useState(false);
  const [serviceId, setServiceId] = useState<{ dragId?: string, }>({ dragId: '' })
  const [serviceData, setServiceData] = useState()

  const [serviceFilter, setServiceFilter] = useState<ServiceTypeFilterType>({
    limit: 100,
    search: "",
    isActive: true
  });

  // get Service List
  const { data: serviceList } = useQuery({
    queryKey: ["getService", serviceFilter],
    queryFn: () => getServices(serviceFilter),
    select: (data) => data?.data,
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }
    switch (source.droppableId) {
      case destination.droppableId:
        setServiceDraggedList((prevLists) => ({
          ...prevLists,
          [destination.droppableId]: reorder(
            prevLists[source.droppableId],
            source.index,
            destination.index
          ),
        }));
        break;
      case "ITEMS":
        setServiceDraggedList((prevLists) => ({
          ...prevLists,
          [destination.droppableId]: copy(
            serviceList?.services,
            prevLists[destination.droppableId],
            source,
            destination
          ),
        }));
        break;
      default:
        setServiceDraggedList((prevLists) =>
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

  function serviceModalOpenHandler() {
    setAddServiceModal(true);
  }
  function serviceModalCloseHandler() {
    setAddServiceModal(false);
    setServiceId({ dragId: '' })
    setServiceData(null)
  }

  const handleSearch = (e: string) => {
    setServiceFilter((prev) => ({
      ...prev,
      search: e,
    }));
  };

  function handleDelete(id: string) {
    const dynamicData = { ...serviceDraggedList };
    for (const key in dynamicData) {
      const index = dynamicData[key].findIndex((item: { dropeedId: string; }) => item.dropeedId === id);
      if (index !== -1) {
        dynamicData[key].splice(index, 1);
      }
    }
    setServiceDraggedList(dynamicData)
  }

  function handleEdit({ dragId }) {
    const updatedServiceDraggedList = { ...serviceDraggedList };

    for (const key in updatedServiceDraggedList) {
      const filterBlock = updatedServiceDraggedList[key].find((item) => item?.dropeedId === dragId);
      if (filterBlock) {
        setServiceData(filterBlock);
        break;
      }
    }
    serviceModalOpenHandler()
    setServiceId({
      dragId,
    })
  }

  const updateServiceDraggedList = ({ servicesData, serviceId }) => {

    const updatedServiceDraggedList = { ...serviceDraggedList };
    for (const key in updatedServiceDraggedList) {
      const updatedList = updatedServiceDraggedList[key].map((item) => {
        if (item.dropeedId === serviceId?.dragId) {
          return {
            ...item,
            ...servicesData,
          };
        }
        return item;
      });

      updatedServiceDraggedList[key] = updatedList;
    }
    setServiceDraggedList(updatedServiceDraggedList);

    serviceModalCloseHandler()

  };

  return (
    <>
      <div className="event-w">
        <DragDropContext onDragEnd={onDragEnd}>
          <Row className="g-3">
            <Col lg={7}>
              <div className="dnd-wrapper">
                <h5 className="mb-3">{Strings.event_service}</h5>
                {Object.keys(serviceDraggedList).map((list, i) => (
                  <Droppable droppableId={list} key={i}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        // isDraggingOver={snapshot.isDraggingOver}
                        className={`dnd-wrapper-container ${serviceDraggedList[list]?.length ? "active" : ""
                          }`}
                      >
                        {serviceDraggedList[list]?.length ? (
                          serviceDraggedList[list]?.map(
                            (item: any, index: number) => (
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
                                    <EventServiceCard
                                      description={item?.description}
                                      title={item?.serviceName}
                                      chipsTitle={item?.serviceType}
                                      isDragging={snapshot?.isDragging}
                                      editIcon
                                      trashIcon
                                      internalCost={item?.internalCost}
                                      externalCost={item?.externalCost}
                                      supplierName={item?.supplierName}
                                      id={item?.id}
                                      handleDelete={() => handleDelete(item?.dropeedId)}
                                      handleEdit={() => handleEdit({ dragId: item?.dropeedId })}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            )
                          )
                        ) : provided.placeholder ? (
                          <DndUpload
                            title={Strings.event_service_drag_title}
                            image={iconDndUpload}
                          />
                        ) : null}
                        {provided.placeholder}
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
                    <Heading title={Strings.service_list} variant="small" />
                    <Button
                      variant="outline"
                      title={Strings.add_service}
                      onClick={() => {
                        setAddServiceModal(!addServiceModal);
                      }}
                    />
                  </div>
                  <SearchBox
                    placeholder={Strings.search_here}
                    handleSearch={handleSearch}
                  />
                </div>
                <Droppable droppableId="ITEMS" isDropDisabled={true}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                    // isDraggingOver={snapshot.isDraggingOver}
                    >
                      <div className="dnd-wrapper-scroll">
                        {serviceList?.services?.length > 0 ? (
                          serviceList?.services?.map((item, index) => (
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
                                  <EventServiceCard
                                    description={item?.description}
                                    title={item?.serviceName}
                                    chipsTitle={item?.serviceType}
                                    btnIcon
                                    internalCost={item?.internalCost}
                                    externalCost={item?.externalCost}
                                    supplierName={item?.supplierName}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))
                        ) : (
                          <h6>{Strings.service_not_found}</h6>
                        )}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            </Col>
          </Row>
        </DragDropContext>
      </div>
      <ItineraryModalAddService
        updateServiceDraggedList={updateServiceDraggedList}
        serviceModalCloseHandler={serviceModalCloseHandler}
        isShowing={addServiceModal}
        serviceData={serviceData}
        serviceId={serviceId}
      />
    </>
  );
};

export default EventService;
