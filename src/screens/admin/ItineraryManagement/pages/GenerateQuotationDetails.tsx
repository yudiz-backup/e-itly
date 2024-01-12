/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { v4 as uuid } from "uuid";

import BGWrapper from "src/components/BGWrapper";

import EventServiceCard from "src/components/DNDCard/EventServiceCard";
import FormCard from "src/components/FormCard";
import Heading from "src/components/Heading";
import TermsConditions from "../TermsConditions";
import { allRoutes } from "src/constants/AllRoutes";
import { Link, useLocation } from "react-router-dom";
import { Strings } from "src/resources";
import { useState } from "react";
import Button from "src/components/Button";
import { useMutation } from "@tanstack/react-query";
import { itineraryGenerateQuotation } from "src/Query/Itinerary/itinerary.mutation";
import { downloadPdf } from "../helper";
import { calculateTotalExternalCost } from "src/utils/calculation";

const GenerateQuotationDetails = () => {
  const { state } = useLocation()

  const [termsDraggedList, setTermsDraggedList] = useState({ [uuid()]: [] });
  const [serviceData, setServiceData] = useState([])

  //generate quotation
  const addItineraryMutation = useMutation(itineraryGenerateQuotation, {
    onSuccess: (data) => {
      const pdfData = data;
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      downloadPdf(url, "_blank")
    }
  });

  const transformData = (data) => {
    const transformedServices = {};
    data?.forEach((event, index) => {
      const eventDetails = event?.event[0];
      eventDetails?.service?.forEach((individualService) => {
        const { supplierName } = individualService;
        if (transformedServices?.hasOwnProperty(supplierName)) {
          transformedServices[supplierName].push({
            day: index + 1,
            ...individualService,
            event: eventDetails?.id
          });
        } else {
          transformedServices[supplierName] = [{
            day: index + 1,
            event: eventDetails?.id,
            ...individualService,
          }];
        }
      });
    });
    const transformedArray = Object.entries(transformedServices).map(([supplierName, services]) => ({
      supplierName,
      services,
    }));

    return transformedArray;
  };
  useEffect(() => {
    const transformedServices = transformData(state?.day);
    setServiceData(transformedServices)
  }, [state?.day]);


  function handleGenerateQuotation(e) {
    e.preventDefault();

    const termsArrayData = Object.values(termsDraggedList)
      .flat().map((term) => {
        const { algoliaId, ...rest } = term;
        return rest;
      });
    const termsArray = {
      termsData: termsArrayData,
      version: state?.versionNumber
    }
    addItineraryMutation.mutate({ termsArray, itineraryId: state?.id })
  }

  return (
    <section className="itinerary-bc">
      <Form>
        <Row>
          <div className="table-header mb-3 d-flex justify-content-between align-items-center">
            <Heading title={Strings.generate_quotation_details} />
            <div className="gap-3 d-flex mt-3">
              <Link to={allRoutes.itinerary}>
                <Button title={Strings.cancel} variant="outline" />
              </Link>
              <Button
                title={Strings.generate}
                variant="primary"
                onClick={handleGenerateQuotation}
                isLoading={addItineraryMutation?.isLoading}
                disabled={addItineraryMutation?.isLoading}
              />
            </div>
          </div>
        </Row>
      </Form>
      <div className="mb-24">
        <Row className="g-3">
          <Col lg={3}>
            <FormCard
              title={Strings.itinerary_id}
              description={state?.itineraryId}
              fullWidth
              direction="column"
            />
          </Col>
          <Col lg={3}>
            <FormCard
              title={Strings.itinerary_name}
              description={state?.itineraryName}
              fullWidth
              direction="column"
            />
          </Col>
          <Col lg={3}>
            <FormCard
              title={Strings.total_cost}
              description={`${Strings.euro} ${calculateTotalExternalCost(state)}`}
              fullWidth
              direction="column"
            />
          </Col>
        </Row>
      </div>
      <div className="mb-24">
        {serviceData?.map((i, index) => {
          return <BGWrapper key={index}>
            <div className="tabs-list day-list">
              <div>
                <div className="flex-between mb-24">
                  <div className="itinerary-bc-provider-name">
                    <span>{Strings.service_provider}</span>
                    <Heading variant="medium" title={i?.supplierName} />
                  </div>
                </div>
                <div className="dashed-wrapper">
                  <Heading
                    title={Strings.services}
                    variant="small"
                    className="mb-3"
                  />
                  <Row>
                    {
                      i?.services?.length && i.services?.map((service, index) => {
                        return <Col lg={6} key={index}>
                          <div>
                            <EventServiceCard
                              title={service?.serviceName}
                              description={service?.description}
                              chipsTitle={service?.serviceType}
                              internalCost={service?.internalCost}
                              externalCost={service?.externalCost}
                              supplierName={service?.supplierName}
                              id={service?.id}
                              pricePerPerson={service?.pricePerPerson}
                              participants={state?.participants}
                              redirectBtn
                              state={state}
                              service={service}
                            />
                          </div>
                        </Col>
                      })
                    }
                  </Row>
                </div>
              </div>
            </div>
          </BGWrapper>
        })}
      </div>
      <TermsConditions termsDraggedList={termsDraggedList} setTermsDraggedList={setTermsDraggedList} />
    </section>
  );
};

export default GenerateQuotationDetails;
