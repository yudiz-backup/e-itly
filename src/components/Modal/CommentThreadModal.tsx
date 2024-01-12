import React from "react";
import { VNode } from "preact";
import { Modal } from "react-bootstrap";
import EventServiceCard from "../DNDCard/EventServiceCard";
import ChatSendInput from "src/screens/admin/ItineraryManagement/components/chats/ChatSendInput";
import ChatReceiverCard from "src/screens/admin/ItineraryManagement/components/chats/ChatReceiverCard";
import ChatSenderCard from "src/screens/admin/ItineraryManagement/components/chats/ChatSenderCard";
import { Strings } from "src/resources";

const CommentThreadModal = ({
  isShowing,
  toggle,
  title,
  chipsTitle,
  description,
  internalCost,
  externalCost,
  supplierName,
}: CommentThreadModalProps): VNode<any> => {

  function handleSend() {

  }
  return (
    <Modal
      show={isShowing}
      onHide={toggle}
      centered
      className="comment-thread-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{Strings.comment_thread}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EventServiceCard
          title={title}
          description={description}
          chipsTitle={chipsTitle}
          internalCost={internalCost}
          externalCost={externalCost}
          supplierName={supplierName}
        // editIcon
        // trashIcon
        />
      </Modal.Body>
      <Modal.Footer>
        <div>
          <h5>Peter Fark</h5>
          <div className="flex-column d-flex justify-content-end h-100 gap-3 mb-4">
            <ChatReceiverCard>
              <div className="chat-card-receiver">
                <p>
                  Dummy: Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </ChatReceiverCard>
            <ChatSenderCard className="align-self-end">
              <div className="chat-card-sender">
                <p>
                  Dummy Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </ChatSenderCard>
          </div>
          <ChatSendInput placeholder={Strings.add_comments_placeholder} onSend={handleSend} />
        </div>
      </Modal.Footer>
    </Modal>
  );
};
type CommentThreadModalProps = {
  isShowing: boolean;
  toggle: () => void;
  title?: string;
  chipsTitle?: string;
  description?: string;
  internalCost?: string;
  externalCost?: string;
  supplierName?: string;
};
export default CommentThreadModal;
