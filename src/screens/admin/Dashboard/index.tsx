import React, { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";

// images
import {
  ShapeCompletedWave,
  ShapeTotalWave,
  ShapeUpcomingWave,
  iconClipboardCheck,
  iconClock,
  iconSuitcaseRolling,
  imgMusicFestivalCuate,
  imgWaitersCuate,
} from "src/assets/images";

// component
import ItinerariesCard from "src/components/ItinerariesCard";
import CustomSelect from "src/components/CustomSelect";
import Heading from "src/components/Heading";
import Button from "src/components/Button";

// query
import { getDashboard, getYearList } from "src/Query/Dashboard/dashboard.query";

import { Strings } from "src/resources";
import Chart from "./Chart";
import "./dashboard.scss";
import moment from "moment";


const monthOptions = [
  { value: "01", label: "JAN" },
  { value: "02", label: "FEB" },
  { value: "03", label: "MAR" },
  { value: "04", label: "APR" },
  { value: "05", label: "MAY" },
  { value: "06", label: "JUN" },
  { value: "07", label: "JUL" },
  { value: "08", label: "AUG" },
  { value: "09", label: "SEP" },
  { value: "10", label: "OCT" },
  { value: "11", label: "NOV" },
  { value: "12", label: "DEC" },
];


const ExclusivelyDashboard = () => {

  const customOptions = [
    { value: "Current Month", label: "Current Month" },
    { value: "Last Month", label: "Last Month" },
    { value: "Last 6 Months", label: "Last 6 Months" },
    { value: "Last Year", label: "Last Year" },
    { value: "Custom", label: "Custom" },
  ];

  const [yearOptions, setYearOptions] = useState([])
  const [singleDropDown, setSingleDropDown] = useState({ value: "Current Month", label: "Current Month" })
  const [startMonth, setStartMonth] = useState({ value: moment().format('MM'), label: moment().format('MMM').toUpperCase() })
  const [startYear, setStartYear] = useState({ value: moment().format('YYYY'), label: moment().format('YYYY') })
  const [endMonth, setEndMonth] = useState({ value: moment().format('MM'), label: moment().format('MMM').toUpperCase() })
  const [endYear, setEndYear] = useState({ value: moment().format('YYYY'), label: moment().format('YYYY') })


  const [dashboardFilter, setDashboardFilter] = useState({
    startDate: `01/${startMonth?.value}/${startYear?.value}`,
    endDate: `${endDay()}/${endMonth?.value}/${endYear?.value}`,
    type: 'day'
  })

  // get Dashboard
  const { data } = useQuery({
    queryKey: ["getDashboard", dashboardFilter],
    queryFn: () => getDashboard(dashboardFilter),
    select: (data) => data?.data,
  });

  // get year
  useQuery({
    queryKey: ["getYear",],
    queryFn: () => getYearList(),
    select: (data) => data?.data,
    onSuccess: (data) => {
      const { minYear, maxYear } = data;
      const years = generateYearOptions(minYear, maxYear);
      setYearOptions(years);
    }
  });

  function generateYearOptions(min, max) {
    const years = [];
    for (let year = min; year <= max; year++) {
      years.push({ value: year.toString(), label: year.toString() });
    }
    return years;
  }

  function handleSelectSingleDropDown(data) {
    setSingleDropDown(data);

    switch (data?.value) {
      case 'Current Month':
        setStartMonth({ value: moment().format('MM'), label: moment().format('MMM').toUpperCase() });
        setEndMonth({ value: moment().format('MM'), label: moment().format('MMM').toUpperCase() });
        setStartYear({ value: moment().format('YYYY'), label: moment().format('YYYY') });
        setEndYear({ value: moment().format('YYYY'), label: moment().format('YYYY') });
        break;

      case 'Last Month':
        setStartMonth({ value: moment().subtract(1, 'month').format('MM'), label: moment().subtract(1, 'month').format('MMM').toUpperCase() });
        setEndMonth({ value: moment().subtract(1, 'month').format('MM'), label: moment().subtract(1, 'month').format('MMM').toUpperCase() });
        setStartYear({ value: moment().subtract(1, 'month').format('YYYY'), label: moment().subtract(1, 'month').format('YYYY') });
        setEndYear({ value: moment().subtract(1, 'month').format('YYYY'), label: moment().subtract(1, 'month').format('YYYY') });
        break;

      case 'Last 6 Months':
        setStartMonth({ value: moment().subtract(5, 'months').format('MM'), label: moment().subtract(5, 'months').format('MMM').toUpperCase() });
        setEndMonth({ value: moment().format('MM'), label: moment().format('MMM').toUpperCase() });
        setStartYear({ value: moment().format('YYYY'), label: moment().format('YYYY') });
        setEndYear({ value: moment().format('YYYY'), label: moment().format('YYYY') });
        break;

      case 'Last Year':
        setStartMonth({ value: "01", label: "JAN" },);
        setEndMonth({ value: "12", label: "DEC" },);
        setStartYear({ value: moment().subtract(1, 'year').format('YYYY'), label: moment().format('YYYY') });
        setEndYear({ value: moment().subtract(1, 'year').format('YYYY'), label: moment().format('YYYY') });
        break;

      default:
        // Handle other cases if needed
        break;
    }
  }

  function handleSelectStartMonth(data) {
    setStartMonth(data)
  }
  function handleSelectStartYear(data) {
    setStartYear(data)
  }
  function handleSelectEndMonth(data) {
    setEndMonth(data)
  }
  function handleSelectEndYear(data) {
    setEndYear(data)
  }

  function calculateType(data) {
    if (data === 1) {
      return 'day'
    } else if (13 > data && data > 1) {
      return 'month'
    } else {
      return 'year'
    }
  }

  function endDay() {
    return moment(`${endMonth?.value}-${endMonth?.value}-01`).endOf('month').format('DD')
  }

  function handleApply() {


    const startDate = moment(`${startMonth?.value}/01/${startYear?.value}`)
    const endDate = moment(`${endMonth?.value}/${endDay()}/${endYear?.value}`)
    const differenceInMonths = (endDate).diff((startDate), 'months');

    const newData = {
      startDate: `01/${startMonth?.value}/${startYear?.value}`,
      endDate: `${endDay()}/${endMonth?.value}/${endYear?.value}`,
      type: calculateType(differenceInMonths + 1)
    }
    setDashboardFilter(newData)
  }

  return (
    <section className="dashboard">
      <div className="dashboard-head mb-3">
        <Heading title={Strings.dashboard_title} />
        <div className="flex-between gap-4">
          <div className='dummyYearsOptions'>
            <CustomSelect
              value={singleDropDown}
              onChange={handleSelectSingleDropDown}
              options={customOptions}
              getOptionLabel={(option) => option?.label}
              getOptionValue={(option) => option?.value}
            />
          </div>
          {
            singleDropDown?.value === 'Custom' &&
            (
              <>
                <div className="flex-between gap-3">
                  <span>Start:</span>
                  <CustomSelect
                    value={startMonth}
                    onChange={handleSelectStartMonth}
                    options={monthOptions}
                    placeholder={Strings.month}
                    getOptionLabel={(option) => option?.label}
                    getOptionValue={(option) => option?.value}
                  />
                  <CustomSelect
                    value={startYear}
                    onChange={handleSelectStartYear}
                    options={yearOptions}
                    placeholder={Strings.year}
                    className="year"
                    getOptionLabel={(option) => option?.label}
                    getOptionValue={(option) => option?.value}
                  />
                </div>
                <div className="flex-between gap-3">
                  <span>End:</span>
                  <CustomSelect
                    value={endMonth}
                    onChange={handleSelectEndMonth}
                    options={monthOptions}
                    placeholder={Strings.month}
                    getOptionLabel={(option) => option?.label}
                    getOptionValue={(option) => option?.value}
                  />
                  <CustomSelect
                    value={endYear}
                    onChange={handleSelectEndYear}
                    options={yearOptions}
                    placeholder={Strings.year}
                    className="year"
                    getOptionLabel={(option) => option?.label}
                    getOptionValue={(option) => option?.value}
                  />
                </div>
              </>
            )
          }
          <div className="vr" />
          <Button
            title="Apply"
            variant="primary"
            onClick={handleApply}
          />
        </div>
      </div>
      <Row className="g-3">
        <Col xxl={7}>
          <Row className="g-3">
            <Col lg={4} md={6}>
              <ItinerariesCard
                title={Strings.total_itineraries}
                number={data?.TotalItineraryCount || 0}
                icon={iconSuitcaseRolling}
                color="blue"
                shape={ShapeTotalWave}
              />
            </Col>
            <Col lg={4} md={6}>
              <ItinerariesCard
                title={Strings.upcoming_itineraries}
                number={data?.UpcomingItineraryCount || 0}
                icon={iconClock}
                color="orange"
                shape={ShapeUpcomingWave}
              />
            </Col>
            <Col lg={4} md={6}>
              <ItinerariesCard
                title={Strings.complete_itineraries}
                number={data?.CompletedItineraryCount || 0}
                icon={iconClipboardCheck}
                color="green"
                shape={ShapeCompletedWave}
              />
            </Col>
          </Row>
        </Col>
        <Col xxl={5}>
          <div className="dashboard-event-cards">
            <Row className="g-3">
              <Col xxl={12} lg={6}>
                <Card className="orange">
                  <Card.Body>
                    <Card.Title>{data?.TotalEventCount || 0}</Card.Title>
                    <Card.Text>{Strings.total_events} </Card.Text>
                  </Card.Body>
                  <img src={imgMusicFestivalCuate} alt="musicalIcon" />
                </Card>
              </Col>
              <Col xxl={12} lg={6}>
                <Card>
                  <Card.Body>
                    <Card.Title>{data?.TotalServiceCount || 0}</Card.Title>
                    <Card.Text>{Strings.total_service}</Card.Text>
                  </Card.Body>
                  <img src={imgWaitersCuate} alt="waitersIcon" />
                </Card>
              </Col>
            </Row>
          </div>
        </Col>
        <Col lg={12}>
          <Chart chartData={data} />
        </Col>
      </Row>
    </section>
  );
};
export default ExclusivelyDashboard;
