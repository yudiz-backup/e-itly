import React, { useId } from "react";
import { useNavigate } from "react-router-dom";

import {
    iconDraft,
    iconPending,
    iconCheckOutline,
    iconItineraryUpdated,
} from "src/assets/images";

// query
import { updateNotificationStatus } from "src/Query/Dashboard/dashboard.query";
import queryClient from "src/queryClient";

import { ItineraryStatusCodes, selectItineraryStatusOptions } from "src/constants/generics";
import { allRoutes } from "src/constants/AllRoutes";
import "./notification.scss";

const NotificationItem = ({ item, handleClose }: any) => {

    const uniqId = useId()

    const notificationImage = {
        default: {
            src: item?.icon,
            alt: item?.text,
        },
        "status-change": {
            src: iconCheckOutline,
            alt: "status-change",
        },
        ["status-change-" + ItineraryStatusCodes.partialPaid]: {
            src: iconPending,
            alt: "status-partialPaid",
        },
        ["status-change-" + ItineraryStatusCodes.fullyPaid]: {
            src: iconPending,
            alt: "status-fullyPaid",
        },
        ["status-change-" + ItineraryStatusCodes.pendingAgentApproval]: {
            src: iconPending,
            alt: "status-pendingAgentApproval",
        },
        ["status-change-" + ItineraryStatusCodes.draft]: {
            src: iconDraft,
            alt: "status-draft",
        },
        ["status-change-" + ItineraryStatusCodes.confirmed]: {
            src: iconCheckOutline,
            alt: "status-confirmed",
        },
        ["status-change-" + ItineraryStatusCodes.completeWithAves]: {
            src: iconCheckOutline,
            alt: "status-completeWithAves",
        },
        "itinerary-update": {
            src: iconPending,
            alt: "itinerary-update",
        },
        "thread": {
            src: iconItineraryUpdated,
            alt: "thread",
        },
    };

    const navigate = useNavigate();

    const handleClickNotification = async () => {
        await updateNotificationStatus({
            notificationId: item?.id,
        });

        queryClient.invalidateQueries(["getNotification"]);

        if (item?.type?.substr(0, 13) === "status-change") {
            navigate("itinerary");
            handleClose();
        } else if (item?.type === "itinerary-update") {
            navigate(`itinerary/edit?itineraryId=${item?.referenceId}`);
            handleClose();
        } else if (item?.type === "chat") {
            navigate(
                `${allRoutes.itineraryAddServiceSchedule}?itineraryId=${item?.referenceId}`
            );
            handleClose();
        } else if (item?.type === "thread") {
            navigate(`${allRoutes.messageThread}?threadId=${item?.referenceId}`);
            handleClose();
        }
    };

    function notificationText() {

        if (item?.type?.substr(0, 13) === "status-change") {
            const textArray = item?.text?.split(' ')
            const getLastElement = textArray?.pop()
            const getFullForm = selectItineraryStatusOptions?.find((i) => i?.value === getLastElement)?.label
            return item?.text?.replace(getLastElement, getFullForm)
        }
        else {
            return item?.text
        }
    }

    return (
        <div
            className={`notification-item ${item.type}`}
            onClick={handleClickNotification}
        >
            <input
                className="notification-checkbox"
                type="checkbox"
                id={`${item?.type}-${uniqId}`}
                value={`${item?.type}-${uniqId}`}
                checked={item?.isRead === true ? true : false}
            />
            <div className="notification-item-content">
                <div className="notification-item-icon">
                    <img
                        src={
                            notificationImage[item?.type]?.src ||
                            notificationImage.default.src
                        }
                        alt={
                            notificationImage[item?.type]?.alt ||
                            notificationImage.default.alt
                        }
                    />
                </div>
                <h3 className="notification-item-title">{notificationText()}</h3>
            </div>
        </div>
    );
};


export default NotificationItem