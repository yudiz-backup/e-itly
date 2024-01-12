import React from "react";
import { StateUpdater } from "preact/hooks";
import Button from "src/components/Button";
import DateSelector from "src/components/DateSelector";
import { Strings } from "src/resources";
import { ItineraryServiceType } from "src/types/service-schedule";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "src/constants/AllRoutes";

type Props = {
  serviceData: ItineraryServiceType;
  serivceCostData: {
    title: string;
    value: any;
  }[];
  startTime: any;
  setStartTime: StateUpdater<any>;
  startDate: Date;
  setStartDate: StateUpdater<Date>;
  handleSaveServiceDateTime: () => void;
};

function ServiceScheduleServiceBody({
  serviceData,
  serivceCostData,
  startTime,
  setStartTime,
  startDate,
  setStartDate,
  handleSaveServiceDateTime,
}: Props) {
  const navigate = useNavigate()
  return (
    <div className="h-100 bg-light p-3 rounded-3">
      <div className="mb-24">
        <h5>{serviceData?.serviceName}</h5>
        <p>{serviceData?.description}</p>
      </div>
      <div className="mb-24">
        <ul className="service-cards">
          {serivceCostData.map((costData) => (
            <li key={costData.title}>
              <h6>{costData.title}</h6>
              <span>{costData.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="time-picker mb-3">
        <DateSelector
          selected={startTime}
          onChange={(date) => setStartTime(date)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="h:mm aa"
          placeholderText={Strings.service_time}
        />
      </div>
      <div className="mb-4">
        <DateSelector selected={startDate} onChange={(date) => setStartDate(date)} placeholderText={Strings.booking_date} />
      </div>
      <div className="d-flex gap-3">
        <Button title={Strings.save} variant="primary" onClick={handleSaveServiceDateTime} />
        <Button title={Strings.cancel} variant="outline" onClick={() => navigate(allRoutes.itinerary)} />
      </div>
    </div>
  );
}

export default React.memo(ServiceScheduleServiceBody);
