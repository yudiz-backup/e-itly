import React from "react";
import { VNode } from "preact";
import { Modal } from "react-bootstrap";

// component
import { Strings } from "src/resources";

const EventServiceModal = ({
  isShowing,
  toggle,
  data,
}: ServiceModalProps): VNode<any> => {

  return (
    <Modal
      show={isShowing}
      onHide={toggle}
      centered
      size="lg"
      className="aves-details-modal"
    >
      <Modal.Header closeButton />
      <div>
        <Modal.Title>{data?.serviceName}</Modal.Title>
        <Modal.Body className="pb-0 pt-24">
          <div className="mb-24">
            <ul className="flex-between flex-wrap">
              <li>
                <span>{Strings.service_type}</span>
                <h6>{data?.serviceType}</h6>
              </li>
              <li>
                <span>{Strings.supplier_label}</span>
                <h6>{data?.supplierName}</h6>
              </li>
              <li>
                <span>{Strings.region}</span>
                <h6>{data?.region}</h6>
              </li>
              <li>
                <span>{Strings.external_cost_label}</span>
                <h6>{Strings.euro}{data?.externalCost}</h6>
              </li>
              <li>
                <span>{Strings.internal_cost_label}</span>
                <h6>{Strings.euro}{data?.internalCost}</h6>
              </li>
            </ul>
          </div>
          <div className="aves-details-modal-content">
            <h3>{Strings.description}</h3>
            <p>
              {data?.description}
            </p>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};
type ServiceModalProps = {
  isShowing: boolean;
  toggle: () => void;
  data: {
    serviceName: string;
    serviceType: string;
    supplierName: string;
    region: string;
    externalCost: string;
    internalCost: string;
    description: string;
  };
};

export default EventServiceModal;
