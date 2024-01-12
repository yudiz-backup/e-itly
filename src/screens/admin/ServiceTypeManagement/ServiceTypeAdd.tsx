import { VNode } from "preact";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Col, Form, Row } from "react-bootstrap";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

// component
import Button from "src/components/Button";
import Heading from "src/components/Heading";
import TextField from "src/components/TextField";

// query
import {
  addServiceType,
  updateServiceType,
} from "src/Query/ServiceTypes/serviceTypes.mutation";
import { getServiceTypeById } from "src/Query/ServiceTypes/serviceTypes.query";
import queryClient from "src/queryClient";

import { Validation, checkErrors, convertFieldsForValidation } from "src/utils";
import { allRoutes } from "src/constants/AllRoutes";
import { hasError } from "src/services/ApiHelpers";
import { Strings } from "src/resources";

const ServiceTypeAdd = () => {
  const userRef: React.MutableRefObject<boolean> = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("serviceTypeId");

  const [serviceTypeFields, setServiceTypeFields] = useState<
    Array<InputFieldType>
  >([
    {
      type: "text",
      value: "",
      key: "serviceType",
      name: Strings.service_type_label,
      label: Strings.service_type_label,
      placeHolder: Strings.service_type_label,
      error: "",
      maxLength: 50,
      rules: "required|name|max:50|min:3",
      dataCy: "serviceType",
    },
  ]);

  // get service type by Id
  const { data } = useQuery({
    queryKey: ["getServiceTypeById", id],
    queryFn: () => getServiceTypeById(id as string),
    enabled: !!id,
    select: (data) => data?.data,
    staleTime: 0,
    onSuccess: (data) => {
      updateFields(0, "value", data?.serviceType);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
      navigate(allRoutes.serviceType);
    },
  });

  //add region
  const addServiceTypeMutation = useMutation(addServiceType, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getServiceType"]);
      navigate(allRoutes.serviceType);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

  //update ServiceType
  const updateServiceTypeMutation = useMutation(updateServiceType, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getServiceType"]);
      navigate(allRoutes.serviceType);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

  function updateFields(index: number, fieldName: string, value: any): void {
    setServiceTypeFields((prevState): Array<InputFieldType> => {
      prevState[index] = { ...prevState[index], [fieldName]: value };
      return [...prevState];
    });
  }

  function renderFields(): VNode {
    return (
      <>
        {serviceTypeFields?.map((item: InputFieldType, index) => {
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

  async function onSubmit(e: MouseEvent) {
    e.preventDefault();

    if (
      checkErrors(
        Validation.validate(convertFieldsForValidation(serviceTypeFields)),
        (index: number, value: any) => updateFields(index, "error", value)
      )
    ) {
      return;
    }

    if (!userRef.current && id) {
      toast.error(Strings.toast_filed);
      return;
    }

    const serviceTypeData = {
      serviceType: serviceTypeFields[0]?.value,
      isActive: id ? data?.isActive : true,
    };

    if (id) {
      updateServiceTypeMutation.mutate({ serviceTypeData, id });
    } else {
      addServiceTypeMutation.mutate(serviceTypeData);
    }
  }

  return (
    <section className="service-type">
      <Row>
        <Col xxl={7} lg={8} md={10}>
          <div className="table-header mb-3">
            <Heading title={id ? Strings.service_type_edit : Strings.service_type_add} />
          </div>
          <Form>
            {renderFields()}
            <div className="gap-3 d-flex mt-3">
              <Button
                title={id ? Strings.service_type_edit : Strings.service_type_save}
                variant="primary"
                onClick={onSubmit}
                isLoading={
                  updateServiceTypeMutation?.isLoading ||
                  addServiceTypeMutation?.isLoading
                }
                disabled={
                  updateServiceTypeMutation?.isLoading ||
                  addServiceTypeMutation?.isLoading
                }
                dataCy="addEditServiceTypeSave"
              />
              <Link to={allRoutes.serviceType}>
                <Button
                  title={Strings.cancel}
                  variant="outline"
                  dataCy="cancelServiceTypeBtn"
                />
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </section>
  );
};

export default ServiceTypeAdd;
