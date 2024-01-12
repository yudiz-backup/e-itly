import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { VNode } from "preact";
import Button from "../Button";

// component
import TextField from "../TextField";

// query
import { addAves, updateAves, updateItineraryStatus } from "src/Query/Itinerary/itinerary.mutation";
import { getItineraryAves } from "src/Query/Itinerary/itinerary.query";
import queryClient from "src/queryClient";

import { calculateTotalExternalCost } from "src/utils/calculation";
import { ItineraryStatusCodes } from "src/constants/generics";
import { hasError } from "src/services/ApiHelpers";
import { Strings } from "src/resources";

const AVESDetailsModal = ({ isShowing, toggle, itineraryData }: AVESDetailsProps): VNode<any> => {

  const { control, handleSubmit, reset } = useForm();

  const itineraryId = itineraryData?.id

  //  get Aves By ID
  const { data: avesDataGetById } = useQuery({
    queryKey: ['avesById', itineraryId],
    queryFn: () => getItineraryAves(itineraryId),
    enabled: isShowing,
    select: (data) => data?.data,
    staleTime: 0,
    onSuccess: (data) => {
      reset({ avesNumber: data?.avesNumber })
    }
  });

  //add Aves
  const addAvesMutation = useMutation(addAves, {
    onSuccess: (data) => {
      onSuccessModal(data)
    },
    onError: (error) => {
      onErrorModal(error)
    },
  });

  //update Aves
  const updateAvesMutation = useMutation(updateAves, {
    onSuccess: (data) => {
      onSuccessModal(data)
    },
    onError: (error) => {
      onErrorModal(error)
    },
  });

  // change Itinerary status to Completed with AVES
  const changeItineraryStatusMutation = useMutation(updateItineraryStatus, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getItinerary"]);
    },
    onError: (error) => {
      onErrorModal(error)
    },
  });

  function onSuccessModal(data) {
    toast.success(data?.message);
    handleCloseAvesModal()
    changeItineraryStatusMutation.mutate({ status: ItineraryStatusCodes?.completeWithAves, blockId: itineraryId })
  }

  function onErrorModal(error) {
    const errorResponse = hasError(error);
    toast.error(errorResponse.message);
  }

  function handleSaveAves(data) {
    const { avesNumber } = data
    const avesData = {
      avesNumber,
      itineraryId
    }
    if (avesDataGetById?.id) {
      updateAvesMutation.mutate({ avesData, id: avesDataGetById?.id })
    } else {
      addAvesMutation.mutate(avesData)
    }
  }

  function handleCloseAvesModal() {
    toggle()
    reset({
      avesNumber: ''
    })
  }

  return (
    <Modal show={isShowing} onHide={handleCloseAvesModal} centered className='aves-details-modal'>
      <Modal.Header closeButton>
        <Modal.Title>{Strings.aves_details}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul className='flex-between px-md-3'>
          <li>
            <span>{Strings.itinerary_id}</span>
            <h6>{itineraryData?.itineraryId}</h6>
          </li>
          <li>
            <span>{Strings.itinerary_name}</span>
            <h6>{itineraryData?.itineraryName}</h6>
          </li>
          <li>
            <span>{Strings.total_price}</span>
            <h6>{Strings.euro}
              {(itineraryData?.editedCost) || (calculateTotalExternalCost(itineraryData).toFixed(2))}
            </h6>
          </li>
        </ul>
        <div className='aves-details-modal-input'>
          <Controller
            name="avesNumber"
            control={control}
            rules={{ required: 'AVES number is required' }}
            render={({ field: { value, onChange }, fieldState: { error }, }) => {
              return (
                <TextField
                  value={value}
                  onChange={onChange}
                  error={error?.message}
                  label={Strings.aves_number}
                  placeHolder={Strings.aves_number}
                />
              )
            }}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline"
          title={Strings.cancel}
          onClick={handleCloseAvesModal}
          fullWidth
        />
        <Button
          variant="primary"
          title={Strings.save}
          fullWidth
          onClick={handleSubmit(handleSaveAves)}
        />
      </Modal.Footer>
    </Modal>
  );
};
type AVESDetailsProps = {
  isShowing: boolean
  toggle: () => void;
  itineraryData: ItineraryType
};
export default AVESDetailsModal;
