import React from "react";
import { Form } from 'react-bootstrap'
import DatePicker from 'react-datepicker'

function DateSelector({
    selected,
    onChange,
    maxDate,
    minDate,
    error,
    dateFormat = "dd-MM-yyyy",
    placeholderText,
    timeIntervals,
    timeCaption,
    showTimeSelect = false,
    showTimeSelectOnly = false,
}: DateSelectorTypes) {
    return (
        <>
            <DatePicker
                selected={selected}
                onChange={onChange}
                placeholderText={placeholderText}
                dateFormat={dateFormat}
                maxDate={maxDate}
                minDate={minDate}
                showTimeSelectOnly={showTimeSelectOnly}
                showTimeSelect={showTimeSelect}
                timeIntervals={timeIntervals}
                timeCaption={timeCaption}
            />
            {
                error &&
                <Form.Control.Feedback type="invalid" data-cy={"endDateError"}>
                    {error}
                </Form.Control.Feedback>
            }
        </>
    )
}

type DateSelectorTypes = {
    selected: Date | null;
    onChange(
        date?: Date
    ): void;
    placeholderText: string;
    error?: string;
    maxDate?: Date | null;
    minDate?: Date | null;
    dateFormat?: string;
    showTimeSelect?: boolean;
    showTimeSelectOnly?: boolean;
    timeIntervals?: number;
    timeCaption?: string;
}

export default DateSelector