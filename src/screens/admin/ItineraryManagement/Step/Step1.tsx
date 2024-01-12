import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "react-toastify";

// component
import DateSelector from "src/components/DateSelector";
import CustomSelect from "src/components/CustomSelect";
import TextField from "src/components/TextField";
import Heading from "src/components/Heading";
import Button from "src/components/Button";

// query
import { getItineraryById } from "src/Query/Itinerary/itinerary.query";
import { getSubAdmin } from "src/Query/SubAdmin/subAdmin.query";
import { hasError } from "src/services/ApiHelpers";

import { calculateDaysDifference, getDateInDDMMYYYYFormat, getDateInLocalFormat } from "src/utils/date";
import { itineraryAtom, itineraryVersionAtom } from "src/recoilState/itinerary";
import { allRoutes } from "src/constants/AllRoutes";
import { Strings } from "src/resources";
import { Step2Props } from "./Step2";


const Step1 = ({ setK, k, setKey }: Step2Props) => {

  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search);
  const itineraryId = queryParams.get("itineraryId");

  const { control, handleSubmit, watch, reset } = useForm()

  const itineraryVersionHandle = useRecoilValue(itineraryVersionAtom)

  const [itineraryData, setItineraryData] = useRecoilState<ItineraryType | undefined>(
    itineraryAtom
  );
  const [participantNames, setParticipantNames] = useState([]);

  const noOfDayCalculation = (calculateDaysDifference(watch('startDate'), watch('endDate')) + 1)

  useEffect(() => {
    if (itineraryVersionHandle) {
      setItineraryData(prevTemp => Object.assign({}, prevTemp, itineraryVersionHandle));
    }
  }, [itineraryVersionHandle])

  useEffect(() => {
    if (itineraryVersionHandle?.itineraryName) {
      resetItineraryStep1Form(itineraryVersionHandle)
    }
  }, [itineraryVersionHandle])

  useEffect(() => {
    if (itineraryData?.participantList?.length) {
      setParticipantNames(itineraryData?.participantList)
    }
  }, [itineraryData])

  const bookerFilter = {
    userType: 'Booker',
    limit: 100,
    search: '',
  }

  // get Booker
  const { data: bookerData } = useQuery({
    queryKey: ["getBooker", bookerFilter],
    queryFn: () => getSubAdmin(bookerFilter),
    select: (data) => data?.data,
  });

  //get itinerary by ID
  useQuery({
    queryKey: ["getItineraryById", itineraryId],
    queryFn: () => getItineraryById(itineraryId as string),
    enabled: !!(itineraryId && bookerData),
    select: (data) => data?.data,
    staleTime: 0,
    onSuccess: (data) => {
      const itinObj = {
        itineraryName: data?.itineraryName,
        participantList: data?.participantList,
        participants: data?.participants,
        agent: data?.agent,
        startDate: data?.startDate,
        endDate: data?.endDate,
        noOfDay: data?.noOfDay,
        day: data?.day,
        itineraryVersion: data?.itineraryVersion,
        status: data?.status,
        itineraryId: data?.itineraryId,
        versionNumber: data?.versionNumber,
        bookerEmail: data?.bookerEmail
      }
      setItineraryData(itinObj)
      resetItineraryStep1Form(data)
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
      navigate(allRoutes.itinerary);
    },
  });

  function resetItineraryStep1Form(resetData) {
    reset({
      itineraryName: resetData?.itineraryName,
      startDate: getDateInLocalFormat(resetData?.startDate),
      endDate: getDateInLocalFormat(resetData?.endDate),
      noOfDay: resetData?.noOfDay,
      participants: resetData?.participants,
      booker: getBookerList(resetData),
      ...Object.fromEntries(resetData?.participantList.map((value, index) => [`${Strings.participant}_${index}`, value || '']))
    })
  }

  function getBookerList(data) {
    return bookerData?.admins?.find((item) => item?.emailId === data?.bookerEmail)
  }

  function handleParticipantNameChange(index: number, value: any) {
    const updatedNames = [...participantNames];
    updatedNames[index] = value;
    setParticipantNames(updatedNames);
  }

  const renderParticipantsField = Array.from({ length: Number(watch('participants')) }, (_, index) => (
    <Controller
      key={'renderParticipantsField' + index}
      control={control}
      name={`${Strings.participant}_${index}`}
      rules={{
        required: `${Strings.participant}-${index + 1} name is required`,
        minLength: { value: 3, message: "name must be at least 3 characters." }
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Form.Group className="participants-item">
          <Form.Control
            type="text"
            placeholder={`${Strings.participant}-${index + 1}`}
            value={value}
            onChange={(e: any) => {
              handleParticipantNameChange(index, e?.target?.value)
              onChange(e)
            }}
          />
          <Form.Control.Feedback type="invalid" data-cy={`${Strings.participant}-${index}Error`}>
            {error?.message}
          </Form.Control.Feedback>
        </Form.Group>
      )}
    />
  ));


  function onSubmit(data: any) {
    const { itineraryName, startDate, endDate, participants, booker } = data

    const newItinerary: ItineraryType = {
      itineraryName,
      startDate: getDateInDDMMYYYYFormat(startDate),
      endDate: getDateInDDMMYYYYFormat(endDate),
      noOfDay: noOfDayCalculation,
      participants,
      participantList: participantNames,
      bookerEmail: booker?.emailId
    };

    setItineraryData((prevItineraryData) => {
      return {
        ...prevItineraryData,
        ...newItinerary
      };
    });

    setK({ ...k, step2: true })
    setKey("step2")
  }

  return (
    <section>
      <Form>
        <Row>
          <Col xxl={3} xl={3} lg={4} sm={6}>
            <Controller
              control={control}
              name='itineraryName'
              rules={{
                required: 'Itinerary name is required',
                minLength: { value: 3, message: "Itinerary name must be at least 3 characters." }
              }}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  error={error?.message}
                  label={Strings.itinerary}
                  placeHolder={Strings.itinerary}
                  dataCy="itineraryName"
                />
              )}
            />
          </Col>
          <Col xxl={2} xl={3} lg={4} sm={6}>
            <div className="mb-3">
              <Controller
                control={control}
                name="startDate"
                rules={{ required: 'Start date is required' }}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <>
                    <DateSelector
                      selected={value}
                      onChange={onChange}
                      error={error?.message}
                      minDate={new Date()}
                      maxDate={watch('endDate')}
                      placeholderText={Strings.start_date}
                    />
                  </>
                )}
              />
            </div>
          </Col>
          <Col xxl={2} xl={3} lg={4} sm={6}>
            <div className="mb-3">
              <Controller
                control={control}
                name="endDate"
                rules={{ required: 'End date is required' }}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <>
                    <DateSelector
                      selected={value}
                      onChange={onChange}
                      error={error?.message}
                      minDate={watch('startDate') || new Date()}
                      placeholderText={Strings.end_date}
                    />
                  </>
                )}
              />
            </div>
          </Col>
          <Col xxl={2} xl={3} lg={4} sm={6}>
            <Controller
              name="noOfDay"
              control={control}
              render={({ fieldState: { error } }) => {
                return (
                  <TextField
                    type="number"
                    value={noOfDayCalculation}
                    error={error?.message}
                    label={Strings.no_of_days}
                    placeHolder={Strings.no_of_days}
                    dataCy="noOfDay"
                    disabled
                  />
                );
              }}
            />
          </Col>
          <Col xxl={3} xl={3} lg={4} sm={6}>
            <Controller
              name="participants"
              control={control}
              rules={{ required: "Participants number is required" }}
              render={({ field: { value, onChange }, fieldState: { error } }) => {
                return (
                  <TextField
                    type="number"
                    value={value}
                    error={error?.message}
                    onChange={onChange}
                    label={Strings.no_of_Participant}
                    placeHolder={Strings.no_of_Participant}
                    dataCy="participants"
                  />
                );
              }}
            />
          </Col>
          <Col xxl={3} xl={3} lg={4} sm={6}>
            <Controller
              name="booker"
              control={control}
              // rules={{ required: "Booker is required" }}
              render={({ field: { value, onChange }, }) => {
                return (
                  <CustomSelect
                    value={value}
                    onChange={onChange}
                    placeholder={Strings.select_booker}
                    options={bookerData?.admins}
                    getOptionLabel={(option) => option?.name}
                    getOptionValue={(option) => option?.emailId}
                  />
                );
              }}
            />
          </Col>
          {
            watch('participants') &&
            (
              <>
                <div className="table-header my-3">
                  <Heading title={Strings.participant_list} />
                </div>
                <Col lg={12}>
                  <div>
                    <Form className="participants-list">

                      {renderParticipantsField}
                    </Form>
                  </div>
                </Col>
              </>
            )
          }
          <div className="gap-3 d-flex mt-3">
            <Link to={allRoutes.itinerary}>
              <Button title={Strings.cancel} variant="outline" />
            </Link>
            <Button
              title={Strings.save}
              variant="primary"
              onClick={handleSubmit(onSubmit)} />
          </div>
        </Row>
      </Form>
    </section>
  );
};

export default Step1;
