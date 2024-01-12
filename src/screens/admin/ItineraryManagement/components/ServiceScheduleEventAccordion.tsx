import React from "react";
import { Accordion, Nav } from "react-bootstrap";
import { SVGArrowDown } from "src/assets/images";
import SvgCheckFill from "src/assets/images/svg/check-fill";
import { ItineraryServiceType } from "src/types/service-schedule";

type ServiceScheduleEventAccordionProps = {
  dayData: ItineraryDayType;
  dayIndex: number;
  serviceData: ItineraryServiceType;
  handleServiceTabClick: (data: ServicesType, serviceIndex: any, eventIndex: any, dayIndex: any) => void;
};

function ServiceScheduleEventAccordion({ dayData, serviceData, dayIndex, handleServiceTabClick }: ServiceScheduleEventAccordionProps) {
  return (
    <Accordion defaultActiveKey={`${dayData?.event[0]?.id}0`}>
      {dayData?.event?.map((eventItem: any, eventIndex: number) => {
        const { eventTitle, id, service } = eventItem;
        return (
          <Accordion.Item eventKey={`${id}${eventIndex}`} key={eventIndex}>
            <Accordion.Header className="d-flex">
              {eventTitle}
              <SVGArrowDown className="ms-auto flex-shrink-0 accordion-icon" style={{ marginRight: "-10px" }} />
            </Accordion.Header>
            <Accordion.Body>
              <Nav>
                {service?.map((serviceItem, serviceIndex) => {
                  const isTabActive =
                    serviceData?.serviceRefId && serviceItem.serviceRefId
                      ? serviceData?.serviceRefId === serviceItem.serviceRefId
                      : serviceData?.id === serviceItem.id;
                  return (
                    <Nav.Item key={"service" + serviceIndex}>
                      <button
                        onClick={() => {
                          handleServiceTabClick(serviceItem, serviceIndex, eventIndex, dayIndex);
                        }}
                        type="button"
                        className={`d-flex align-items-start ${isTabActive ? "show" : ""}`}
                      >
                        {serviceItem?.serviceName}
                        {serviceItem.isBooked && <SvgCheckFill className="ms-auto text-success flex-shrink-0" style={{ marginTop: 3 }} />}
                      </button>
                    </Nav.Item>
                  );
                })}
              </Nav>
            </Accordion.Body>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}

export default React.memo(ServiceScheduleEventAccordion);
