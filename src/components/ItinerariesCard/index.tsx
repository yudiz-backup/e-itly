import React from "react";
import { VNode } from "preact";
import { Card } from "react-bootstrap";
import "./itineraries-card.scss";
const ItinerariesCard = ({
  title,
  number,
  icon,
  color,
  shape
}: CardProps): VNode => {
  return (
    <div className={`itineraries bg-${color}`}>
      <Card>
        <Card.Header>
          <img src={icon} alt={title} />
        </Card.Header>
        <Card.Body>
          <Card.Title>{number}</Card.Title>
          <Card.Text>{title} </Card.Text>
        </Card.Body>
        <img src={shape} className='shape' alt="shape" />
      </Card>
    </div>
  );
};
type CardProps = {
  title: string;
  color: string;
  icon: string;
  number: number;
  shape?: string;
};

export default ItinerariesCard;
