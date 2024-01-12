import React, { useRef, useState } from "react";
import { VNode } from "preact";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";

// component
import Button from "src/components/Button";
import Heading from "src/components/Heading";
import TextField from "src/components/TextField";

// query
import { addRegion, updateRegion } from "src/Query/Region/region.mutation";
import { getRegionById } from "src/Query/Region/region.query";

import { allRoutes } from "src/constants/AllRoutes";
import queryClient from "src/queryClient";

import { Validation, checkErrors, convertFieldsForValidation } from "src/utils";
import { hasError } from "src/services/ApiHelpers";
import { Strings } from "src/resources";

const RegionAdd = () => {
  const userRef: React.MutableRefObject<boolean> = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("regionId");

  const [regionFields, setRegionFields] = useState<Array<InputFieldType>>([
    {
      type: "text",
      value: "",
      key: "regionName",
      name: Strings.region_label,
      label: Strings.region_label,
      placeHolder: Strings.region_label,
      error: "",
      rules: "required|name|max:50|min:3",
      dataCy: "regionName",
    },
  ]);

  //  get  region By ID
  const { data } = useQuery({
    queryKey: ["getRegionById", id],
    queryFn: () => getRegionById(id as string),
    enabled: !!id,
    select: (data) => data?.data,
    staleTime: 0,
    onSuccess: (data) => {
      updateFields(0, "value", data?.regionName);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
      navigate(allRoutes.region);
    },
  });

  //add region
  const addRegionMutation = useMutation(addRegion, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getRegion"]);
      navigate(allRoutes.region);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

  //update Region
  const updateRegionMutation = useMutation(updateRegion, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getRegion"]);
      navigate(allRoutes.region);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

  function updateFields(index: number, fieldName: string, value: any): void {
    setRegionFields((prevState): Array<InputFieldType> => {
      prevState[index] = { ...prevState[index], [fieldName]: value };
      return [...prevState];
    });
  }

  function renderFields(): VNode {
    return (
      <>
        {regionFields?.map((item: InputFieldType, index) => {
          return (
            <>
              <TextField
                type={item?.type}
                name={item?.name}
                label={item?.label}
                value={item.value}
                onChange={(newValue: string) => {
                  updateFields(index, "value", newValue)
                  if (id) {
                    userRef.current = true
                  }
                }}
                placeHolder={item.placeHolder}
                error={item.error}
                dataCy={item?.dataCy}
                id={item?.key}
              />
            </>
          );
        })}
      </>
    );
  }

  function onSubmit(e: MouseEvent) {
    e.preventDefault();

    if (
      checkErrors(
        Validation.validate(convertFieldsForValidation(regionFields)),
        (index: number, value: any) => updateFields(index, "error", value)
      )
    ) {
      return;
    }

    if (!userRef.current && id) {
      toast.error(Strings.toast_filed);
      return;
    }

    const regionData = {
      regionName: regionFields[0]?.value,
      isActive: id ? data?.isActive : true,
    };
    if (id) {
      updateRegionMutation.mutate({ regionData, id });
    } else {
      addRegionMutation.mutate(regionData);
    }
  }

  return (
    <>
      <section className="service-type">
        <Row>
          <Col xxl={4} lg={6} md={8}>
            <div className="table-header mb-3">
              <Heading title={id ? Strings.region_edit : Strings.region_add} />
            </div>
            <Form>
              {renderFields()}

              <div className="gap-3 d-flex mt-3">
                <Button
                  title={id ? Strings.region_edit : Strings.region_save}
                  variant="primary"
                  onClick={onSubmit}
                  isLoading={
                    addRegionMutation?.isLoading ||
                    updateRegionMutation?.isLoading
                  }
                  disabled={
                    addRegionMutation?.isLoading ||
                    updateRegionMutation?.isLoading
                  }
                  dataCy="addEditRegionSave"
                />
                <Link to={allRoutes.region}>
                  <Button
                    title={Strings.cancel}
                    variant="outline"
                    dataCy="cancelRegionBtn"
                  />
                </Link>
              </div>
            </Form>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default RegionAdd;
