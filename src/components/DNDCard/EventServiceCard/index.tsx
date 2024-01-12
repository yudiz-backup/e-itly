import { VNode } from "preact";
import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  SvgRoundedMessage,
  SvgPenToEdit,
  SvgTrash,
  iconDots,
  iconRedirect,
} from "src/assets/images";
import Chips from "src/components/Chips";
import CommentThreadModal from "src/components/Modal/CommentThreadModal";
import { allRoutes } from "src/constants/AllRoutes";
import useModal from "src/hooks/useModal";
import { Strings } from "src/resources";
import { truncateAndRemoveImages } from "src/utils";

const EventServiceCard = ({
  description,
  title,
  chipsTitle,
  editIcon,
  trashIcon,
  isDragging,
  messageIcon,
  btnIcon,
  supplierName,
  internalCost,
  externalCost,
  handleEdit,
  handleDelete,
  pricePerPerson,
  participants,
  redirectBtn,
  state,
  service
}: EventServiceCardProps): VNode<any> => {
  const { toggle, isShowing } = useModal();
  const navigate = useNavigate();
  return (
    <>
      <Card
        className={`dnd-card dnd-service-card ${isDragging ? "active" : ""}`}
      >
        <Card.Header className="flex-between align-items-start">
          <div className="d-flex align-items-center gap-3 justify-content-between flex-wrap">
            <Card.Title>{title}</Card.Title>
            <Chips title={chipsTitle} size="medium" />
          </div>
          {redirectBtn && (
            <button
              onClick={() => navigate(`${allRoutes.itineraryAddServiceSchedule}?eventId=${service?.event}&day=${service?.day}&serviceId=${service?.id}`, { state: state })}

            >
              <img src={iconRedirect} alt="" />
            </button>
          )}
          {btnIcon && (
            <div className="btn-drag position-relative end-0">
              <img src={iconDots} alt="dotsIcon" />
            </div>
          )}
        </Card.Header>
        <Card.Body>
          <Card.Text dangerouslySetInnerHTML={{ __html: truncateAndRemoveImages(description, 30) }} />
        </Card.Body>
        <ul className='service-cards'>
          <li>
            <h6>{Strings.internal_cost_label}</h6>
            <span>{Strings.euro}{internalCost}</span>
          </li>
          <li>
            <h6>{Strings.external_cost_label}</h6>
            <span>{Strings.euro}{externalCost}</span>
          </li>
          <li>
            <h6>{Strings.total_cost}</h6>
            <span>{Strings.euro}{pricePerPerson === true ? Number(externalCost) * Number(participants) : externalCost}</span>
          </li>
          <li>
            <h6>{Strings.supplier_label}</h6>
            <span>{supplierName}</span>
          </li>
        </ul>
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
            <button onClick={toggle}>
              <SvgRoundedMessage />
            </button>
          )}
        </div>
        {/* {btnIcon && (
          <div className="btn-drag">
            <img src={iconDots} alt="dotsIcon" />
          </div>
        )} */}
      </Card>
      <CommentThreadModal toggle={toggle} isShowing={isShowing} title={title} chipsTitle={chipsTitle} description={description}
        internalCost={internalCost}
        externalCost={externalCost}
        supplierName={supplierName}
      />
    </>
  );
};
type EventServiceCardProps = {
  title: string;
  description: string;
  isDragging?: boolean;
  chipsTitle: string;
  editIcon?: boolean;
  trashIcon?: boolean;
  btnIcon?: boolean;
  messageIcon?: boolean;
  externalCost?: string;
  internalCost?: string;
  supplierName?: string;
  id?: string;
  handleEdit?: () => void;
  handleDelete?: () => void;
  pricePerPerson?: boolean,
  participants?: string,
  redirectBtn?: boolean,
  state?: any,
  service?: any
};
export default EventServiceCard;
