/* eslint-disable react/no-unknown-property */
// @ts-nocheck
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import AgentCard from "src/components/DNDCard/AgentCard";

const EventDNDBlockList = ({ ...props }: any) => {
  function renderHeaderText(type) {
    switch (type) {
      case "eventList":
        return "Events";
      case "serviceList":
        return "Services";
      case "blockList":
        return "Blocks";
      default:
        return "";
    }
  }
  return (
    <Draggable key={props.id} draggableId={props.id} index={props.index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          data-is-dragging={snapshot.isDragging}
          {...provided.dragHandleProps}
        >
            <div className='mb-4'>

          <h4 className="fs-6 mb-2">{renderHeaderText(props.type)}</h4>

          {props?.children?.map((item, index) => (
            <AgentCard
              key={index}
              description={item?.description}
              title={item?.title}
              chipsIcon
              isDragging={snapshot.isDragging}
            />
          ))}
        </div>
            </div>
      )}
    </Draggable>
  );
};

export default EventDNDBlockList;
