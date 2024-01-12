import React from "react";
import { Col, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";

// component
import TableHeader from "src/components/TableHeader";
import FormCard from "src/components/FormCard";
import Checkbox from "src/components/Checkbox";

// query

import "./services.scss";
import { getServicesById } from "src/Query/Service/service.query";
import { useQuery } from "@tanstack/react-query";
import { allRoutes } from "src/constants/AllRoutes";
import { Strings } from "src/resources";

const ServiceDetails = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("serviceId");

  // get services by Id
  const { data } = useQuery({
    queryKey: ["getServicesById", id],
    queryFn: () => getServicesById(id as string),
    enabled: !!id,
    select: (data) => data?.data,
    staleTime: 0,
  });

  return (
    <>
      <section className="services pt-2">
        <div className="services-details">
          <TableHeader
            title={Strings.service_details}
            addBtn={Strings.service_edit}
            addBtnPath={`${allRoutes.servicesUpdate}?serviceId=${id}`}
          />
          <div className="block-m-details-w">
            <Row className="g-1 g-sm-2 g-lg-3">
              <Col lg={6}>
                <FormCard
                  title={Strings.service_label}
                  description={data?.serviceName || ""}
                />
              </Col>
              <Col lg={6}>
                <FormCard
                  title={Strings.service_type_label}
                  description={data?.serviceType || ""}
                />
              </Col>
              <Col lg={6}>
                <FormCard
                  title={Strings.supplier_label}
                  description={data?.supplierName || ""}
                />
              </Col>
              <Col lg={6}>
                <FormCard title={Strings.region} description={data?.region || ""} />
              </Col>
              <Col lg={6}>
                <FormCard
                  title={Strings.internal_cost_label}
                  description={data?.internalCost || ""}
                />
              </Col>
              <Col lg={6}>
                <FormCard
                  title={Strings.external_cost_label}
                  description={data?.externalCost || ""}
                />
              </Col>
              <Col lg={6}>
                <Checkbox
                  label={Strings.price_per_person_label}
                  checked={data?.pricePerPerson}
                  size="large"
                  disabled
                />
              </Col>
              <Col lg={12}>
                <FormCard
                  title={Strings.description}
                  description={data?.description || ""}
                />
              </Col>
            </Row>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetails;
