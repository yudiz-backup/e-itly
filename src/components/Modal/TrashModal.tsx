import React from "react";
import { VNode } from "preact";
import { Modal } from "react-bootstrap";

// component
import Button from "../Button";
import { Strings } from "src/resources";

const TrashModal = ({
  trashModal,
  handleCLoseTrashModal,
  handleDeleteData,
  disabled,
  title,
  body,
}: TrashModalProps): VNode<any> => {
  return (
    <Modal show={trashModal} onHide={() => handleCLoseTrashModal()} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline"
          title={Strings.close}
          onClick={() => {
            handleCLoseTrashModal();
          }}
          fullWidth
        />
        <Button
          variant="primary"
          title={Strings.delete}
          onClick={() => {
            handleDeleteData();
          }}
          fullWidth
          disabled={disabled}
        />
      </Modal.Footer>
    </Modal>
  );
};

type TrashModalProps = {
  title?: string;
  body?: string;
  disabled?: boolean;
  trashModal: boolean;
  handleCLoseTrashModal: () => void;
  handleDeleteData: () => void;
};
export default TrashModal;