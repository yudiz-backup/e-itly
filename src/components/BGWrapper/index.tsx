import { VNode } from "preact";
import React from "react";

const BGWrapper = ({ children, className }: BGWrapperProps): VNode<any> => {
  return <div className={`bg-wrapper ${className}`}>{children}</div>;
};
type BGWrapperProps = {
  children: any;
  className?: string;
};
export default BGWrapper;
