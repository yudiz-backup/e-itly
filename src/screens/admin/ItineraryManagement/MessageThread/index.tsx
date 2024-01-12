import React, { useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import ScrollArea from "react-scrollbar";
import { toast } from "react-toastify";

// component
import ChatSendInput from "../components/chats/ChatSendInput";
import TableHeader from "src/components/TableHeader";
import ChatItem from "../components/chats/ChatItem";
import ChatCard from "../components/chats/ChatCard";
import BGWrapper from "src/components/BGWrapper";
import Heading from "src/components/Heading";
import Button from "src/components/Button";

// query
import { getMessage, getMessageThread } from "src/Query/Message/message.query";
import { addMessage } from "src/Query/Message/message.mutation";
import queryClient from "src/queryClient";

import { iconRefresh, imgUser } from "src/assets/images";

import { allRoutes } from "src/constants/AllRoutes";
import { hasError } from "src/services/ApiHelpers";
import { formatTimestamp } from "src/utils/date";
import { Strings } from "src/resources";
import "./chat.scss";

const MessageThread = () => {

  const refTime = useRef(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const threadIdParams = queryParams.get("threadId");

  const [messageChatData, setMessageChatData] = useState(null)
  const [ThreadData, setThreadData] = useState(null);
  const [chatActive, setChatActive] = useState("");
  const [threadFilter, setThreadFilter] = useState({
    search: "",
  });

  const [messageFilter, setMessageFilter] = useState({
    threadId: threadIdParams,
  })

  // get Message Threads
  const { data } = useQuery({
    queryKey: ["getThread", threadFilter],
    queryFn: () => getMessageThread(threadFilter),
    select: (data) => data?.data,
    onSuccess: (data) => {
      if (threadIdParams) {
        const result = (data?.messageThreads?.find((item => item?.id === threadIdParams)))      
        setThreadData(result)
      }
    }
  });

  // get Message Chat
  const { data: messageChat, isFetching } = useQuery({
    queryKey: ["getThreadChat", messageFilter],
    queryFn: () => getMessage(messageFilter),
    select: (data) => data?.data,
    staleTime: 0,
    enabled: !!(ThreadData || threadIdParams),
    onSuccess: (data) => {
      setMessageChatData((prev) => [
        ...(prev?.length ? prev : []),
        ...(data?.messages?.length ? data.messages : []),
      ])
    }
  })

  //add Thread Message
  const addMessageMutation = useMutation(addMessage, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getThreadChat"]);
      handleRefresh()
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

  const handleSearch = (search: string) => {
    setThreadFilter({
      search: search,
    });
  };

  function handleClick(data) {
    setChatActive(data?.id);
    setThreadData(data);
    setMessageChatData(null)
    setMessageFilter({
      threadId: data?.id || threadIdParams,
    })
    refTime.current = null
  }


  function handleScrollFetch(target) {
    const result = target?.containerHeight + target?.topPosition >= target?.realHeight;

    if (result && messageChat?.nextStartAfterDocId && !isFetching) {
      setMessageFilter((prev) => ({
        ...prev,
        nextStartAfterDocId: messageChat?.nextStartAfterDocId,
      }))
    }
    refTime.current = null
  }

  function handleRefresh() {
    setMessageChatData(null)
    setMessageFilter({
      threadId: (ThreadData?.id || threadIdParams),
    })
    queryClient.invalidateQueries(["getThreadChat"]);
  }

  const handleSend = ({
    message,
    files,
  }: {
    message: string;
    files: File[];
  }) => {
    const newMessage = new FormData();

    newMessage.append("type", "Thread");
    newMessage.append("agentId", ThreadData?.agentId);
    newMessage.append("threadId", ThreadData?.id);
    newMessage.append("message", message);

    files.forEach((file) => {
      newMessage.append("attachment", file);
    });

    addMessageMutation.mutate(newMessage);
  };

  return (
    <section className="chat">
      <TableHeader
        title={Strings.message_thread}
        searchBox
        searchBoxPlaceholder={Strings.search_here}
        handleSearch={handleSearch}
        addBtn={Strings.new_message}
        addBtnPath={allRoutes.itinerarySendMessage}
      />

      <Row>
        <Col xxl={3} xl={4} lg={5}>
          <div className="chat-wrapper-list">
            <ScrollArea>
              <ChatItem
                data={data?.messageThreads}
                handleClick={handleClick}
                chatActive={chatActive}
              />
            </ScrollArea>
          </div>
        </Col>
        <Col xxl={9} xl={8} lg={7}>
          {messageChatData ? (
            <div className="chat-wrapper">
              <BGWrapper>
                <div>
                  <div className="chat-header">
                    <div className="chat-wrapper-item">
                      <div className="flex-shrink-0">
                        <img src={imgUser} alt="user img" loading="lazy" />
                      </div>
                      <div className="flex-grow-1">
                        <h3 className="username">{(ThreadData?.agentName || (data?.messageThreads?.find((item => item?.id === threadIdParams)))?.agentName)}</h3>
                      </div>

                      <Button icon={iconRefresh} title="" className="refresh-icon" onClick={handleRefresh} />
                    </div>
                  </div>
                  <div className="chat-wrapper-container">
                    <ScrollArea
                      onScroll={handleScrollFetch}
                    >
                      <div className="flex-column d-flex justify-content-end h-100 gap-3">
                        {messageChatData?.map((item) => {
                          const formate = formatTimestamp(item.timestamp, refTime);
                          return <ChatCard key={item.timestamp} chatData={item} formate={formate} />;
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
                <ChatSendInput
                  placeholder={Strings.type_msg}
                  showUploadIcon
                  onSend={handleSend}
                />
              </BGWrapper>
            </div>
          ) : (
            <div className="chat-default">
              <div>
                <Heading title={Strings.you_can_message_here} />
              </div>
            </div>
          )}
        </Col>
      </Row>
    </section>
  );
};

export default MessageThread;
