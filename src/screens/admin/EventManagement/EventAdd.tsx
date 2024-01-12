/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Col, Form, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { useState } from "react";
import { VNode } from "preact";

// component
import CustomSelect from "src/components/CustomSelect";
import { allRoutes } from "src/constants/AllRoutes";
import TextField from "src/components/TextField";
import Heading from "src/components/Heading";
import Button from "src/components/Button";
import EventBlock from "./EventBlock";

// pages
import EventService from "./EventService";

// query
import { addEvent, updateEvent } from "src/Query/Events/event.mutation";
import { getEventById } from "src/Query/Events/event.query";
import { getRegion } from "src/Query/Region/region.query";
import queryClient from "src/queryClient";

import { checkErrors, convertFieldsForValidation, Validation } from "src/utils";
import { hasError } from "src/services/ApiHelpers";
import { Strings } from "src/resources";
import "./event.scss";

const EventAdd = () => {

  const userRef: React.MutableRefObject<boolean> = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("eventId");

  const [serviceDraggedList, setServiceDraggedList] = useState({ [uuid()]: [] });
  const [blockDraggedList, setBlockDraggedList] = useState({ [uuid()]: [] });

  const [eventFields, setEventFields] = useState<Array<InputFieldType>>([
    {
      type: "text",
      label: Strings.event_label,
      value: "",
      key: "eventTitle",
      name: Strings.event_label,
      error: "",
      maxLength: 50,
      rules: "required|max:50|min:3",
      dataCy: "eventTitle",
      placeHolder: Strings.event_label
    },
    {
      type: "number",
      label: Strings.event_day,
      value: "",
      key: "eventDay",
      name: Strings.event_day,
      error: "",
      maxLength: 50,
      rules: "required|max:50",
      dataCy: "eventDay",
      placeHolder: Strings.event_day
    },
    // {
    //   type: "text",
    //   label: Strings.booking_date,
    //   value: "",
    //   key: "bookingDate",
    //   name: Strings.booking_date,
    //   error: "",
    //   maxLength: 50,
    //   rules: "",
    //   dataCy: "bookingDate",
    // },
    // {
    //   type: "text",
    //   label: Strings.event_time,
    //   value: "",
    //   key: "eventTime",
    //   name: Strings.event_time,
    //   error: "",
    //   maxLength: 50,
    //   rules: "",   
    //   dataCy: "eventTime",
    // },
    {
      type: "number",
      label: Strings.event_duration,
      value: "",
      key: "eventDuration",
      name: Strings.event_duration,
      error: "",
      maxLength: 50,
      rules: "required|max:50",
      dataCy: "eventDuration",
      placeHolder: Strings.event_duration
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
      rules: "required|max:1000|min:3",
      dataCy: "eventNotes",
      placeHolder: Strings.enter_notes
    },
  ]);

  //  get  events By ID
  const { data } = useQuery({
    queryKey: ["getEventById", id],
    queryFn: () => getEventById(id as string),
    enabled: !!id,
    select: (data) => data?.data,
    staleTime: 0,
    onSuccess: (data) => {
      updateFields(0, "value", data?.eventTitle);
      updateFields(1, "value", data?.eventDay);
      // updateFields(2, "value", data?.bookingDate);
      // updateFields(3, "value", data?.eventTime);
      updateFields(2, "value", data?.eventDuration);
      updateFields(3, "value", data?.region);
      updateFields(4, "value", data?.notes);
      const newBlockDraggedList = { [uuid()]: data?.block };
      setBlockDraggedList(newBlockDraggedList);
      const newServiceDraggedList = { [uuid()]: data?.service }
      setServiceDraggedList(newServiceDraggedList)
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
      navigate(allRoutes.event);
    },
  });

  const limit: ServiceTypeFilterType = {
    limit: 100,
    search: "",
    isActive: true
  };

  // get Region List
  const { data: regionList } = useQuery({
    queryKey: ["getRegion", limit],
    queryFn: () => getRegion(limit),
    select: (data) => data?.data?.regions,
  });

  //add event
  const addEventMutation = useMutation(addEvent, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getEvent"]);
      navigate(allRoutes.event);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

  // update event
  const updateEventMutation = useMutation(updateEvent, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getEvent"]);
      navigate(allRoutes.event);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

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
                      onChange={(newValue: string) => {
                        updateFields(index, "value", newValue)
                        if (id) {
                          userRef.current = true
                        }
                      }}
                      placeHolder={item.placeHolder}
                      error={item.error}
                      dataCy={item?.dataCy}
                      id={item?.key}
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
                    onChange={(newValue: string) =>
                      updateFields(index, "value", newValue)
                    }
                    placeHolder={item.placeHolder}
                    error={item.error}
                    dataCy={item?.dataCy}
                    id={item?.key}
                  />
                </Col>
              ) : item?.key == "bookingDate" ? (
                <Col xxl={4} lg={6}>
                  <div className="mb-3">
                    <DatePicker
                      // selected={startDate}
                      // onChange={handleDateChange}
                      placeholderText="Booking Date (DD-MM-YYYY)"
                      disabled
                      onChange={() => { }}
                    />
                  </div>
                </Col>
              ) : item?.key == "eventTime" ? (
                <Col xxl={4} lg={6}>
                  <div className="time-picker mb-3">
                    <DatePicker
                      // selected={startTime}
                      // onChange={(date) => setStartTime(date)}
                      onChange={() => { }}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      placeholderText="Event Time (00:00)"
                      disabled
                    />
                  </div>
                </Col>
              ) : item?.key == "selectRegion" ? (
                <Col xxl={4} lg={6}>
                  <div className="mb-3">
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
                    as={item?.type}
                    name={item?.name}
                    label={item?.label}
                    value={item.value}
                    onChange={(newValue: string) =>
                      updateFields(index, "value", newValue)
                    }
                    placeHolder={item.placeHolder}
                    error={item.error}
                    dataCy={item?.dataCy}
                    id={item?.key}
                    className="height-152"
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

  const handleSubmitEvent = async (e: MouseEvent) => {
    e.preventDefault();
    if (
      checkErrors(
        Validation.validate(convertFieldsForValidation(eventFields)),
        (index: number, value: any) => updateFields(index, "error", value)
      )
    ) {
      return;
    }

    const blockIdArray = Object.values(blockDraggedList)
      .flat().map((block) => {
        const { algoliaId, ...rest } = block;
        return rest;
      });

    const serviceIdArray = Object.values(serviceDraggedList)
      .flat().map((block) => {
        const { algoliaId, ...rest } = block;
        return rest;
      });

    const eventData = {
      eventTitle: eventFields[0]?.value,
      eventDay: eventFields[1]?.value,
      eventDuration: eventFields[2]?.value,
      region: eventFields[3]?.value,
      notes: eventFields[4]?.value,
      block: blockIdArray,
      service: serviceIdArray,
      isActive: id ? data?.isActive : true,
    };

    if (id) {
      updateEventMutation.mutate({ eventData, id });
    } else {
      addEventMutation.mutate(eventData);
    }
  };
  return (
    <section className="event pt-2">
      <div className="event-w mb-3 mb-md-5">
        <Form>
          <Row>
            <div className="table-header mb-3 d-flex justify-content-between align-items-center">
              <Heading title={id ? Strings?.event_edit : Strings.event_add} />
              <div className="gap-3 d-flex mt-3">
                <Link to={allRoutes.event}>
                  <Button title={Strings.cancel} variant="outline" />
                </Link>
                <Button
                  title={id ? Strings?.event_edit : Strings.event_Save}
                  variant="primary"
                  onClick={handleSubmitEvent}
                  isLoading={addEventMutation?.isLoading || updateEventMutation?.isLoading}
                  disabled={addEventMutation?.isLoading || updateEventMutation?.isLoading}
                />
              </div>
            </div>
            {renderFields()}
          </Row>
        </Form>
      </div>
      <div className="bottom-border my-3">
        <EventBlock
          setBlockDraggedList={setBlockDraggedList}
          blockDraggedList={blockDraggedList}
        />
      </div>
      <EventService
        setServiceDraggedList={setServiceDraggedList}
        serviceDraggedList={serviceDraggedList}
      />
    </section>
  );
};

export default EventAdd;
