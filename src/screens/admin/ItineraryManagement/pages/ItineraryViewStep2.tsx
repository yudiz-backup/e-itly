import React, { useState } from "react";
import { Accordion, Col, Row, Tab, Tabs } from "react-bootstrap";
import { VNode } from "preact";


// component
import EventServiceCard from "src/components/DNDCard/EventServiceCard";
import EventBlockCard from "src/components/DNDCard/EventBlockCard";
import AgentCard from "src/components/DNDCard/AgentCard";
import Heading from "src/components/Heading";


import { SvgPenToEdit, iconLine2, defaultImage } from "src/assets/images";
import { getDayItemDate } from "src/utils/date";
import { Strings } from "src/resources";

const ItineraryViewStep2 = ({
  showCost,
  stepTitle,
  data
}: ItineraryViewStep2): VNode<any> => {

  const [editCost, setEditCost] = useState(false);
  const costHandler = () => setEditCost(!editCost);

  return (
    <>
      <div className="event-w itineraryStep2 event-day-list">
        <Row className="g-3">
          <Col lg={7}>
            <div className="mb-12">
              <Heading title={stepTitle} variant="small" />
            </div>
            <div className="flex-between mb-20 position-relative">

              <div className="tabs-list day-list position-relative w-100">
                <Tabs defaultActiveKey="day1" id="profile-tabs">

                  {
                    data?.day?.map((item, dayIndex) => {
                      const dayItemDate = getDayItemDate(data.startDate, dayIndex)
                      return (
                        <Tab eventKey={`day${dayIndex + 1}`} title={dayItemDate} key={dayIndex}>
                          {showCost && (
                            <div className="itineraryStep2-cost flex-between mb-20">
                              <ul>
                                <li>Total Cost: $500</li>{" "}
                                <li>Internal Cost: $400 </li>
                              </ul>
                              <button onClick={costHandler}>
                                <SvgPenToEdit />
                                {Strings.edit}
                              </button>
                            </div>
                          )}

                          <Accordion defaultActiveKey="0">
                            {
                              item?.event?.map((item: eventType, index) => {
                                return (
                                  <Accordion.Item eventKey={`${index}`} key={index}>
                                    <Accordion.Header>
                                      <img src={iconLine2} alt="lineIcon" /> {item?.eventTitle}
                                    </Accordion.Header>
                                    <Accordion.Body>
                                      <div className="dnd-wrapper">
                                        <div className="dashed-wrapper">
                                          <div>
                                            <AgentCard
                                              description={item?.notes}
                                              title={item?.eventTitle}
                                            // chipsIcon
                                            />{" "}
                                          </div>
                                          <div className="my-4">
                                            <h4 className="fs-6 mb-2">{Strings.blocks}</h4>
                                            <div>
                                              {item?.block?.map((item: BlockType, bIndex) => (
                                                <EventBlockCard
                                                  key={item?.blockName + bIndex}
                                                  image={item?.image || defaultImage}
                                                  description={item?.description}
                                                  title={item?.blockName}
                                                />
                                              ))}
                                            </div>
                                          </div>
                                          <div>
                                            <h4 className="fs-6 mb-2">{Strings.services}</h4>
                                            <div>
                                              {item?.service?.map((item: ServicesType) => {
                                                return (
                                                  <>
                                                    <EventServiceCard
                                                      description={item?.description}
                                                      chipsTitle={item?.serviceType}
                                                      title={item?.serviceName}
                                                      internalCost={item?.internalCost}
                                                      externalCost={item?.externalCost}
                                                      supplierName={item?.supplierName}
                                                      pricePerPerson={item?.pricePerPerson}
                                                      participants={data?.participants}
                                                    />
                                                  </>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </Accordion.Body>
                                  </Accordion.Item>
                                );
                              })
                            }
                          </Accordion>
                        </Tab>
                      )
                    })
                  }
                </Tabs>
              </div>
            </div>
          </Col>
          <Col lg={5} className="mt-5">
            <div className="mb-12">
              <Heading title={Strings.step_3} variant="small" />
            </div>
            <div className="dnd-wrapper">
              <div className="dashed-wrapper">
                <Heading
                  title={Strings.agent}
                  variant="small"
                  className="mb-2"
                />
                <AgentCard
                  title={data?.agent?.name}
                  address={data?.agent?.agencyName}
                  email={data?.agent?.email}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};
type ItineraryViewStep2 = {
  showCost?: boolean;
  stepTitle?: string;
  data?: ItineraryType
};
export default ItineraryViewStep2;
