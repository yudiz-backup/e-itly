import React, { useRef } from "react";
import { Col, Row, Tab } from "react-bootstrap";

// component
import TableHeader from "src/components/TableHeader";

import { Strings } from "src/resources";
import useServiceSchedule from "src/screens/admin/ItineraryManagement/hooks/useServiceSchedule";
import ServiceEmailChatPanel from "src/components/service-schedule/ServiceEmailChatPanel";
import ServiceScheduleDayTabs from "../components/ServiceScheduleDayTabs";
import ServiceScheduleEventAccordion from "../components/ServiceScheduleEventAccordion";
import ServiceScheduleServiceBody from "../components/ServiceScheduleServiceBody";

const ItineraryServiceSchedule = () => {
  const refTime = useRef(null);
  const {
    itineraryState,
    serviceData,
    setServiceData,
    handleServiceTabClick,
    startTime,
    setStartTime,
    startDate,
    setStartDate,
    serviceScheduleMutation,
    serviceBooked,
    handleSaveServiceDateTime,
    serivceCostData,
    handleSupplierRefresh,
    handleScrollSupplierFetch,
    messageData,
    handleEiRefresh,
    handleScrollEiFetch,
    eiMessageData,
    handleExternalMessageSend,
    handleSupplierMessageSend,
  } = useServiceSchedule({ refTime });
  return (
    <section className="itineraryDateTime service-schedule">
      <TableHeader title={Strings.service_schedule_add} />
      <Row>
        <Col lg={6}>
          <div className="tabs-list day-list position-relative w-100">
            <Tab.Container
              defaultActiveKey="day1"
              id="day-tabs"
              onSelect={() => {
                setServiceData(null);
              }}
            >
              <ServiceScheduleDayTabs itineraryData={itineraryState} />

              <Tab.Content>
                {itineraryState?.day?.map((item, dayIndex) => (
                  <Tab.Pane key={`${item.id}${dayIndex}`} eventKey={`day${dayIndex + 1}`}>
                    <Row className="w-100">
                      <Col xxl={3} lg={4}>
                        <ServiceScheduleEventAccordion
                          dayData={item}
                          dayIndex={dayIndex}
                          handleServiceTabClick={handleServiceTabClick}
                          serviceData={serviceData}
                        />
                      </Col>
                      {serviceData && (
                        <Col xxl={9} lg={8} className="pe-0">
                          <ServiceScheduleServiceBody
                            startTime={startTime}
                            startDate={startDate}
                            setStartTime={setStartTime}
                            setStartDate={setStartDate}
                            serviceData={serviceData}
                            serivceCostData={serivceCostData}
                            handleSaveServiceDateTime={handleSaveServiceDateTime}
                          />
                        </Col>
                      )}
                    </Row>
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Tab.Container>
          </div>
        </Col>
        {serviceData && (
          <Col lg={6} className="ps-0">
            <ServiceEmailChatPanel
              serviceData={serviceData}
              messageData={messageData}
              eiMessageData={eiMessageData}
              refTime={refTime}
              itineraryData={itineraryState}
              serviceScheduleMutation={serviceScheduleMutation}
              serviceBookingData={{ startDate, startTime }}
              isServiceBooked={serviceBooked}
              handleSupplierRefresh={handleSupplierRefresh}
              handleScrollSupplierFetch={handleScrollSupplierFetch}
              handleSupplierMessageSend={handleSupplierMessageSend}
              handleEiRefresh={handleEiRefresh}
              handleScrollEiFetch={handleScrollEiFetch}
              handleExternalMessageSend={handleExternalMessageSend}
            />
          </Col>
        )}
      </Row>
    </section>
  );
};

export default ItineraryServiceSchedule;
