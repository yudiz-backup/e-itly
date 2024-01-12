// @ts-nocheck
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Accordion, Col, Row, Tab, Tabs } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { useRecoilState, useSetRecoilState } from "recoil";
import { v4 as uuid } from "uuid";
import { VNode } from "preact";

// component
import ItineraryModalAddService from "../components/ItineraryModalAddService";
import ItineraryModalAddBlock from "../components/ItineraryModalAddBlock";
import ItineraryModalAddEvent from "../components/ItineraryModalAddEvent";
import EventServiceCard from "src/components/DNDCard/EventServiceCard";
import EventBlockCard from "src/components/DNDCard/EventBlockCard";
import ItineraryModal from "src/components/Modal/ItineraryModal";
import AgentCard from "src/components/DNDCard/AgentCard";
import CustomSelect from "src/components/CustomSelect";
import SearchBox from "src/components/SearchBox";
import DndUpload from "src/components/DndUpload";
import { useLocation, useNavigate } from "react-router-dom";
import Heading from "src/components/Heading";
import Version from "../components/Version";
import Button from "src/components/Button";

// query
import { getServices } from "src/services/ServicesService";
import { getEvents } from "src/Query/Events/event.query";
import { getRegion } from "src/services/regionService";
import { getBlock } from "src/Query/Block/block.query";

import { SvgPenToEdit, iconDndUpload, iconLine2, defaultImage } from "src/assets/images";
import { itineraryAtom, itineraryVersionAtom } from "src/recoilState/itinerary";
import { Strings } from "src/resources";
import { fetchMultipleImageUrl } from "src/services/UserService";
import { allRoutes } from "src/constants/AllRoutes";
import { getDayItemDate } from "src/utils/date";

