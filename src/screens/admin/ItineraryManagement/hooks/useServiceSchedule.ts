import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { getDateInDDMMYYYYFormat, getDateInLocalFormat } from "src/utils/date";
import { toast } from "react-toastify";
// query
import { updateItinerary } from "src/Query/Itinerary/itinerary.mutation";
import { getItineraryById } from "src/Query/Itinerary/itinerary.query";
import { addMessage } from "src/Query/Message/message.mutation";
import { getMessage } from "src/Query/Message/message.query";
import { hasError } from "src/services/ApiHelpers";
import queryClient from "src/queryClient";
import { Strings } from "src/resources";
import { deepCopy } from "src/screens/admin/ItineraryManagement/helper";

const IS_BOOKED = "isBooked";
const MESSAGE_INITIAL_VALUE = {
  eventId: "",
  serviceId: "",
  dayRefId: "",
  serviceRefId: "",
  eventRefId: ""
};
function useServiceSchedule({ refTime }) {
  const { state } = useLocation();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const itineraryId = queryParams.get("itineraryId");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState(null);
  // const [serviceBookingDateTime, setServiceBookingDateTime] = useState<{ startDate: Date; startTime: Date } | null>(null);
  const [serviceBooked, setServiceBooked] = useState(false);
  const [itineraryState, setItineraryState] = useState(state);
  const [messageData, setMessageData] = useState(null);
  const [eiMessageData, setEiMessageData] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [call, setCall] = useState(null);

  const [messageFilter, setMessageFilter] = useState({
    ...MESSAGE_INITIAL_VALUE,
    itineraryId: itineraryState?.id,
    type: "Supplier"
  });
  const [eiMessageFilter, setEiMessageFilter] = useState({
    ...MESSAGE_INITIAL_VALUE,
    itineraryId: itineraryState?.id,
    type: "external"
  });

  //  get  Itinerary By ID
  useQuery({
    queryKey: ["getItineraryById", itineraryId, call],
    queryFn: () => getItineraryById((itineraryId || call) as string),
    enabled: !!(itineraryId || call),
    select: (data) => data?.data,
    staleTime: 0,
    onSuccess: (data) => {
      setItineraryState(data);
      setCall("");
    }
  });

  // get Supplier Message Chat
  const {
    data: supplierMessage,
    isFetching,
    isError: messageError
  } = useQuery({
    queryKey: ["getMessage", messageFilter],
    queryFn: () => getMessage(messageFilter),
    select: (data) => data?.data,
    enabled: !!serviceData,
    staleTime: 0,
    onSuccess: (data) => {
      setMessageData((prev) => [...(prev?.length ? prev : []), ...(data?.messages?.length ? data.messages : [])]);
    }
  });

  // get EI Message Chat
  const {
    data: eiMessage,
    isFetching: eiMsgIsFetching,
    isError: eiMessageError
  } = useQuery({
    queryKey: ["getEiMessage", eiMessageFilter],
    queryFn: () => getMessage(eiMessageFilter),
    select: (data) => data?.data,
    enabled: !!serviceData,
    staleTime: 0,
    onSuccess: (data) => {
      setEiMessageData((prev) => [...(prev?.length ? prev : []), ...(data?.messages?.length ? data.messages : [])]);
    }
  });

  //add message
  const addMessageMutation = useMutation(addMessage, {
    onSuccess: (data) => {
      if (data?.data?.type === "Supplier") {
        handleSupplierRefresh();
        toast.success(data?.message);
      } else if (data?.data?.type === "external") {
        handleEiRefresh();
        toast.success(Strings.ei_notes_toast);
      }
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    }
  });

  // update itinerary
  const updateItineraryMutation = useMutation(updateItinerary, {
    onSuccess: (data) => {
      // toast.success(data?.message);
      queryClient.invalidateQueries(["getItineraryById"]);
      queryClient.invalidateQueries(["getItinerary"]);
      setCall(data?.data?.itinerary?.id);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    }
  });

  const serivceCostData = useMemo(() => {
    return [
      {
        title: Strings.internal_cost_label,
        value: Strings.euro + serviceData?.internalCost
      },
      {
        title: Strings.external_cost_label,
        value: Strings.euro + serviceData?.externalCost
      },
      {
        title: Strings.cost_per_participant,
        value: Strings.euro + (serviceData?.pricePerPerson ? serviceData?.externalCost : serviceData?.externalCost / itineraryState?.participants)
      },
      {
        title: Strings.supplier_label,
        value: serviceData?.supplierName
      }
    ];
  }, [serviceData]);

  function handleScrollSupplierFetch(target) {
    const result = target?.containerHeight + target?.topPosition >= target?.realHeight;

    if (result && supplierMessage?.startAfterDocId && !isFetching) {
      setMessageFilter((prev) => ({
        ...prev,
        startAfterDocId: supplierMessage?.startAfterDocId
      }));
    }
    refTime.current = null;
  }

  function handleScrollEiFetch(target) {
    const result = target?.containerHeight + target?.topPosition >= target?.realHeight;

    if (result && eiMessage?.startAfterDocId && !eiMsgIsFetching) {
      setEiMessageFilter((prev) => ({
        ...prev,
        startAfterDocId: eiMessage?.startAfterDocId
      }));
    }
  }

  function handleSupplierRefresh() {
    setMessageData(null);
    // state false for resetting supplier editor
    setServiceBooked(false);
    setMessageFilter({
      eventId: itineraryState.day[serviceData?.dayIndex]?.event[serviceData?.eventIndex]?.id,
      serviceId: serviceData?.id,
      itineraryId: itineraryState?.id,
      dayRefId: itineraryState?.day[serviceData?.dayIndex]?.dayRefId,
      serviceRefId: serviceData.serviceRefId,
      eventRefId: itineraryState.day[serviceData?.dayIndex]?.event[serviceData?.eventIndex]?.eventRefId,
      type: "Supplier"
    });
    queryClient.invalidateQueries(["getMessage"]);
  }
  function handleEiRefresh() {
    setEiMessageData(null);
    setEiMessageFilter({
      eventId: itineraryState.day[serviceData?.dayIndex]?.event[serviceData?.eventIndex]?.id,
      serviceId: serviceData?.id,
      itineraryId: itineraryState?.id,
      dayRefId: itineraryState?.day[serviceData?.dayIndex]?.dayRefId,
      serviceRefId: serviceData.serviceRefId,
      eventRefId: itineraryState.day[serviceData?.dayIndex]?.event[serviceData?.eventIndex]?.eventRefId,
      type: "external"
    });
    queryClient.invalidateQueries(["getEiMessage"]);
  }

  function handleServiceTabClick(data: ServicesType, serviceIndex, eventIndex, dayIndex) {
    if (serviceData?.id === data.id) {
      return;
    }
    setServiceData({
      ...data,
      serviceIndex,
      eventIndex,
      dayIndex
    });
    setMessageData(null);
    setEiMessageData(null);

    setMessageFilter((prev) => ({
      ...prev,
      eventId: itineraryState.day[dayIndex]?.event[eventIndex]?.id,
      serviceId: data?.id,
      dayRefId: itineraryState?.day[dayIndex]?.dayRefId,
      serviceRefId: data.serviceRefId,
      eventRefId: itineraryState.day[dayIndex]?.event[eventIndex]?.eventRefId
    }));
    setEiMessageFilter((prev) => ({
      ...prev,
      eventId: itineraryState.day[dayIndex]?.event[eventIndex]?.id,
      serviceId: data?.id,
      dayRefId: itineraryState?.day[dayIndex]?.dayRefId,
      serviceRefId: data.serviceRefId,
      eventRefId: itineraryState.day[dayIndex]?.event[eventIndex]?.eventRefId
    }));

    // update and reset states
    if (data?.startTime) {
      setStartTime(getDateInLocalFormat(data?.startTime, "HH:mm:ss"));
    } else {
      setStartTime(null);
    }
    const date = data?.startDate || itineraryState?.startDate;
    setStartDate(getDateInLocalFormat(date));

    setServiceBooked(false);

    refTime.current = null;
  }

  function handleSaveServiceDateTime() {
    // setServiceBookingDateTime({ startDate, startTime });
    setServiceBooked(true);
  }

  function getMessageFormData(type = "", message = "", files = []) {
    if (!type || !message || !files) {
      return console.warn("getMessageFormData missing data,", { type, message, files });
    }
    const newMessage = new FormData();

    newMessage.append("type", type);
    newMessage.append("dayIndex", serviceData?.dayIndex);
    newMessage.append("serviceIndex", serviceData?.serviceIndex);
    newMessage.append("eventIndex", serviceData?.eventIndex);
    newMessage.append("day", itineraryState?.startDate);
    newMessage.append("itineraryId", itineraryState?.id);
    newMessage.append("eventId", itineraryState.day[serviceData?.dayIndex]?.event[serviceData?.eventIndex]?.id);
    newMessage.append("serviceId", serviceData?.id);
    newMessage.append("supplierId", serviceData?.supplierId);
    newMessage.append("agentId", itineraryState?.agent?.id);
    newMessage.append("dayRefId", itineraryState?.day[serviceData?.dayIndex]?.dayRefId);
    newMessage.append("serviceRefId", serviceData.serviceRefId);
    newMessage.append("eventRefId", itineraryState.day[serviceData?.dayIndex]?.event[serviceData?.eventIndex]?.eventRefId);

    newMessage.append("message", message);

    files.forEach((file) => {
      newMessage.append("attachment", file);
    });
    return newMessage;
  }

  const handleSupplierMessageSend = ({ email, files, isServiceBooked = false }: { email: string; files?: File[]; isServiceBooked?: boolean }) => {
    console.log("🚀 ~ file: useServiceSchedule.ts:268 ~ handleSupplierMessageSend ~ isServiceBooked:", isServiceBooked);
    if (isServiceBooked) {
      // update itinerary with isBooked flag only when service has been scheduled
      const itineraryStateClone = deepCopy(itineraryState);
      const { day } = itineraryStateClone;
      const newDayObj = [...day];
      const currentDay = newDayObj[serviceData?.dayIndex];
      const currentService = currentDay.event[serviceData?.eventIndex].service[serviceData?.serviceIndex];
      currentService.startTime = startTime;
      currentService.startDate = getDateInDDMMYYYYFormat(startDate);
      delete itineraryStateClone?.day;
      delete itineraryStateClone?.itineraryVersion;
      delete itineraryStateClone?.versionNumber;
      currentService[IS_BOOKED] = true;

      // check if all services are booked
      const isAllServicesBooked = currentDay.event.every((ev) => ev.service.every((ser) => ser.isBooked));
      if (isAllServicesBooked) {
        currentDay[IS_BOOKED] = true;
      }

      const newItineraryData = {
        day: newDayObj,
        ...itineraryStateClone
      };
      updateItineraryMutation.mutate({ newItineraryData, itineraryId: newItineraryData?.id, serviceId: serviceData?.id });
    }
    const newMessageData = getMessageFormData("Supplier", email, files);
    if (newMessageData) {
      addMessageMutation.mutate(newMessageData);
    }
  };

  const handleExternalMessageSend = ({ message, files }: { message: string; files: File[] }) => {
    const newMessageData = getMessageFormData("external", message, files);
    if (newMessageData) {
      addMessageMutation.mutate(newMessageData);
    }
  };

  useEffect(() => {
    if (messageError) {
      setMessageData([]);
    }
  }, [messageError]);

  useEffect(() => {
    if (eiMessageError) {
      setEiMessageData([]);
    }
  }, [eiMessageError]);

  return {
    itineraryState,
    serviceData,
    setServiceData,
    handleServiceTabClick,
    startTime,
    setStartTime,
    startDate,
    setStartDate,
    serviceBooked,
    serviceScheduleMutation: {
      isLoading: updateItineraryMutation.isLoading && addMessageMutation.isLoading,
      isSuccess: updateItineraryMutation.isSuccess && addMessageMutation.isSuccess
    },
    handleSaveServiceDateTime,
    serivceCostData,
    handleSupplierRefresh,
    handleScrollSupplierFetch,
    messageData,
    handleEiRefresh,
    handleScrollEiFetch,
    eiMessageData,
    handleExternalMessageSend,
    handleSupplierMessageSend
  };
}

export default useServiceSchedule;
