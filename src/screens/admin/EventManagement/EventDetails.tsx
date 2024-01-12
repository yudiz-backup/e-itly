import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge, Col, Row } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

// component
import EventServiceModal from "src/components/Modal/EventServiceModal";
import EventBlockModal from "src/components/Modal/EventBlockModal";
import TableHeader from "src/components/TableHeader";
import ThemeTable from "src/components/ThemeTable";
import FormCard from "src/components/FormCard";
import Heading from "src/components/Heading";

// query
import { getEventById } from "src/Query/Events/event.query";
import { hasError } from "src/services/ApiHelpers";

import { SvgEyeFill, defaultImage } from "src/assets/images";
import { allRoutes } from "src/constants/AllRoutes";
import { Strings } from "src/resources";
import { truncateAndRemoveImages } from "src/utils";
import { checkUserPermission } from "src/utils/users";
import { PERMISSION, PERMISSION_VALUE } from "src/constants/permissionEnum";


const EventDetails = () => {

  const navigate = useNavigate()
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("eventId");

  const [serviceModal, setServiceModal] = useState(false)
  const [serviceData, setServiceData] = useState(null)
  const [blockModal, setBlockModal] = useState(false)
  const [blockData, setBlockData] = useState(null)

  const blockModalHandler = () => {
    setBlockModal(!blockModal);
  };

  const serviceModalHandler = () => {
    setServiceModal(!serviceModal);
  };

  const [blocksLabels] = useState([
    {
      name: Strings.block_label,
      sort: true,
      sortName: "blockName",
      sortOrder: true,
    },
    {
      name: Strings.img,
      sort: false,
      sortName: "",
      sortOrder: false,
    },
    {
      name: Strings.description,
      sort: false,
      sortName: "",
      sortOrder: false,
    },
    {
      name: Strings.duration,
      sort: false,
      sortName: "",
      sortOrder: false,
    },
    {
      name: Strings.status,
      sort: false,
      sortName: "",
      sortOrder: false,
    },
    {
      name: Strings.action,
      sort: false,
      sortName: "",
      sortOrder: false,
    },
  ]);

  const [serviceLabels] = useState([
    {
      name: Strings.service_label,
      sort: false,
      sortName: "",
      sortOrder: false,
    },
    {
      name: Strings.service_type_label,
      sort: false,
      sortName: "",
      sortOrder: false,
    },
    {
      name: Strings.region,
      sort: false,
      sortName: "",
      sortOrder: false,
    },
    {
      name: Strings.internal_cost_label,
      sort: false,
      sortName: "",
      sortOrder: false,
    },
    {
      name: Strings.external_cost_label,
      sort: false,
      sortName: "",
      sortOrder: false,
    },
    {
      name: Strings.price_per_person_label,
      sort: false,
      sortName: "",
      sortOrder: false,
    },
    {
      name: Strings.status,
      sort: false,
      sortName: "",
      sortOrder: false,
    },
    {
      name: "Action",
      sort: false,
      sortName: "",
      sortOrder: false,
    },
  ]);

  //  get  events By ID
  const { data, isFetching } = useQuery({
    queryKey: ["getEventById", id],
    queryFn: () => getEventById(id as string),
    enabled: !!id,
    select: (data) => data?.data,
    staleTime: 0,
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
      navigate(allRoutes.event);
    },
  });


  return (
    <>
      <section className="block-m-details event-details">
        <div>
          <TableHeader
            title={Strings.event_details}
            addBtn={checkUserPermission(PERMISSION.event, PERMISSION_VALUE.update) && Strings.event_edit}
            addBtnPath={checkUserPermission(PERMISSION.event, PERMISSION_VALUE.update) && `${allRoutes.eventEdit}?eventId=${id}`}
          />
          <Row>
            <Col lg={12} className="mx-auto">
              <div className="block-m-details-w">
                <Heading title={data?.eventTitle} className="mb-4" />
                <div className="event-details-cards">
                  <FormCard
                    title={Strings.event_day}
                    description={data?.eventDay}
                    direction="column"
                  />
                  <FormCard
                    title={Strings.event_duration}
                    description={data?.eventDuration}
                    direction="column"
                  />
                  <FormCard
                    title={Strings.region}
                    description={data?.region}
                    direction="column"
                  />
                </div>
                <div className="event-details-content">
                  <h5 className="mb-1">{Strings.notes}</h5>
                  <p>{data?.notes}</p>
                </div>
                <div className="event-details-content">
                  <h5>{Strings.event_block}</h5>
                  <ThemeTable
                    labels={blocksLabels}
                    isLoading={isFetching}
                    length={data?.block?.length}
                  >
                    {data?.block?.map((item: BlockType) => {
                      const { id, blockName, image, description, isActive } =
                        item;
                      return (
                        <tr key={id}>
                          <td>{blockName}</td>
                          <td>
                            {" "}
                            <img
                              src={image || defaultImage}
                              alt={blockName}
                              className="user-img"
                            />
                          </td>
                          <td>
                            <div
                              dangerouslySetInnerHTML={{
                                __html:
                                  truncateAndRemoveImages(description, 100)
                              }}
                            >
                              {description}
                            </div>
                          </td>
                          <td>{data?.eventDuration}</td>
                          <td>
                            <Badge bg={isActive ? "success" : "danger"}>
                              {isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td>
                            <div className="actions">
                              <button
                                className="table-icon"
                                onClick={() => {
                                  blockModalHandler()
                                  setBlockData(item)
                                }}
                              >
                                <SvgEyeFill size="24" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </ThemeTable>
                </div>
                <div className="event-details-content">
                  <h5>{Strings.event_service}</h5>
                  <ThemeTable
                    labels={serviceLabels}
                    length={data?.service?.length}
                  >
                    {data?.service?.map((el: ServicesType) => {
                      const {
                        id,
                        serviceName,
                        serviceType,
                        region,
                        internalCost,
                        externalCost,
                        pricePerPerson,
                        isActive,
                      } = el;
                      return (
                        <tr key={id}>
                          <td>{serviceName}</td>
                          <td>{serviceType}</td>
                          <td>{region}</td>
                          <td>{Strings.euro + internalCost}</td>
                          <td>{Strings.euro + externalCost}</td>
                          <td>
                            <Badge bg={pricePerPerson ? "success" : "danger"}>
                              {pricePerPerson ? Strings.yes : Strings.no}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={isActive ? "success" : "danger"}>
                              {isActive ? Strings.active : Strings.inactive}
                            </Badge>
                          </td>
                          <td>
                            <div className="actions">
                              <button
                                className="table-icon"
                                onClick={() => {
                                  serviceModalHandler()
                                  setServiceData(el)
                                }}
                              >
                                <SvgEyeFill size="24" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </ThemeTable>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>
      <EventBlockModal
        isShowing={blockModal}
        toggle={blockModalHandler}
        data={blockData}
      />
      <EventServiceModal
        isShowing={serviceModal}
        toggle={serviceModalHandler}
        data={serviceData}
      />
    </>
  );
};

export default EventDetails;
