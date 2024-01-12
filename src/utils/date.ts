import moment from "moment";
import { MutableRef } from "preact/hooks";
import { DEFAULT_DATE_FORMAT } from "src/constants/generics";
import { Strings } from "src/resources";

export function localTimeZoneTimeStamp(data: moment.MomentInput, format = "hh:mm A") {
  return moment(data).format(format);
}

export function formatTimestamp(timestamp: moment.MomentInput, refTime: MutableRef<any>) {
  const currentDate = moment().startOf("day");
  const messageDate = moment(timestamp).startOf("day");

  const daysAgo = currentDate.diff(messageDate, "days");

  if (refTime.current === daysAgo) {
    return;
  } else {
    refTime.current = daysAgo;
    if (daysAgo === 0) {
      return Strings.today;
    } else if (daysAgo === 1) {
      return Strings.yesterday;
    } else {
      return messageDate.format("MM-DD-YYYY");
    }
  }
}

export function dateFormat(date: string) {
  return new Date(date.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
}

export function getDateRange(startDate: string, endDate: string) {
  const dateRange = [];
  const currentDate = new Date(startDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
  const lastDate = new Date(endDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
  while (currentDate <= lastDate) {
    const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    dateRange.push(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateRange;
}

export function getDateInDDMMYYYYFormat(date, format = DEFAULT_DATE_FORMAT) {
  const momentDate = moment(date);
  // check if date is valid in moment conversion
  if (momentDate.isValid()) {
    return moment(date).format(format);
  } else if (moment(date, format).format(format) === date) {
    // sometimes date will be passed in default format and cause the invalid date
    return date;
  }
}

export function getDateInLocalFormat(inputDate, format = DEFAULT_DATE_FORMAT) {
  const parsedDate = moment(inputDate, format);
  const utcMoment = parsedDate.utc();
  const utcDateObject = utcMoment.toDate();
  return utcDateObject;
}

export function calculateDaysDifference(startDate, endDate) {
  if (startDate && endDate) {
    const startMoment = moment(startDate);
    const endMoment = moment(endDate);
    const differenceDays = endMoment.diff(startMoment, "days");
    return differenceDays;
  }
}

export function getDayItemDate(startDate,dayIndex) {
  return moment(startDate, DEFAULT_DATE_FORMAT).add(dayIndex, "day").format(DEFAULT_DATE_FORMAT);
}