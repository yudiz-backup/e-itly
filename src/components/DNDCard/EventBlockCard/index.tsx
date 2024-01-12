import { VNode } from "preact";
import React from "react";
import { Card } from "react-bootstrap";
import {
  SvgPenToEdit,
  SvgRoundedMessage,
  SvgTrash,
  iconDots,
} from "src/assets/images";
import { truncateAndRemoveImages } from "src/utils";

const EventBlockCard = ({
  image,
  description,
  dragBtn,
  title,
  isDragging,
  btnIcon,
  editIcon,
  trashIcon,
  messageIcon,
  handleEdit,
  handleDelete,
}: EventBlockCardProps): VNode<any> => {
  return (
    <Card className={`dnd-card ${isDragging ? "active" : ""}`}>
      <div className="d-flex gap-3">
        <Card.Img variant="top" src={image} alt={title} />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text
            dangerouslySetInnerHTML={{
              __html: truncateAndRemoveImages(description, 50),
            }}
          />
        </Card.Body>
        {dragBtn && (
          <div className="btn-drag">
            <img src={iconDots} alt="icon" />
          </div>
        )}
      </div>
      <div className="dnd-card-actions">
        {editIcon && (
          <button onClick={handleEdit}>
            <SvgPenToEdit size="20" />
          </button>
        )}
        {trashIcon && (
          <button onClick={handleDelete}>
            <SvgTrash size="20" />
          </button>
        )}
        {messageIcon && (
          <button>
            <SvgRoundedMessage />
          </button>
        )}
      </div>
      {btnIcon && (
        <div className="btn-drag">
          <img src={iconDots} alt="icon" />
        </div>
      )}
    </Card>
  );
};
type EventBlockCardProps = {
  title: string;
  image: string;
  description: string;
  isDragging?: boolean;
  dragBtn?: boolean;
  btnIcon?: boolean;
  editIcon?: boolean;
  trashIcon?: boolean;
  messageIcon?: boolean;
  handleEdit?: () => void;
  handleDelete?: () => void;
};
export default EventBlockCard;
