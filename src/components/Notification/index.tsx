import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Offcanvas } from "react-bootstrap";

import NotificationItem from "./NotificationItem";
import IconButton from "../IconButton";
import {
  iconNotification,
} from "src/assets/images";

// query
import { getNotification } from "src/Query/Dashboard/dashboard.query";

import { Strings } from "src/resources";
import "./notification.scss";


const Notification = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // get Itinerary
  const { data: notificationData } = useQuery({
    queryKey: ["getNotification"],
    queryFn: () => getNotification(),
    select: (data) => data?.data,
  });

  return (
    <div className="notification">
      <IconButton onClick={handleShow} icon={iconNotification} />
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{Strings.notification}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="notification-items">
            {notificationData?.notifications?.map((item, index) => (
              <NotificationItem
                item={item}
                key={index}
                handleClose={handleClose}
              />
            ))}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default Notification;
