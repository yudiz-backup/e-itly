import React from "react";
import { Col, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import BGWrapper from "src/components/BGWrapper";
import Button from "src/components/Button";
import EventServiceCard from "src/components/DNDCard/EventServiceCard";
import FormCard from "src/components/FormCard";
import Heading from "src/components/Heading";
import TableHeader from "src/components/TableHeader";
import { allRoutes } from "src/constants/AllRoutes";
import { Strings } from "src/resources";

const ServiceBookingConfirmationDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation()

  return (
    <section className="itinerary-bc">
      <TableHeader title={Strings.service_booking_confirmation_details} />
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
              title={Strings.itinerary_summer_total_price}
              description="£ 250 dummy"
              fullWidth
              direction="column"
            />
          </Col>
        </Row>
      </div>
      <BGWrapper>
        <div className="flex-between mb-24">
          <div className="itinerary-bc-provider-name">
            <span>{Strings.service_provider}</span>
            <Heading variant="medium" title="Thomas Martin" />
          </div>
          <Button
            variant="primary"
            title={Strings.email_send}
            onClick={() => {
              navigate(allRoutes.itinerarySendEmail);
            }}
          />
        </div>
        <div className="dashed-wrapper">
          <Heading title={Strings.services} variant="small" className="mb-3" />
          <Row>
            <Col lg={6}>
              <div>
                <EventServiceCard
                  title="Catering Services"
                  description="Dummy Whether you are into the club scene or prefer a laid-back wine bar where you can enjoy a glass of Brunello and the great company of a few friends..."
                  chipsTitle="Catering"
                />
              </div>
            </Col>
            <Col lg={6}>
              <div>
                <EventServiceCard
                  title="Decoration Services"
                  description="Dummy Whether you are into the club scene or prefer a laid-back wine bar where you can enjoy a glass of Brunello and the great company of a few friends..."
                  chipsTitle="Decoration"
                />
              </div>
            </Col>
          </Row>
        </div>
      </BGWrapper>
    </section>
  );
};

export default ServiceBookingConfirmationDetails;
