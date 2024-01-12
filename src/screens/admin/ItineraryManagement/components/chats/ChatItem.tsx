import React from "react";
import { VNode } from "preact";
import { imgUser } from "src/assets/images";

const ChatItem = ({
  data,
  chatActive,
  handleClick,
}: ChatItemPropsType): VNode<any> => {
  return (
    <>
      {
        data?.map((item, index) => {
          return (
            <div
              key={index}
              className={`chat-wrapper-item ${chatActive === item?.id ? "active" : ""}`}
              onClick={() => handleClick(item)}
            >
              <div className="flex-shrink-0">
                <img src={item?.img || imgUser} alt="user img" loading="lazy" />
              </div>
              <div className="flex-grow-1">
                <h3 className="username">{item?.agentName}</h3>
              </div>
            </div>
          )
        })
      }
    </>
  );
};
type ChatItemPropsType = {
  data: {
    agentName: string;
    id: string;
    img: string;
  }[],
  chatActive: string;
  handleClick: (item) => void
}
export default ChatItem;
