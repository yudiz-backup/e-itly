import React from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";

// component
import TableHeader from "src/components/TableHeader";
import Heading from "src/components/Heading";

// query
import { getBlockById } from "src/Query/Block/block.query";
import { hasError } from "src/services/ApiHelpers";

import { allRoutes } from "src/constants/AllRoutes";
import { Strings } from "src/resources";
import "./block-management.scss";

const BlocksDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const blockId = queryParams.get("blockId");


  //  get  Block By ID
  const { data } = useQuery({
    queryKey: ["getBlockById", blockId],
    queryFn: () => getBlockById(blockId as string),
    enabled: !!blockId,
    select: (data) => data?.data,
    staleTime: 0,
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
      navigate(allRoutes.blocks);
    },
  });

  return (
    <section className="block-m-details">
      <TableHeader
        title={Strings.block_details}
        addBtn={Strings.block_edit}
        addBtnPath={`${allRoutes.blocksEdit}?blockId=${blockId}`}
      />
      <Row>
        <Col lg={12} className="mx-auto">
          <div className="block-m-details-w">
            <div>
              <Heading title={data?.blockName} className="mb-4" />
              {data?.image && <img src={data?.image} alt="Block Image" />}
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: data?.description,
              }}
            />
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default BlocksDetails;
