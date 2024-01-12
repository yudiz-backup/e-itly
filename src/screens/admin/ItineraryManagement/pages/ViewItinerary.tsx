import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, Col, Row } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

// component
import ItineraryModalExportBD from "../components/ItineraryModalExportBD";
import ItineraryFooter from "../components/ItineraryFooter";
import ItineraryViewStep2 from "./ItineraryViewStep2";
import IconButton from "src/components/IconButton";
import Heading from "src/components/Heading";
import Button from "src/components/Button";
import Version from "../components/Version";

// query
import { getItineraryById, getItineraryExportBd } from "src/Query/Itinerary/itinerary.query";
import { hasError } from "src/services/ApiHelpers";

import { iconDownload, iconMessage } from "src/assets/images";
import { allRoutes } from "src/constants/AllRoutes";
import { Strings } from "src/resources";
import { downloadPdf } from "../helper";
import api from "src/config/api";


const ViewItinerary = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const itineraryId = queryParams.get("itineraryId");

  const [selectedVersion, setSelectedVersion] = useState(null);
  const [exportBDModal, setExportBDModal] = useState(false);
  const exportBDModalHandler = () => setExportBDModal(!exportBDModal);

  //  get  Itinerary By ID
  const { data } = useQuery({
    queryKey: ["getItineraryById", itineraryId],
    queryFn: () => getItineraryById(itineraryId as string),
    enabled: !!itineraryId,
    select: (data) => data?.data,
    staleTime: 0,
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
      navigate(allRoutes.itinerary);
    },
  });

  //  get  Export Bd By ID
  const { data: exportData } = useQuery({
    queryKey: ["getExportBd", itineraryId],
    queryFn: () => getItineraryExportBd(itineraryId as string),
    select: (data) => data?.data,
    staleTime: 0,
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

  function handleVersionSelect(selectedVersionData: any) {
    setSelectedVersion(selectedVersionData)
  }

  function handleEdit() {
    navigate(`${allRoutes.itineraryEdit}?itineraryId=${itineraryId}`)
  }

  function handleDownloadItinerary() {
    const url = `${import.meta.env.VITE_API_URL}${api.itinerary_module.itinerary_download}/${itineraryId}?version=${selectedVersion?.versionNumber || data?.versionNumber}`;
    downloadPdf(url)
  }

  return (
    <section className="view-details">
      <div className="mb-24">
        <div className="flex-between view-details-header">
          <div className="table-header">
            <Heading title={Strings.itinerary_view_details} />
          </div>
          <div className="view-details-head">

            <Link to={allRoutes.messageThread} state={data}>
              <Button title={Strings.agent_chat} variant="primary" />
            </Link>

            <Button title={Strings.export_bd} variant="primary" onClick={exportBDModalHandler} />

            <Link to={allRoutes.itineraryGenerateQuotationDetails} state={selectedVersion || data}>
              <Button title={Strings.generate_quotation} variant="primary" />
            </Link>

            <Button
              title={Strings.itinerary_edit}
              variant="primary"
              onClick={() => handleEdit()}
            />

            <IconButton
              icon={iconDownload}
              onClick={handleDownloadItinerary}
            />

            <Link to={allRoutes.itinerarySendMessage}>
              <IconButton icon={iconMessage} />
            </Link>

          </div>
        </div>
        <div className="mb-12">
          <Heading title={Strings.step_1} variant="small" />
          <div className="position-relative">
            <Version versionData={data?.itineraryVersion} handleChangeVersion={handleVersionSelect} currentVersion={data?.versionNumber} />
          </div>
        </div>
        <div className="view-details-cards">
          <div className="table-header mb-3">
            <Heading title={Strings.itinerary_details} />
          </div>
          <Row className="g-3">
            <Col xl={2} lg={3} md={4} sm={6}>
              <Card>
                <Card.Title>{Strings.itinerary_id}</Card.Title>
                <Heading
                  variant="medium"
                  title={selectedVersion ? selectedVersion?.itineraryId : data?.itineraryId}
                  className="card-text" />
              </Card>
            </Col>
            <Col xl={2} lg={3} md={4} sm={6}>
              <Card>
                <Card.Title>{Strings.itinerary_name}</Card.Title>
                <Heading
                  variant="medium"
                  title={selectedVersion ? selectedVersion?.itineraryName : data?.itineraryName}
                  className="card-text"
                />
              </Card>
            </Col>
            <Col xl={2} lg={3} md={4} sm={6}>
              <Card>
                <Card.Title>{Strings.start_date}</Card.Title>
                <Heading
                  variant="medium"
                  title={selectedVersion ? selectedVersion?.startDate : data?.startDate}
                  className="card-text"
                />
              </Card>
            </Col>
            <Col xl={2} lg={3} md={4} sm={6}>
              <Card>
                <Card.Title>{Strings.end_date}</Card.Title>
                <Heading
                  variant="medium"
                  title={selectedVersion ? selectedVersion?.endDate : data?.endDate}
                  className="card-text"
                />
              </Card>
            </Col>
            <Col xl={2} lg={3} md={4} sm={6}>
              <Card>
                <Card.Title>{Strings.day}</Card.Title>
                <Heading
                  variant="medium"
                  title={selectedVersion ? selectedVersion?.noOfDay : data?.noOfDay}
                  className="card-text" />
              </Card>
            </Col>
          </Row>
        </div>
        <div className="view-details-cards">
          <div className="table-header mb-3">
            <Heading title={Strings.participant_list} />
          </div>
          <Row className="g-3">
            {
              (selectedVersion ? selectedVersion?.participantList : data?.participantList)?.map((item: string, index: any) => {
                return (
                  <Col xxl={2} lg={4} sm={6} key={index}>
                    <Card>
                      <Heading title={item} variant="small" />
                    </Card>
                  </Col>
                )
              })
            }
          </Row>
        </div>
      </div>
      <ItineraryViewStep2 stepTitle="Step 2" data={selectedVersion || data} />
      <ItineraryFooter
        data={data}
        selectedVersion={selectedVersion}
        exportData={exportData}
      />

      <ItineraryModalExportBD
        isShowing={exportBDModal}
        eventModalCloseHandler={exportBDModalHandler}
        itineraryData={data}
        exportData={exportData}
      />
    </section>
  );
};

export default ViewItinerary;
