import React from "react";
import { Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Strings } from "src/resources";
import { getDayItemDate } from "src/utils/date";
import SvgCheckFill from "src/assets/images/svg/check-fill";

type ServiceScheduleDayTabsProps = { itineraryData: ItineraryType };

function ServiceScheduleDayTabs({ itineraryData }: ServiceScheduleDayTabsProps) {
  return (
    <Nav variant="tabs">
      {itineraryData?.day?.map((item, dayIndex) => {
        const dayItemDate = getDayItemDate(itineraryData.startDate, dayIndex)
        return (
          <Nav.Item key={`${itineraryData.itineraryId}${dayIndex}`} className={`w-auto`}>
            <OverlayTrigger
              placement="top"
              delay={{ show: 250, hide: 400 }}
              overlay={<Tooltip id={`${Strings.day}-${dayIndex + 1}`}>{dayItemDate}</Tooltip>}
            >
              <Nav.Link eventKey={`day${dayIndex + 1}`} className={`d-flex align-items-center ${item.isBooked ? "bg-success text-white" : ""}`}>
                {item.isBooked && <SvgCheckFill className="text-white me-1" />}
                {`${Strings.day} ${dayIndex + 1}`}
              </Nav.Link>
            </OverlayTrigger>
          </Nav.Item>
        );
      })}
    </Nav>
  );
}

export default React.memo(ServiceScheduleDayTabs);
