import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Modal } from "react-bootstrap";
import { VNode } from "preact";

// component
import Button from "../Button";

import { downloadPdf } from 'src/screens/admin/ItineraryManagement/helper';
import { allRoutes } from 'src/constants/AllRoutes';
import { iconSuccess } from "src/assets/images";
import { Strings } from "src/resources";
import api from 'src/config/api';

const ItinerarySuccessModal = ({ isShowing, toggle }: SuccessModalProps): VNode<any> => {
  const navigate = useNavigate()

  function handleDownloadItinerary() {
    handleCloseSuccessModal()
    const url = `${import.meta.env.VITE_API_URL}${api.itinerary_module.itinerary_download}/${isShowing?.id}?version=1`;
    downloadPdf(url)
  }

  function handleCloseSuccessModal() {
    toggle()
    navigate(allRoutes.itinerary);
  }

  return (
    <Modal show={isShowing?.open} onHide={handleCloseSuccessModal} centered>
      <Modal.Header closeButton>
        <img src={iconSuccess} alt="SuccessIcon" className='img-fluid' />
      </Modal.Header>
      <Modal.Body className='text-center'>
        <Modal.Title>{Strings.create_itinerary_success}</Modal.Title>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline" title={Strings.close} onClick={handleCloseSuccessModal} fullWidth />
        <Button
          variant="primary"
          title={Strings.itinerary_download}
          onClick={handleDownloadItinerary}
          fullWidth
        />
      </Modal.Footer>
    </Modal>
  );
};
type SuccessModalProps = {
  isShowing: {
    open: boolean;
    id: string;
  }
  toggle: () => void;
};
export default ItinerarySuccessModal;
