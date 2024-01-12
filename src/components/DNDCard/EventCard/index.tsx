import { VNode } from "preact";
import React from "react";
import { Card } from "react-bootstrap";
import { iconBriefcaseBlank, iconDots, iconEnvelope } from "src/assets/images";

const EventCard = ({
  email,
  title,
  isDragging,
  address,
}: EventCardProps): VNode<any> => {
  return (
    <Card className={`dnd-card dnd-card-agent ${isDragging ? "active" : ""}`}>
      <Card.Body className='pt-0'>
        <Card.Title>{title}</Card.Title>
        <Card.Text><img src={iconEnvelope} alt="EmailIcon" /> {email}</Card.Text>
        <Card.Text><img src={iconBriefcaseBlank} alt="BriefcaseIcon" />{address}</Card.Text>
      </Card.Body>

      <div className="btn-drag">
        <img src={iconDots} alt="DotsIcon" />
      </div>
    </Card>
  );
};
type EventCardProps = {
  title: string;
  email: string;
  address: string;
  description: string;
  isDragging?: boolean;
};
export default EventCard;
