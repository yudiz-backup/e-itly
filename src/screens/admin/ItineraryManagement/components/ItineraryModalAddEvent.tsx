import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { VNode } from "preact";

// component
import CustomSelect from "src/components/CustomSelect";
import TextField from "src/components/TextField";
import Button from "src/components/Button";

// query
import { addEvent } from "src/Query/Events/event.mutation";
import { getRegion } from "src/services/regionService";
import { Strings } from "src/resources";
import { checkErrors, convertFieldsForValidation, Validation } from "src/utils";
import queryClient from "src/queryClient";

const ItineraryModalAddEvent = ({
  updateEventDraggedList,
  isShowing,
  eventModalCloseHandler,
  eventData,
  eventId
}: ItineraryModalAddEventProps): VNode<any> => {


  // get Region
  const regionFilter: ServiceTypeFilterType = {
    limit: 100,
    search: "",
    isActive: true,
  };

  const { data: regionList } = useQuery({
    queryKey: ["getRegion", regionFilter],
    queryFn: () => getRegion(regionFilter),
    select: (data) => data?.data?.regions,
  });

  //add event
  const addEventMutation = useMutation(addEvent, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getEvent"]);
      handleCloseEvent()
      // navigate(allRoutes.event);
    },
  });

  const [eventFields, setEventFields] = useState<Array<InputFieldType>>([
    {
      type: "text",
      label: Strings.event_label,
      value: "",
      key: "eventTitle",
      name: Strings.event_label,
      error: "",
      maxLength: 50,
      rules: "required|max:50",
      dataCy: "eventTitle",
      placeHolder: Strings.event_label,
    },
    {
      type: "text",
      label: Strings.event_day,
      value: "",
      key: "eventDay",
      name: Strings.event_day,
      error: "",
      maxLength: 50,
      rules: "required|max:50",
      dataCy: "eventDay",
      placeHolder: Strings.event_day,
    },
    {
      type: "text",
      label: Strings.booking_date,
      value: "",
      key: "bookingDate",
      name: Strings.booking_date,
      error: "",
      maxLength: 50,
      rules: "",
      dataCy: "bookingDate",
    },
    {
      type: "text",
      label: Strings.event_time,
      value: "",
      key: "eventTime",
      name: Strings.event_time,
      error: "",
      maxLength: 50,
      rules: "",
      dataCy: "eventTime",
    },
    {
      type: "text",
      label: Strings.event_duration,
      value: "",
      key: "eventDuration",
      name: Strings.event_duration,
      error: "",
      maxLength: 50,
      rules: "required|max:50",
      dataCy: "eventDuration",
      placeHolder: Strings.event_duration,
    },
    {
      type: "text",
      label: Strings.select_region,
      value: "",
      key: "selectRegion",
      name: Strings.region,
      error: "",
      maxLength: 50,
      rules: "required|max:50",
      dataCy: "selectRegion",
    },
    {
      type: "textarea",
      label: Strings.enter_notes,
      value: "",
      key: "eventNotes",
      name: Strings.notes,
      error: "",
      maxLength: 50,
      rules: "required|max:50",
      dataCy: "eventNotes",
      placeHolder: Strings.enter_notes,
    },
  ]);
  useEffect(() => {
    if (eventId?.dragId) {
      updateFields(0, "value", eventData?.eventTitle);
      updateFields(1, "value", eventData?.eventDay);
      updateFields(4, "value", eventData?.eventDuration);
      updateFields(5, "value", eventData?.region);
      updateFields(6, "value", eventData?.notes);
    }
  }, [eventId?.dragId])
  function updateFields(index: number, fieldName: string, value: any): void {
    setEventFields((prevState): Array<InputFieldType> => {
      prevState[index] = { ...prevState[index], [fieldName]: value };
      return [...prevState];
    });
  }

  function renderFields(): VNode {
    return (
      <>
        {eventFields?.map((item: InputFieldType, index) => {
          return (
            <>
              {item?.key == "eventTitle" ? (
                <>
                  <Col xxl={8} lg={6}>
                    <TextField
                      type={item?.type}
                      name={item?.name}
                      label={item?.label}
                      value={item.value}
                      placeHolder={item.placeHolder}
                      error={item.error}
                      dataCy={item?.dataCy}
                      id={item?.key}
                      onChange={(newValue: string) =>
                        updateFields(index, "value", newValue)
                      }
                    />
                  </Col>
                  <Col xxl={4} lg={6} />
                </>
              ) : item?.key == "eventDay" || item?.key == "eventDuration" ? (
                <Col xxl={4} lg={6}>
                  <TextField
                    type={item?.type}
                    name={item?.name}
                    label={item?.label}
                    value={item.value}
                    placeHolder={item.placeHolder}
                    error={item.error}
                    dataCy={item?.dataCy}
                    id={item?.key}
                    onChange={(newValue: string) =>
                      updateFields(index, "value", newValue)
                    }
                  />
                </Col>
              ) : item?.key == "selectRegion" ? (
                <Col xxl={4} lg={6}>
                  <div className="mb-3 text-start">
                    <CustomSelect
                      onChange={(e) => {
                        updateFields(index, "value", e?.regionName);
                      }}
                      value={regionList?.find(
                        (i) => i?.regionName == item?.value
                      )}
                      options={regionList!}
                      getOptionLabel={(option: any) => option?.regionName}
                      getOptionValue={(option: any) => option?.regionName}
                      placeholder="Select Region"
                    />
                    <Form.Control.Feedback type="invalid">
                      {item?.error}
                    </Form.Control.Feedback>
                  </div>
                </Col>
              ) : item?.key == "eventNotes" ? (
                <Col lg={12}>
                  <TextField
                    type={item?.type}
                    name={item?.name}
                    label={item?.label}
                    value={item.value}
                    placeHolder={item.placeHolder}
                    error={item.error}
                    dataCy={item?.dataCy}
                    id={item?.key}
                    onChange={(newValue: string) =>
                      updateFields(index, "value", newValue)
                    }
                  />
                  {/* <FloatingLabel
                    controlId="floatingTextarea2"
                    label="Enter Notes..."
                  >
                    <Form.Control
                      as="textarea"
                      placeholder="Enter Notes..."
                      className='height-152'
                    />
                  </FloatingLabel> */}
                </Col>
              ) : (
                ""
              )}
            </>
          );
        })}
      </>
    );
  }
  const onSubmit = (e: MouseEvent) => {
    e.preventDefault();
    if (
      checkErrors(
        Validation.validate(convertFieldsForValidation(eventFields)),
        (index: number, value: any) => updateFields(index, "error", value)
      )
    ) {
      return;
    }
    const eventData = {
      eventTitle: eventFields[0]?.value,
      eventDay: eventFields[1]?.value,
      eventDuration: eventFields[4]?.value,
      region: eventFields[5]?.value,
      notes: eventFields[6]?.value,
      // block: blockIdArray,
      // service: serviceIdArray,
      isActive: true,
    };
    if (eventId?.dragId) {
      updateEventDraggedList({ eventData, eventId });
      handleCloseEvent()
    } else {
      addEventMutation.mutate(eventData);
    }

  };
  function handleCloseEvent() {
    updateFields(0, "value", "")
    updateFields(1, "value", "")
    updateFields(2, "value", "")
    updateFields(3, "value", "")
    updateFields(4, "value", "")
    updateFields(6, "value", "")
    eventModalCloseHandler()
  }
  return (
    <Modal
      show={isShowing}
      onHide={handleCloseEvent}
      centered
      size="xl"
      className="itinerary-modal"
    >
      <Form>
        <Modal.Header closeButton>
          <Modal.Title>{eventId?.dragId ? Strings.event_edit : Strings.event_add_new}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pb-0">
          <Row>{renderFields()}</Row>
          <div className="gap-3 d-flex mt-3 justify-content-center">
            <Button
              title={eventId?.dragId ? Strings.event_edit : Strings.event_add}
              variant="primary"
              onClick={onSubmit}
              isLoading={addEventMutation?.isLoading}
              disabled={addEventMutation?.isLoading}
            />
            <Button
              title={Strings.cancel}
              variant="outline"
              onClick={handleCloseEvent}
              dataCy="cancelEventBtn"
            />

          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
};
type ItineraryModalAddEventProps = {
  updateEventDraggedList: (newEventDraggedList: any) => void;
  isShowing: boolean;
  eventModalCloseHandler?: () => void;
  eventData?: any;
  eventId: {
    dragId?: string;
  },
};
export default ItineraryModalAddEvent;