const switchActions = {
  EVENT_ITEMS: "EventItems",
  BLOCK_ITEMS: "BlockItems",
  SERVICE_ITEMS: "ServiceItems",
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const copy = (source, destination, droppableSource, droppableDestination, setItineraryCost, itineraryCost, participants) => {
  const sourceClone: (typeof source)[] = Array.from(source);
  const destClone: (typeof destination)[] = Array.from(destination);
  const item = sourceClone[droppableSource.index];
  const newItem = { ...item, droppedId: uuid() };
  newItem.block = newItem?.block?.map((blockItem) => ({
    ...blockItem,
    droppedId: uuid(),
  }));
  newItem.service = newItem?.service?.map((serviceItem) => ({
    ...serviceItem,
    droppedId: uuid(),
  }));
  const result = newItem?.service?.reduce(
    (acc, item) => {
      acc.totalExternalCost +=
        item?.pricePerPerson === true ? parseFloat(item?.externalCost || 0) * Number(participants) : parseFloat(item?.externalCost || 0);
      acc.totalInternalCost +=
        item?.pricePerPerson === true ? parseFloat(item?.internalCost || 0) * Number(participants) : parseFloat(item?.internalCost || 0);
      return acc;
    },
    { totalExternalCost: 0, totalInternalCost: 0 }
  );
  if (result) {
    setItineraryCost({
      ...itineraryCost,
      internalCost: itineraryCost?.internalCost + Number(result?.totalInternalCost),
      externalCost: itineraryCost?.externalCost + Number(result?.totalExternalCost),
    });
  }

  destClone.splice(droppableDestination.index, 0, newItem);

  // destClone.splice(droppableDestination.index, 0, {
  //   ...item,
  //   dropeedId: uuid(),
  // });
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

type CopyInnerItemsType = {
  source: any;
  destination: any;
  droppableSource: any;
  droppableDestination: any;
  dest: any;
  currentActiveTab: any;
  setItineraryCost?: any;
  itineraryCost?: any;
  participants?: any;
};
const copyInnerItems = ({
  source,
  destination,
  droppableSource,
  droppableDestination,
  dest,
  // currentActiveTab,
  setItineraryCost,
  itineraryCost,
  participants,
}: CopyInnerItemsType) => {
  const sourceClone: (typeof source)[] = Array.from(source);
  let destClone: (typeof destination)[] = Array.from(destination);
  // const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone = destClone.map((dItem) => {
    if (droppableDestination.droppableId === dItem.id) {
      const item = sourceClone[droppableSource.index];
      item.droppedId = uuid();
      if (dest == "ServiceItems") {
        setItineraryCost({
          ...itineraryCost,
          internalCost:
            item?.pricePerPerson === true
              ? itineraryCost?.internalCost + Number(item?.internalCost) * Number(participants)
              : itineraryCost?.internalCost + Number(item?.internalCost),
          externalCost:
            item?.pricePerPerson === true
              ? itineraryCost?.externalCost + Number(item?.externalCost) * Number(participants)
              : itineraryCost?.externalCost + Number(item?.externalCost),
        });
        const prevService = dItem.service || [];
        return {
          ...dItem,
          service: [...prevService, item],
        };
      } else if (dest == "BlockItems") {
        const prevBlocks = dItem.block || [];
        return {
          ...dItem,
          block: [...prevBlocks, item],
          // dropeedId: uuid()
        };
      } else {
        return dItem;
      }
    }
    return dItem;
  });
  // destClone.splice(droppableDestination.index, 0, { ...dropDestination, id: uuid(), items: [...prevItems, item] });
  return destClone;
};
const ItineraryStep2 = ({ showVersion, showCost, stepTitle1, stepTitle2, setK, k, setKey }: ItineraryStep2Type): VNode<any> => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const itineraryId = queryParams.get("itineraryId");

  const [serviceId, setServiceId] = useState<{ dragId?: string }>({ dragId: "" });
  const [blockId, setBlockId] = useState<{ dragId?: string }>({ dragId: "" });
  const [addServiceModal, setAddServiceModal] = useState(false);
  const [currentActiveTab, setCurrentActiveTab] = useState<string>();
  const [addBlockModal, setAddBlockModal] = useState(false);
  const [addEventModal, setAddEventModal] = useState(false);
  const [serviceData, setServiceData] = useState();
  const [editCost, setEditCost] = useState(false);
  const [blockData, setBlockData] = useState();
  const [eventData, setEventData] = useState();
  const [eventId, setEventId] = useState<{ dragId?: string }>({ dragId: "" });

  const [eventList, setEventList] = useState<UnknownObject>();
  const [itineraryCost, setItineraryCost] = useState<{
    editedCost?: string;
    internalCost: number;
    externalCost: number;
  }>({
    internalCost: 0,
    externalCost: 0,
  });
  const [itineraryData, setItineraryData] = useRecoilState<ItineraryType | undefined>(itineraryAtom);
  const setItineraryVersionHandle = useSetRecoilState(itineraryVersionAtom);
  const generateInitialEventList = (count) => {
    const initialState = {};
    for (let i = 0; i < Number(count); i++) {
      initialState[uuid()] = [];
    }
    setCurrentActiveTab(Object.keys(initialState)[0]);
    return initialState;
  };

  //fetch event list
  const [eventFilter, setEventFilter] = useState({
    limit: 100,
    search: "",
    isActive: true,
  });
  const { data: EventItems } = useQuery({
    queryKey: ["getEvent", eventFilter],
    queryFn: () => getEvents(eventFilter),
    select: (data) => data?.data,
  });

  // get Block List
  const [blockFilter, setBlockFilter] = useState<BlocksFilterType>({
    limit: 100,
    search: "",
    isActive: true,
  });

  const { data: BlockItems } = useQuery({
    queryKey: ["getBlock", blockFilter],
    queryFn: () => getBlock(blockFilter),
    select: (data) => data?.data,
  });

  // get Service List
  const [serviceFilter, setServiceFilter] = useState<ServiceTypeFilterType>({
    limit: 100,
    search: "",
    isActive: true,
  });

  const { data: ServiceItems } = useQuery({
    queryKey: ["getService", serviceFilter],
    queryFn: () => getServices(serviceFilter),
    select: (data) => data?.data,
  });

  // get Region
  const regionFilter: ServiceTypeFilterType = {
    limit: 100,
    search: "",
    isActive: true,
  };

  const { data: regionList } = useQuery({
    queryKey: ["getRegion", regionFilter],
    queryFn: () => getRegion(regionFilter),
    select: (data) => data?.data?.regions,
  });
  const calculateTotalCosts = () => {
    const calculatedTotal = itineraryData?.day?.reduce(
      (totals, eventGroup) => {
        const groupTotal = eventGroup?.event?.reduce(
          (eventTotals, event) => {
            // const eventExternalTotal = event?.service?.reduce((serviceSum, service) => serviceSum + parseFloat(service?.externalCost), 0);
            // const eventInternalTotal = event?.service?.reduce((serviceSum, service) => serviceSum + parseFloat(service?.internalCost), 0);

            const eventExternalTotal = event?.service?.reduce((serviceSum, service) => {
              const externalCost = parseFloat(service?.externalCost);
              if (service?.pricePerPerson === true) {
                serviceSum += externalCost * Number(itineraryData?.participants);
              } else {
                serviceSum += externalCost;
              }
              return serviceSum;
            }, 0);
            const eventInternalTotal = event?.service?.reduce((serviceSum, service) => {
              const internalCost = parseFloat(service?.internalCost);
              if (service?.pricePerPerson === true) {
                serviceSum += Number(internalCost) * Number(itineraryData?.participants);
              } else {
                serviceSum += Number(internalCost);
              }
              return serviceSum;
            }, 0);

            eventTotals.externalCost += eventExternalTotal;
            eventTotals.internalCost += eventInternalTotal;

            return eventTotals;
          },
          { externalCost: 0, internalCost: 0 }
        );

        totals.externalCost += groupTotal?.externalCost || 0;
        totals.internalCost += groupTotal?.internalCost || 0;

        return totals;
      },
      { externalCost: 0, internalCost: 0 }
    );
    setItineraryCost(calculatedTotal);
  };
  useEffect(() => {
    if (itineraryData?.noOfDay) {
      if (itineraryId) {
        calculateTotalCosts();
      }
      const totalDays = generateInitialEventList(itineraryData?.noOfDay);
      itineraryData?.day?.forEach((i, index) => {
        // totalDays[index] = i?.event
        const updatedEvent = i?.event?.map((event) => ({
          ...event,
          droppedId: uuid(),
          block: event?.block?.map((block) => ({
            ...block,
            droppedId: uuid(),
          })),
          service: event?.service?.map((service) => ({
            ...service,
            droppedId: uuid(),
          })),
        }));
        totalDays[Object.keys(totalDays)[index]] = updatedEvent;
      });
      setEventList(totalDays);
    }
  }, [itineraryData]);

  const serviceModalHandler = () => setAddServiceModal(!addServiceModal);
  const eventModalHandler = () => setAddEventModal(!addEventModal);
  const blockModalHandler = () => setAddBlockModal(!addBlockModal);
  const costHandler = () => setEditCost(!editCost);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }

    switch (source.droppableId) {
      case destination.droppableId:
        setEventList((prevLists) => ({
          ...prevLists,
          [destination.droppableId]: reorder(prevLists[source.droppableId], source.index, destination.index),
        }));
        break;
      case switchActions.EVENT_ITEMS: {
        const participants = itineraryData?.participants;
        setEventList((prevLists) => ({
          ...prevLists,
          [destination.droppableId]: copy(
            EventItems?.events,
            prevLists[destination.droppableId],
            source,
            destination,
            setItineraryCost,
            itineraryCost,
            participants
          ),
        }));
        break;
      }
      case switchActions.BLOCK_ITEMS: {
        // const firstListItemId = Object.keys(eventList)[currentActiveTab];
        const destinationListItem = eventList[currentActiveTab];
        setEventList((prevLists) => ({
          ...prevLists,
          [currentActiveTab]: copyInnerItems({
            source: BlockItems?.blocks,
            destination: destinationListItem,
            droppableSource: source,
            droppableDestination: destination,
            dest: "BlockItems",
            currentActiveTab: currentActiveTab,
          }),
        }));
        break;
      }
      case switchActions.SERVICE_ITEMS: {
        const destinationListItem = eventList[currentActiveTab];
        const participants = itineraryData?.participants;
        setEventList((prevLists) => ({
          ...prevLists,
          [currentActiveTab]: copyInnerItems({
            source: ServiceItems?.services,
            destination: destinationListItem,
            droppableSource: source,
            droppableDestination: destination,
            dest: "ServiceItems",
            currentActiveTab: currentActiveTab,
            setItineraryCost: setItineraryCost,
            itineraryCost: itineraryCost,
            participants: participants,
          }),
        }));
        break;
      }
      default:
        setEventList((prevLists) => move(prevLists[source.droppableId], prevLists[destination.droppableId], source, destination));
        break;
    }
  };

  function blockModalCloseHandler() {
    setAddBlockModal(false);
    setBlockId({ dragId: "" });
    setBlockData(null);
  }
  function eventModalCloseHandler() {
    setAddEventModal(false);
  }
  function serviceModalCloseHandler() {
    setAddServiceModal(false);
    setServiceId({ dragId: "" });
    setServiceData(null);
  }
  function handleEditBlock({ dragId }) {
    const updatedBlockDraggedList = { ...eventList };
    for (const key in updatedBlockDraggedList) {
      if (Object.prototype.hasOwnProperty.call(updatedBlockDraggedList, key)) {
        const innerArray = updatedBlockDraggedList[key];
        for (const item of innerArray) {
          if (item.block) {
            for (const blockItem of item.block) {
              if (blockItem.droppedId === dragId) {
                setBlockData(blockItem);
                break;
              }
            }
          }
        }
      }
    }

    setAddBlockModal(true);
    // blockModalOpenHandler()
    setBlockId({
      dragId,
    });
  }
  function handleDeleteBlock(id: string) {
    const dynamicData = { ...eventList };

    for (const key in dynamicData) {
      const updatedList = dynamicData[key].map((item) => {
        const innerArray = item?.block;

        if (innerArray) {
          const updatedInnerArray = innerArray.filter((innerItem) => {
            return innerItem.droppedId !== id;
          });

          return {
            ...item,
            block: updatedInnerArray,
          };
        }

        return item;
      });

      dynamicData[key] = updatedList;
    }

    setEventList(dynamicData);
  }
  const updateBlockDraggedList = async ({ formData, blockId }) => {
    const newData: UnknownObject = {};
    for (const pair of formData.entries()) {
      newData[pair[0]] = pair[1];
    }
    const formEntry = new FormData();
    formEntry.append("image", newData?.blockImage);
    const blockImageUpload: AsyncResponseType = await fetchMultipleImageUrl(formEntry);
    let updatedObject = { ...newData };
    if (blockImageUpload?.success && blockImageUpload?.data?.length) {
      updatedObject = { ...newData, image: blockImageUpload?.data[0] };
      delete updatedObject.blockImage;
    }
    const updatedBlockDraggedList = { ...eventList };
    for (const key in updatedBlockDraggedList) {
      const updatedList = updatedBlockDraggedList[key].map((i) => {
        const innerArray = i?.block;
        if (innerArray) {
          const updatedInnerArray = innerArray.map((item) => {
            if (item.droppedId === blockId?.dragId) {
              return {
                ...item,
                ...updatedObject,
              };
            }
            return item;
          });
          return {
            ...i,
            block: updatedInnerArray,
          };
        }

        return i;
      });
      updatedBlockDraggedList[key] = updatedList;
    }
    setEventList(updatedBlockDraggedList);
    blockModalCloseHandler();
  };
  const updateServiceDraggedList = ({ servicesData, serviceId }) => {
    const updatedBlockDraggedList = { ...eventList };
    const updatedExternalPrice = { externalCost: itineraryCost?.externalCost, internalCost: itineraryCost?.internalCost };
    for (const key in updatedBlockDraggedList) {
      const updatedList = updatedBlockDraggedList[key].map((i) => {
        const innerArray = i?.service;
        if (innerArray) {
          const updatedInnerArray = innerArray.map((item) => {
            if (item.droppedId === serviceId?.dragId) {
              updatedExternalPrice.externalCost -=
                item?.pricePerPerson === true ? Number(item?.externalCost) * Number(itineraryData?.participants) : Number(item?.externalCost);
              updatedExternalPrice.externalCost +=
                item?.pricePerPerson === true
                  ? Number(servicesData?.externalCost) * Number(itineraryData?.participants)
                  : Number(servicesData?.externalCost);
              updatedExternalPrice.internalCost -=
                item?.pricePerPerson === true ? Number(item?.internalCost) * Number(itineraryData?.participants) : Number(item?.internalCost);
              updatedExternalPrice.internalCost +=
                item?.pricePerPerson === true
                  ? Number(servicesData?.internalCost) * Number(itineraryData?.participants)
                  : Number(servicesData?.internalCost);
              return {
                ...item,
                ...servicesData,
              };
            }
            return item;
          });
          return {
            ...i,
            service: updatedInnerArray,
          };
        }

        return i;
      });
      updatedBlockDraggedList[key] = updatedList;
    }
    setItineraryCost({
      ...itineraryCost,
      externalCost: updatedExternalPrice?.externalCost,
      internalCost: updatedExternalPrice?.internalCost,
    });
    setEventList(updatedBlockDraggedList);
    serviceModalCloseHandler();
  };
  const updateEventDraggedList = ({ eventData, eventId }) => {
    const eventDraggedList = { ...eventList };
    for (const key in eventDraggedList) {
      if (Object.prototype.hasOwnProperty.call(eventDraggedList, key)) {
        const innerArray = eventDraggedList[key];
        const updatedInnerArray = innerArray.map((obj) => {
          if (obj.droppedId === eventId?.dragId) {
            return { ...obj, ...eventData };
          }
          return obj;
        });
        eventDraggedList[key] = updatedInnerArray;
      }
    }
    setEventList(eventDraggedList);
    setEventId({ dragId: "" });
    setEventData(null);
    eventModalCloseHandler();
  };
  function handleEditService({ dragId }) {
    const updatedBlockDraggedList = { ...eventList };
    for (const key in updatedBlockDraggedList) {
      if (Object.prototype.hasOwnProperty.call(updatedBlockDraggedList, key)) {
        const innerArray = updatedBlockDraggedList[key];

        for (const item of innerArray) {
          if (item.service) {
            for (const serviceItem of item.service) {
              if (serviceItem.droppedId === dragId) {
                setServiceData(serviceItem);
                break;
              }
            }
          }
        }
      }
    }
    setAddServiceModal(true);
    setServiceId({
      dragId,
    });
  }
  function handleDeleteService(id: string) {
    const dynamicData = { ...eventList };

    for (const key in dynamicData) {
      const updatedList = dynamicData[key].map((item) => {
        const innerArray = item?.service;

        if (innerArray) {
          const updatedInnerArray = innerArray.filter((innerItem) => {
            if (innerItem.droppedId === id) {
              if (itineraryCost) {
                setItineraryCost({
                  ...itineraryCost,
                  internalCost: itineraryCost.internalCost - Number(innerItem.internalCost),
                  externalCost:
                    innerItem?.pricePerPerson === true
                      ? itineraryCost.externalCost - Number(innerItem.externalCost) * Number(itineraryData?.participants)
                      : itineraryCost.externalCost - Number(innerItem.externalCost),
                });
              }
              return false;
            }
            return true;
          });

          return {
            ...item,
            service: updatedInnerArray,
          };
        }

        return item;
      });

      dynamicData[key] = updatedList;
    }

    setEventList(dynamicData);
  }
  function handleDeleteEvent(id: string) {
    const updatedEventList: { [key: string]: ItineraryType[] } = {};
    for (const key in eventList) {
      if (Object.prototype.hasOwnProperty.call(eventList, key)) {
        updatedEventList[key] = eventList[key].filter((event) => {
          if (event.droppedId === id) {
            const deletedEventCosts = event.service.reduce(
              (acc, ser) => {
                return {
                  internalCost: acc.internalCost + Number(ser.internalCost),
                  externalCost: acc.externalCost + Number(ser.externalCost),
                };
              },
              { internalCost: 0, externalCost: 0 }
            );
            setItineraryCost({
              ...itineraryCost,
              internalCost: itineraryCost.internalCost - deletedEventCosts.internalCost,
              externalCost: itineraryCost.externalCost - deletedEventCosts.externalCost
            })
          }

          return event.droppedId !== id
        });
      }
    }
    setEventList(updatedEventList);
  }
  function handleEditEvent({ dragId }) {
    const updatedEventList = { ...eventList };
    const arrayOfArrays = Object.values(updatedEventList);
    const flatArray = arrayOfArrays.flat();
    const foundObject = flatArray.find((obj) => obj.droppedId === dragId);
    setEventData(foundObject);
    setAddEventModal(true);
    setEventId({
      dragId,
    });
  }
  const [key, setKey1] = useState("event");

  const handleSubmitStep2 = () => {
    const itineraryStep2Data = Object.keys(eventList)?.map((day, dIndex) => ({
      dayRefId: itineraryData?.day && itineraryData?.day[dIndex]?.dayRefId,
      isBooked: itineraryData?.day && itineraryData?.day[dIndex]?.isBooked,
      event: eventList[day]?.map((event) => ({
        eventDay: event?.eventDay,
        eventTitle: event?.eventTitle,
        eventDuration: event?.eventDuration,
        eventRefId: event?.eventRefId,
        notes: event?.notes,
        service: event?.service?.map((service) => ({
          serviceType: service?.serviceType,
          supplierName: service?.supplierName,
          supplierId: service?.supplierId,
          supplierEmail: service?.supplierEmail,
          externalCost: service?.externalCost,
          description: service?.description,
          pricePerPerson: service?.pricePerPerson,
          id: service?.id,
          serviceName: service?.serviceName,
          region: service?.region,
          isActive: service?.isActive,
          internalCost: service?.internalCost,
          serviceRefId: service?.serviceRefId,
          isBooked: service?.isBooked
        })),
        block: event?.block?.map((block) => ({
          image: block?.image,
          blockName: block?.blockName,
          description: block?.description,
          id: block?.id,
          isActive: block?.isActive,
          blockRefId: block?.blockRefId
        })),
        id: event?.id,
        region: event?.region,
        isActive: event?.isActive,
      })),
    }));
    setItineraryData((prevState) => ({
      ...prevState,
      editedCost: itineraryCost?.editedCost || 0,
      day: itineraryStep2Data,
    }));
    setK({ ...k, step3: true });
    setKey("step3");
  };
  const handleChangeVersion = (item) => {
    const newState = { ...item };
    delete newState.itineraryVersion;
    setItineraryVersionHandle(item);
  };
  return (
    <>
      <div className="event-w itineraryStep2">
        <div className="position-relative">
          <div className="position-absolute top-0 end-0">
            <Button variant="outline" title={Strings.cancel} className="me-3" onClick={() => navigate(allRoutes.itinerary)} />
            <Button variant="primary" title={Strings.save} onClick={handleSubmitStep2} />
          </div>
          <Row>
            <Col lg={7}>
              <div className="position-relative">
                {showCost && (
                  <div className="itineraryStep2-cost flex-between mb-20">
                    <ul>
                      <li>
                        {Strings.total_external_cost_label}: {Strings.euro}
                        {itineraryCost?.editedCost ? itineraryCost.editedCost : itineraryCost?.externalCost ? itineraryCost.externalCost : 0}
                      </li>{" "}
                      <li>
                        {Strings.total_internal_cost_lable}: {Strings.euro}
                        {itineraryCost?.internalCost}{" "}
                      </li>
                    </ul>
                    <button onClick={costHandler}>
                      <SvgPenToEdit />
                      {Strings.edit}
                    </button>
                  </div>
                )}
                {showVersion && itineraryId && (
                  <div className="position-absolute top-1 end-0">
                    <Version
                      versionData={itineraryData?.itineraryVersion}
                      handleChangeVersion={handleChangeVersion}
                      currentVersion={itineraryData?.versionNumber}
                    />
                  </div>
                )}
              </div>
            </Col>
          </Row>
          <div className="tabs-list day-list">
            <Tabs defaultActiveKey="0" id="profile-tabs" onSelect={(k) => setCurrentActiveTab(Object.keys(eventList)[k])}>
              {eventList &&
                Array.from({ length: Number(itineraryData?.noOfDay) }).map((_, index) => (
                  <Tab key={`Day ${index + 1}`} eventKey={`${index}`} title={getDayItemDate(itineraryData.startDate, index)}>
                    <DragDropContext onDragEnd={(e) => onDragEnd(e)}>
                      <Row className="g-3">
                        <Col lg={7}>
                          {stepTitle1 && (
                            <div className="mb-12">
                              <Heading title={stepTitle1} variant="small" />
                            </div>
                          )}
                          <div>
                            <div className="s">
                              {/* {Object.keys(eventList).map((list, i) => ( */}
                              <Droppable droppableId={Object.keys(eventList)[index]} key={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    data-is-dragging-over={snapshot.isDraggingOver}
                                    className={`dnd-wrapper dnd-wrapper-container ${
                                      eventList[Object.keys(eventList)[index]]?.length ? "active" : ""
                                      }`}
                                  >
                                    {provided.placeholder}

                                    {eventList[Object.keys(eventList)[index]]?.length ? (
                                      eventList[Object.keys(eventList)[index]]?.map((item: any, index: number) => (
                                        <>
                                          <Draggable key={item.droppedId} draggableId={item.droppedId} index={index}>
                                            {(provided, snapshot) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                data-is-dragging={snapshot.isDragging}
                                                {...provided.dragHandleProps}
                                              >
                                                <Accordion className="mb-3">
                                                  <Accordion.Item eventKey="0">
                                                    <Accordion.Header>
                                                      <img src={iconLine2} alt="lineIcon" />
                                                      {item?.eventTitle}
                                                    </Accordion.Header>
                                                    <Accordion.Body>
                                                      <div className="dnd-wrapper dashed-wrapper">
                                                        <div className="mb-4">
                                                          <AgentCard
                                                            title={item?.eventTitle}
                                                            description={item?.notes}
                                                            eventDay={item?.eventDay}
                                                            region={item?.region}
                                                            blockCount={item?.block?.length || 0}
                                                            serviceCount={item?.service?.length || 0}
                                                            service={item?.service}
                                                            chipsIcon
                                                            editIcon
                                                            trashIcon
                                                            handleDelete={() => handleDeleteEvent(item?.droppedId)}
                                                            handleEdit={() => handleEditEvent({ dragId: item?.droppedId })}
                                                          />

                                                          <h4 className="fs-6 mb-2">{Strings.blocks}</h4>
                                                          <div className="dashed-wrapper">
                                                            <Droppable key={item?.id} droppableId={item?.id}>
                                                              {(provided) => (
                                                                <div
                                                                  ref={provided.innerRef}
                                                                  {...provided.droppableProps}
                                                                  // className="border"
                                                                  style={{ minHeight: 100 }}
                                                                // isDraggingOver={snapshot.isDraggingOver}
                                                                // className={`dnd-wrapper dnd-wrapper-container ${lists[list].length ? "active" : ""}`}
                                                                >
                                                                  {provided.placeholder}
                                                                  {item?.block?.map((childItem, cIndex) => (
                                                                    <Draggable
                                                                      key={childItem.droppedId}
                                                                      draggableId={childItem.droppedId}
                                                                      index={cIndex}
                                                                    >
                                                                      {(provided) => (
                                                                        <div
                                                                          ref={provided.innerRef}
                                                                          {...provided.draggableProps}
                                                                          // isDragging={snapshot.isDragging}
                                                                          {...provided.dragHandleProps}
                                                                        >
                                                                          <EventBlockCard
                                                                            title={childItem.blockName}
                                                                            editIcon
                                                                            trashIcon
                                                                            description={childItem.description}
                                                                            image={childItem.image || defaultImage}
                                                                            //  dragBtn
                                                                            handleEdit={() => handleEditBlock({ dragId: childItem?.droppedId })}
                                                                            handleDelete={() => handleDeleteBlock(childItem?.droppedId)}
                                                                          />
                                                                        </div>
                                                                      )}
                                                                    </Draggable>
                                                                  ))}
                                                                </div>
                                                              )}
                                                            </Droppable>
                                                          </div>
                                                        </div>
                                                        <div>
                                                          <h4 className="fs-6 mb-2">{Strings.services}</h4>
                                                          <div className="dashed-wrapper">
                                                            <Droppable key={item?.id} droppableId={item?.id}>
                                                              {(provided) => (
                                                                <div
                                                                  ref={provided.innerRef}
                                                                  {...provided.droppableProps}
                                                                  // className="border"
                                                                  style={{ minHeight: 100 }}
                                                                // isDraggingOver={snapshot.isDraggingOver}
                                                                // className={`dnd-wrapper dnd-wrapper-container ${lists[list].length ? "active" : ""}`}
                                                                >
                                                                  {provided.placeholder}

                                                                  {item?.service?.map((childItem, cIndex) => (
                                                                    <Draggable
                                                                      key={childItem?.droppedId}
                                                                      draggableId={childItem?.droppedId}
                                                                      index={cIndex}
                                                                    >
                                                                      {(provided) => (
                                                                        <div
                                                                          ref={provided.innerRef}
                                                                          {...provided.draggableProps}
                                                                          // data-is-dragging={snapshot.isDragging}
                                                                          {...provided.dragHandleProps}
                                                                        >
                                                                          <EventServiceCard
                                                                            title={childItem.serviceName}
                                                                            chipsTitle={childItem?.serviceType}
                                                                            editIcon
                                                                            trashIcon
                                                                            description={childItem.description}
                                                                            internalCost={childItem?.internalCost}
                                                                            externalCost={childItem?.externalCost}
                                                                            supplierName={childItem?.supplierName}
                                                                            handleDelete={() => handleDeleteService(childItem?.droppedId)}
                                                                            handleEdit={() => handleEditService({ dragId: childItem?.droppedId })}
                                                                            id={childItem?.id}
                                                                            // dragBtn
                                                                            pricePerPerson={childItem?.pricePerPerson}
                                                                            participants={itineraryData?.participants}
                                                                          />
                                                                        </div>
                                                                      )}
                                                                    </Draggable>
                                                                  ))}
                                                                </div>
                                                              )}
                                                            </Droppable>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </Accordion.Body>
                                                  </Accordion.Item>
                                                </Accordion>
                                              </div>
                                            )}
                                          </Draggable>
                                        </>
                                      ))
                                    ) : provided?.placeholder ? (
                                      <DndUpload title={Strings.event_drag_title} image={iconDndUpload} />
                                    ) : null}
                                  </div>
                                )}
                              </Droppable>
                            </div>
                          </div>
                        </Col>
                        <Col lg={5} className="itinerary-add-right">
                          {stepTitle2 && (
                            <div className="mb-12">
                              <Heading title={stepTitle2} variant="small" />
                            </div>
                          )}
                          <div className="dnd-wrapper">
                            <div className="tabs-list position-relative">
                              <Tabs
                                defaultActiveKey="event"
                                id="profile-tabs"
                                activeKey={key}
                                onSelect={(k) => setKey1(k)}
                                className="itinerary-tabs"
                              >
                                <Tab eventKey="event" title="Event">
                                  <div className="search-box flex-between gap-3 mb-20">
                                    <SearchBox
                                      placeholder={Strings.search_here}
                                      handleSearch={(e) => {
                                        setEventFilter((prev) => ({
                                          ...prev,
                                          search: e,
                                        }));
                                      }}
                                    />
                                    <div className="search-box-select">
                                      <CustomSelect
                                        onChange={(e, option) => {
                                          setEventFilter((prev) => ({
                                            ...prev,
                                            search: option.action === "clear" ? "" : e?.regionName,
                                          }));
                                        }}
                                        options={regionList!}
                                        getOptionLabel={(option: any) => option?.regionName}
                                        getOptionValue={(option: any) => option?.regionName}
                                        placeholder={Strings.select_region}
                                        isClearable
                                      />
                                    </div>
                                  </div>
                                  <Droppable droppableId="EventItems" isDropDisabled={true}>
                                    {(provided, snapshot) => (
                                      <div ref={provided.innerRef} data-is-dragging-over={snapshot.isDraggingOver}>
                                        {provided.placeholder}

                                        <div className="dnd-wrapper-scroll">
                                          {EventItems?.events?.map((item, index) => (
                                            <>
                                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                                {(provided, snapshot) => (
                                                  <div
                                                    ref={provided.innerRef}
                                                    {...provided.dragHandleProps}
                                                    data-is-dragging={snapshot.isDragging}
                                                    {...provided.draggableProps}
                                                  >
                                                    <AgentCard
                                                      title={item?.eventTitle}
                                                      description={item?.notes}
                                                      eventDay={item?.eventDay}
                                                      region={item?.region}
                                                      blockCount={item?.block?.length || 0}
                                                      serviceCount={item?.service?.length || 0}
                                                      service={item?.service}
                                                      dragBtn
                                                      chipsIcon
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
                                </Tab>
                                <Tab eventKey="block" title="Block">
                                  <div className="search-box flex-between gap-3 mb-20">
                                    <SearchBox
                                      placeholder={Strings.search_here}
                                      handleSearch={(e) => {
                                        setBlockFilter((prev) => ({
                                          ...prev,
                                          search: e,
                                        }));
                                      }}
                                    />
                                    {/* <div className="search-box-select">
                                  <CustomSelect
                                    defaultValue={selectedOption}
                                    onChange={setSelectedOption}
                                    options={options}
                                    placeholder="Service Type"
                                  />
                                </div> */}
                                  </div>
                                  <Droppable droppableId="BlockItems" isDropDisabled={true}>
                                    {(provided, snapshot) => (
                                      <div ref={provided.innerRef} data-is-dragging-over={snapshot.isDraggingOver}>
                                        {provided.placeholder}

                                        <div className="dnd-wrapper-scroll">
                                          {BlockItems?.blocks?.map((item, index) => (
                                            <>
                                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                                {(provided, snapshot) => (
                                                  <div
                                                    ref={provided.innerRef}
                                                    {...provided.dragHandleProps}
                                                    data-is-dragging={snapshot.isDragging}
                                                    {...provided.draggableProps}
                                                  >
                                                    <EventBlockCard
                                                      title={item.blockName}
                                                      description={item.description}
                                                      image={item.image || defaultImage}
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
                                </Tab>
                                <Tab eventKey="service" title="Service">
                                  <div className="search-box flex-between gap-3 mb-20">
                                    <SearchBox
                                      placeholder={Strings.search_here}
                                      handleSearch={(e) => {
                                        setServiceFilter((prev) => ({
                                          ...prev,
                                          search: e,
                                        }));
                                      }}
                                    />
                                    {/* <div className="search-box-select">
                                    <CustomSelect
                                      defaultValue={selectedOption}
                                      onChange={setSelectedOption}
                                      options={options}
                                      placeholder={Strings.service_type}
                                    />
                                  </div> */}
                                  </div>
                                  <Droppable droppableId="ServiceItems" isDropDisabled={true}>
                                    {(provided, snapshot) => (
                                      <div ref={provided.innerRef} data-is-dragging-over={snapshot.isDraggingOver}>
                                        {provided.placeholder}

                                        <div className="dnd-wrapper-scroll">
                                          {ServiceItems?.services?.map((item, index) => (
                                            <>
                                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                                {(provided, snapshot) => (
                                                  <div
                                                    ref={provided.innerRef}
                                                    {...provided.dragHandleProps}
                                                    data-is-dragging={snapshot.isDragging}
                                                    {...provided.draggableProps}
                                                  >
                                                    <EventServiceCard
                                                      description={item.description}
                                                      title={item.serviceName}
                                                      isDragging={snapshot.isDragging}
                                                      chipsTitle={item?.serviceType}
                                                      internalCost={item?.internalCost}
                                                      externalCost={item?.externalCost}
                                                      supplierName={item?.supplierName}
                                                      id={item?.id}
                                                      btnIcon
                                                      pricePerPerson={item?.pricePerPerson}
                                                      participants={itineraryData?.participants}
                                                    />
                                                  </div>
                                                )}
                                              </Draggable>
                                            </>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </Droppable>{" "}
                                </Tab>
                              </Tabs>
                              <div className="event-btn">
                                {key === "event" ? (
                                  <Button variant="outline" title={Strings.event_add_new} onClick={eventModalHandler} />
                                ) : key === "block" ? (
                                  <Button variant="outline" title={Strings.block_add_new} onClick={blockModalHandler} />
                                ) : key === "service" ? (
                                  <Button variant="outline" title={Strings.service_add_new} onClick={serviceModalHandler} />
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </DragDropContext>
                  </Tab>
                ))}
            </Tabs>
          </div>
        </div>
      </div>
      <ItineraryModal toggle={costHandler} isShowing={editCost} itineraryCost={itineraryCost} setItineraryCost={setItineraryCost} />
      <ItineraryModalAddEvent
        eventModalCloseHandler={eventModalCloseHandler}
        isShowing={addEventModal}
        updateEventDraggedList={updateEventDraggedList}
        eventData={eventData}
        eventId={eventId}
      />
      <ItineraryModalAddBlock
        updateBlockDraggedList={updateBlockDraggedList}
        blockModalCloseHandler={blockModalCloseHandler}
        isShowing={addBlockModal}
        blockData={blockData}
        blockId={blockId}
      />

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
export type ItineraryStep2Type = {
  showCost?: boolean;
  showVersion?: boolean;
  stepTitle1?: string;
  stepTitle2?: string;
  setK: React.SetStateAction<{ step1: boolean; step2: boolean; step3: boolean }>;
  k: { step1: boolean; step2: boolean; step3: boolean };
  setKey: React.SetStateAction<string>;
};
export default ItineraryStep2;
