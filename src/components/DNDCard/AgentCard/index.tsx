import { VNode } from "preact";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import {
  SvgPenToEdit,
  SvgTrash,
  iconBriefcaseBlank,
  iconDots,
  iconEnvelope,
} from "src/assets/images";
import Chips from "src/components/Chips";
import { Strings } from "src/resources";
import { truncateAndRemoveImages } from "src/utils";

const AgentCard = ({
  email,
  title,
  isDragging,
  address,
  editIcon,
  trashIcon,
  dragBtn,
  description,
  chipsIcon,
  handleEdit,
  handleDelete,
  eventDay,
  region,
  blockCount,
  serviceCount,
  service
}: AgentCardProps): VNode<any> => {
  const [totalExternalCost, setTotalExternalCost] = useState(0)
  useEffect(() => {
    if (service?.length) {
      const totalExternalCost = service?.reduce((total, item) => {
        const externalCost = typeof item.externalCost === 'string'
          ? parseFloat(item.externalCost)
          : item.externalCost;

        return total + externalCost;
      }, 0);
      setTotalExternalCost(totalExternalCost)
    }

  }, [service])

  return (
    <Card className={`dnd-card dnd-card-agent ${isDragging ? "active" : ""}`}>
      <Card.Body className="pt-0">
        <Card.Title>{title}</Card.Title>
        {description && (
          <Card.Text
            dangerouslySetInnerHTML={{ __html: truncateAndRemoveImages(description, 300) }} />
        )}
        {email && (
          <Card.Text>
            <img src={iconEnvelope} alt="emailIcon" /> {email}{" "}
          </Card.Text>
        )}

        {address && (
          <Card.Text>
            <img src={iconBriefcaseBlank} alt="iconBriefcase" />
            {address}
          </Card.Text>
        )}
      </Card.Body>
      {chipsIcon && (
        <div className="chips-spacing">
          <Chips title={`${eventDay} ${Strings.day}`} size="medium" />
          <Chips title={region} size="medium" />
          <Chips title={`${blockCount} ${Strings.blocks}`} size="medium" />
          <Chips title={`${serviceCount} ${Strings.services}`} size="medium" />
          <Chips title={Strings.euro + totalExternalCost.toString()} size="medium" />
        </div>
      )}
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
      </div>
      {dragBtn && (
        <div className="btn-drag">
          <img src={iconDots} alt="icon" />
        </div>
      )}
    </Card>
  );
};
type AgentCardProps = {
  title: string;
  email?: string;
  address?: string;
  isDragging?: boolean;
  editIcon?: boolean;
  dragBtn?: boolean;
  trashIcon?: boolean;
  description?: string;
  chipsIcon?: boolean;
  handleEdit?: () => void;
  handleDelete?: () => void;
  eventDay?: string;
  region?: string;
  serviceCount?: string;
  blockCount?: string;
  service?: any
};
export default AgentCard;
