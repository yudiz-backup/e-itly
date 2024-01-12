import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";

// component
import TableHeader from "src/components/TableHeader";
import Heading from "src/components/Heading";

// query
import { getTermsConditionById } from "src/Query/TermsCondition/termsCondition.query";

import { allRoutes } from "src/constants/AllRoutes";
import { Strings } from "src/resources";
import { hasError } from "src/services/ApiHelpers";


const TermsConditionsDetails = () => {

  const navigate = useNavigate()
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("termsConditionId");

  // get services by Id
  const { data } = useQuery({
    queryKey: ["getTermsConditionById", id],
    queryFn: () => getTermsConditionById(id as string),
    enabled: !!id,
    select: (data) => data?.data,
    staleTime: 0,
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
      navigate(allRoutes.termsConditions);
    },
  });


  return (
    <section className='terms-conditions'>
      <TableHeader
        title={Strings.terms_conditions_details}
        addBtn={Strings.terms_conditions_edit}
        addBtnPath={`${allRoutes.termsConditionsUpdate}?termsConditionId=${id}`}
      />
      <Row>
        <Col lg={12} className="mx-auto">
          <div className="block-m-details-w">
            <Heading title={data?.title} className="mb-4" />
            <p>
              <div
                dangerouslySetInnerHTML={{
                  __html: data?.description,
                }}
              />
            </p>
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default TermsConditionsDetails;
