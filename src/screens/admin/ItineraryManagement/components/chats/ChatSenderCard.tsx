import { VNode } from "preact";
import React from "react";

const ChatSenderCard = ({
  children,
  className="",
}: ChatSenderCardProps): VNode<any> => {
  return <div className={`chat-card ${className}`}>{children}</div>;
};
type ChatSenderCardProps = {
  children?: any;
  className?: string;
};
export default ChatSenderCard;
