import React from "react";
import { Badge, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SvgEyeFill, defaultImage } from "src/assets/images";
import Heading from "src/components/Heading";
import TableHeader from "src/components/TableHeader";
import ThemeTable from "src/components/ThemeTable";
import { allRoutes } from "src/constants/AllRoutes";

const blocksLabels = [
  "Sr. No",
  "Block Name",
  "Image",
  "Description",
  "Status",
  "Actions",
];
const serviceLabels = [
  "Sr. No",
  "Service Name",
  "Service Type",
  "Region",
  "Internal Cost",
  "External cost",
  "Price Per Person",
  "Status",
  "Actions",
];
const serviceRankData = [
  {
    id: "01",
    serviceName: "Catering Servi...",
    serviceType: "Catering",
    region: "Paityn Press",
    internalCost: "50",
    externalCost: "30",
    price: "20",
    status: "Active",
  },
];
const blockRankData = [
  {
    id: "01",
    title: "Festival of Sa..",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7jVPPYzF0i_HtpXMGgfqWR4UyuVDjBD4MFg&usqp=CAU",
    description:
      "The hep culture and nightlife in Italy are completely different from that during the day. At night, each major city is host to a one-of-a-kind nightlife experience that...",
    status: "Active",
  },
  {
    id: "02",
    title: "Lorem ipsum",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7jVPPYzF0i_HtpXMGgfqWR4UyuVDjBD4MFg&usqp=CAU",
    description:
      "The hep culture and nightlife in Italy are completely different from that during the day. At night, each major city is host to a one-of-a-kind nightlife experience that...",
    status: "Active",
  },
];
const ItineraryDetails = () => {
  return (
    <section className="block-m-details event-details">
      <div>
        <TableHeader
          title="Event Details"
          addBtn="Edit event"
          addBtnPath={allRoutes.eventAdd}
        />
        <Row>
          <Col lg={12} className="mx-auto">
            <div className="block-m-details-w">
              <Heading title="Saturday Eve Party" className="mb-4" />
              <div className="event-details-cards">
                <Card>
                  <Card.Title>Event Day</Card.Title>
                  <Card.Text>01</Card.Text>
                </Card>
                <Card>
                  <Card.Title>Event Date</Card.Title>
                  <Card.Text>26-03-2023</Card.Text>
                </Card>
                <Card>
                  <Card.Title>Event Duration</Card.Title>
                  <Card.Text>2 Hrs</Card.Text>
                </Card>
                <Card>
                  <Card.Title>Region</Card.Title>
                  <Card.Text>Tuscany</Card.Text>
                </Card>
              </div>
              <div className="event-details-content">
                <h5 className="mb-1">Notes</h5>
                <p>
                  Lorem ipsum is a placeholder text commonly used to demonstrate
                  the visual form of a document or a typeface without relying on
                  meaningful content. Lorem ipsum may Lorem ipsum is a
                  placeholder text commonly used to demonstrate the visual form
                  of a document or a typeface without relying on meaningful
                  content. Lorem ipsum may...Lorem ipsum is a placeholder text
                  commonly used to demonstrate the visual form of a document or
                  a typeface without relying on meaningful content. Lorem ipsum
                  may
                </p>
              </div>
              <div className="event-details-content">
                <h5>Event Block</h5>
                <ThemeTable labels={blocksLabels}>
                  {blockRankData?.map((el) => {
                    const { id, title, image, description, status } = el;
                    return (
                      <tr key={id}>
                        <td>{id}</td>
                        <td>{title}</td>
                        <td>
                          <img src={image || defaultImage} alt={title} className="user-img" />
                        </td>
                        <td>{description}</td>
                        <td>
                          <Badge bg="success">{status}</Badge>
                        </td>
                        <td>
                          <div className="actions">
                            <Link
                              to={allRoutes.blocksDetails}
                              className="table-icon"
                            >
                              <SvgEyeFill size="24" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </ThemeTable>
              </div>
              <div className="event-details-content">
                <h5>Event Service</h5>
                <ThemeTable labels={serviceLabels}>
                  {serviceRankData?.map((el) => {
                    const {
                      id,
                      serviceName,
                      serviceType,
                      region,
                      internalCost,
                      externalCost,
                      price,
                      status,
                    } = el;
                    return (
                      <tr key={id}>
                        <td>{id}</td>
                        <td>{serviceName}</td>
                        <td>{serviceType}</td>
                        <td>{region}</td>
                        <td>{`$ ${internalCost}`}</td>
                        <td>{`$ ${externalCost}`}</td>
                        <td>{price}</td>
                        <td>
                          <Badge
                            bg={status === "Active" ? "success" : "danger"}
                          >
                            {status}
                          </Badge>
                        </td>
                        <td>
                          <div className="actions">
                            <Link
                              to={allRoutes.serviceDetails}
                              className="table-icon"
                            >
                              <SvgEyeFill size="24" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </ThemeTable>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default ItineraryDetails;
