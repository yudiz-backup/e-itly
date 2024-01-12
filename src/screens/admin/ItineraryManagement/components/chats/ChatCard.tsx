import React from "react";
import ChatSenderCard from "./ChatSenderCard";
import ChatDocumentCard from "./ChatDocumentCard";
import ChatReceiverCard from "./ChatReceiverCard";

function ChatCard({ chatData, formate, className = "" }: ChatCardPropsType) {
  return (
    <>
      {chatData?.isSender ? (
        <ChatSenderCard className={`chat-sender-block ${className}`}>
          <ChatDocumentCard
            documentData={chatData}
            className="sender"
            formate={formate}
          />
        </ChatSenderCard>
      ) : (
        <ChatReceiverCard className={`chat-sender-receiver ${className}`}>
          <ChatDocumentCard
            documentData={chatData}
            className="receiver"
            formate={formate}
          />
        </ChatReceiverCard>
      )}
    </>
  );
}

type ChatCardPropsType = {
  className?: string,
  chatData: {
    message: string;
    createdAt: string;
    attachments: string[];
    isSender: boolean;
    senderName?: string;
  };
  formate?: string;
};

export default ChatCard;
