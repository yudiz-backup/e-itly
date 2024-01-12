import React from "react";
import { Card } from "react-bootstrap";
import "./form-card.scss";
import { VNode } from "preact";
const FormCard = ({
  title,
  fullWidth,
  description,
  direction = "column",
}: FormCardProps): VNode<any> => {
  return (
    <div className="form-card">
      <Card className={`${fullWidth ? "w-100" : ""} flex-${direction}`}>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card>
    </div>
  );
};
type FormCardProps = {
  title: string;
  description: string;
  fullWidth?: boolean;
  direction?: "row" | "column";
};
export default FormCard;
