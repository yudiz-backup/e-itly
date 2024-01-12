/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
// @ts-nocheck
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useQuery } from "@tanstack/react-query";
import { Col, Row } from "react-bootstrap";
import { v4 as uuid } from "uuid";

// component
import ItineraryModalAddBlock from "../../ItineraryManagement/components/ItineraryModalAddBlock";
import EventBlockCard from "src/components/DNDCard/EventBlockCard";
import SearchBox from "src/components/SearchBox";
import DndUpload from "src/components/DndUpload";
import Heading from "src/components/Heading";
import Button from "src/components/Button";

// query
import { fetchMultipleImageUrl } from "src/services/UserService";
import { getBlock } from "src/Query/Block/block.query";

import { iconDndUpload, defaultImage } from "src/assets/images";
import { Strings } from "src/resources";


const reorder = (list: Iterable<unknown> | ArrayLike<unknown>, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const copy = (source: Iterable<unknown> | ArrayLike<unknown>, destination: Iterable<unknown> | ArrayLike<unknown>, droppableSource: { index: string | number; }, droppableDestination: { index: number; }) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const item: any = sourceClone[droppableSource.index];

  // const findCopyBlock: any = destClone?.find((e: any) => e?.id == item?.id);
  // if (findCopyBlock?.id) {
  //   toast.error("Block already exists.");
  // } else {
  destClone.splice(droppableDestination.index, 0, {
    ...item,
    dropeedId: uuid(),
  });
  // }
  return destClone;
};

const move = (source: Iterable<unknown> | ArrayLike<unknown>, destination: Iterable<unknown> | ArrayLike<unknown>, droppableSource: { index: number; droppableId: string | number; }, droppableDestination: { index: number; droppableId: string | number; }) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const EventBlock = ({ blockDraggedList, setBlockDraggedList }) => {


  const [addBlockModal, setAddBlockModal] = useState(false);
  const [blockId, setBlockId] = useState<{ dragId?: string, }>({ dragId: '' })
  const [blockData, setBlockData] = useState()

  const [blockFilter, setBlockFilter] = useState<BlocksFilterType>({
    limit: 100,
    search: "",
    isActive: true,
  });

  // get Block List
  const { data: blockList } = useQuery({
    queryKey: ["getBlock", blockFilter],
    queryFn: () => getBlock(blockFilter),
    select: (data) => data?.data,
  });

  const onDragEnd = (result: { source: any; destination: any; }) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    switch (source.droppableId) {
      case destination.droppableId:
        setBlockDraggedList((prevLists: { [x: string]: any; }) => ({
          ...prevLists,
          [destination.droppableId]: reorder(
            prevLists[source.droppableId],
            source.index,
            destination.index
          ),
        }));
        break;
      case "ITEMS":
        setBlockDraggedList((prevLists: { [x: string]: any; }) => ({
          ...prevLists,
          [destination.droppableId]: copy(
            blockList?.blocks,
            prevLists[destination.droppableId],
            source,
            destination
          ),
        }));
        break;
      default:
        setBlockDraggedList((prevLists: { [x: string]: any; }) =>
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

  function blockModalOpenHandler() {
    setAddBlockModal(true);
  }
  function blockModalCloseHandler() {
    setAddBlockModal(false);
    setBlockId({ dragId: '' })
    setBlockData(null)
  }

  const handleSearch = (e: string) => {
    setBlockFilter((prev) => ({
      ...prev,
      search: e,
    }));
  };

  function handleDelete(id: string) {
    const dynamicData = { ...blockDraggedList };
    for (const key in dynamicData) {
      const index = dynamicData[key].findIndex((item: { dropeedId: string; }) => item.dropeedId === id);
      if (index !== -1) {
        dynamicData[key].splice(index, 1);
      }
    }
    setBlockDraggedList(dynamicData)
  }

  function handleEdit({ dragId }) {
    const updatedBlockDraggedList = { ...blockDraggedList };

    for (const key in updatedBlockDraggedList) {
      const filterBlock = updatedBlockDraggedList[key].find((item) => item?.dropeedId === dragId);
      if (filterBlock) {
        setBlockData(filterBlock);
        break;
      }
    }
    blockModalOpenHandler()
    setBlockId({
      dragId,
    })
  }

  const updateBlockDraggedList = async ({ formData, blockId }) => {

    const newData: UnknownObject = {}
    for (const pair of formData.entries()) {
      newData[pair[0]] = pair[1]
    }

    const formEntry = new FormData()
    formEntry.append("image", newData?.blockImage)
    const blockImageUpload: AsyncResponseType = await fetchMultipleImageUrl(
      formEntry
    );

    let updatedObject = { ...newData }
    if (blockImageUpload?.success && blockImageUpload?.data?.length) {
      updatedObject = { ...newData, image: blockImageUpload?.data[0] };
      delete updatedObject.blockImage;
    }

    const updatedBlockDraggedList = { ...blockDraggedList };
    for (const key in updatedBlockDraggedList) {
      const updatedList = updatedBlockDraggedList[key].map((item) => {
        if (item.dropeedId === blockId?.dragId) {
          return {
            ...item,
            ...updatedObject,
          };
        }
        return item;
      });

      updatedBlockDraggedList[key] = updatedList;
    }

    setBlockDraggedList(updatedBlockDraggedList);

    blockModalCloseHandler()

  };

  return (
    <>
      <div className="event-w">
        <DragDropContext onDragEnd={onDragEnd}>
          <Row className="g-3">
            <Col lg={7}>
              <div className="dnd-wrapper">
                <h5 className="mb-3">{Strings.event_block}</h5>
                {Object.keys(blockDraggedList)?.map((list, i) => (
                  <Droppable droppableId={list} key={i}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        // isDraggingOver={snapshot.isDraggingOver}
                        className={`dnd-wrapper-container ${blockDraggedList[list]?.length ? "active" : ""
                          }`}
                      >
                        {blockDraggedList[list]?.length ? (
                          blockDraggedList[list]?.map(
                            (item: any, index: number) => (
                              <Draggable
                                key={item.dropeedId}
                                draggableId={item.dropeedId}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    data-is-dragging={snapshot.isDragging}
                                    {...provided.dragHandleProps}
                                  >
                                    <EventBlockCard
                                      editIcon
                                      trashIcon
                                      image={item?.image || defaultImage}
                                      description={item?.description}
                                      title={item?.blockName}
                                      isDragging={snapshot?.isDragging}
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
                            title={Strings.event_drag_title}
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
                    <Heading title={Strings.block_list} variant="small" />
                    <Button
                      variant="outline"
                      title={Strings.block_add_new}
                      onClick={blockModalOpenHandler}
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
                      {...provided.droppableProps}
                    // isDraggingOver={snapshot.isDraggingOver}
                    >
                      <div className="dnd-wrapper-scroll">
                        {blockList?.blocks?.map((item: { id: string; image: string; description: string; blockName: string; }, index: number) => (
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
                                <EventBlockCard
                                  btnIcon
                                  image={item?.image || defaultImage}
                                  description={item?.description}
                                  title={item?.blockName}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            </Col >
          </Row >
        </DragDropContext >
      </div >
      <ItineraryModalAddBlock
        updateBlockDraggedList={updateBlockDraggedList}
        blockModalCloseHandler={blockModalCloseHandler}
        isShowing={addBlockModal}
        blockData={blockData}
        blockId={blockId}
      />
    </>
  );
};

export default EventBlock;
