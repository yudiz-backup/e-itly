import React from "react";
import { VNode } from "preact";
import { Modal } from "react-bootstrap";

const EventBlockModal = ({
  isShowing,
  toggle,
  data,
}: BlockModalProps): VNode<any> => {
  return (
    <Modal
      show={isShowing}
      onHide={toggle}
      centered
      size="xl"
      className="block-modal"
    >
      <Modal.Header closeButton />
      <Modal.Body className="pb-0">
        <Modal.Title>{data?.blockName}</Modal.Title>
        <div className="d-flex gap-3 flex-column flex-lg-row">
          <div className="block-modal-img">
            {data?.image && <img src={data?.image} alt="1" />}
          </div>
          <div className="block-modal-content"
            dangerouslySetInnerHTML={{
              __html: data?.description || '',
            }}>

          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
type BlockModalProps = {
  isShowing: boolean;
  toggle: () => void;
  data: {
    image: string;
    blockName: string;
    description: string;
  };
};

export default EventBlockModal;
