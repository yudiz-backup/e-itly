import React, { useCallback, useMemo, useRef } from "react";
import { Modal } from "react-bootstrap";
import { VNode } from "preact";

// component
import Button from "../Button";
import TextField from "../TextField";
import { Strings } from "src/resources";

const ItineraryModal = ({
  isShowing,
  toggle,
  itineraryCost,
  setItineraryCost
}: ItineraryModalProps): VNode<any> => {

  const editedCostRef = useRef(0);
  const handleToggle = useMemo(() => toggle, [toggle]);
  const handleSave = useCallback(() => {
    handleToggle();
    setItineraryCost((prevState: any) => ({
      ...prevState,
      editedCost: editedCostRef.current
    }));
  }, [handleToggle, setItineraryCost]);

  return (
    <Modal show={isShowing} onHide={toggle} centered>
      <Modal.Header closeButton>
        <Modal.Title>{Strings.total_and_internal_cost}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <TextField label={Strings.total_cost}
          name="name"
          value={itineraryCost?.editedCost ? itineraryCost.editedCost : itineraryCost?.externalCost ? itineraryCost.externalCost : 0}
          type="number"
          onChange={(newValue: string) => editedCostRef.current = Number(newValue)
          }
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" title={Strings.cancel} onClick={toggle} fullWidth />
        <Button variant="primary" title={Strings.save} onClick={handleSave} fullWidth />
      </Modal.Footer>
    </Modal>
  );
};

type ItineraryModalProps = {
  isShowing: boolean;
  toggle: () => void;
  itineraryCost: {
    editedCost?: string;
    externalCost: number;
  },
  setItineraryCost: (data: any) => void
};

export default ItineraryModal;
