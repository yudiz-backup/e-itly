import { VNode } from "preact";
import React from "react";
import "./heading.scss";

function Heading({
  className = "",
  title,
  variant = "large",
}: HeadingProps): VNode<any> {
  return <h2 className={`heading heading-${variant} ${className}`}>{title}</h2>;
}
type HeadingProps = {
  title: string;
  className?: string;
  variant?: "medium" | "large" | "small";
};

export default Heading;
