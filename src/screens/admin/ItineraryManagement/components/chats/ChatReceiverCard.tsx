import { VNode } from "preact";
import React from "react";

const ChatReceiverCard = ({
  children,
  className="",
}: ChatReceiverCardProps): VNode<any> => {
  return <div className={`chat-card ${className}`}>{children}</div>;
};
type ChatReceiverCardProps = {
  children?: any;
  className?: string;
};
export default ChatReceiverCard;
