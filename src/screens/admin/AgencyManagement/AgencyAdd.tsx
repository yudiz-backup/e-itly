import { VNode } from "preact";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

// component
import Button from "src/components/Button";
import Heading from "src/components/Heading";
import TextField from "src/components/TextField";

// query
import { addAgency, updateAgency } from "src/Query/Agency/Agency.mutation";
import { getAgencyById } from "src/Query/Agency/Agency.query";
import queryClient from "src/queryClient";

import { Validation, checkErrors, convertFieldsForValidation } from "src/utils";
import { allRoutes } from "src/constants/AllRoutes";
import { hasError } from "src/services/ApiHelpers";
import { Strings } from "src/resources";

const AgencyAdd = () => {

  const userRef: React.MutableRefObject<boolean | null> = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("agencyId");

  const [agencyFields, setAgencyFields] = useState<Array<InputFieldType>>([
    {
      type: "text",
      value: "",
      key: "agencyName",
      name: Strings.agency_label,
      label: Strings.agency_label,
      placeHolder: Strings.agency_placeHolder,
      error: "",
      rules: "required|name|max:50|min:3",
      dataCy: "agencyName",
    },
    {
      as: "textarea",
      value: "",
      key: "location",
      name: Strings.location,
      label: Strings.location,
      placeHolder: Strings.location_placeholder,
      error: "",
      className: 'height-152',
      rules: "required|name|min:3",
      dataCy: "location",
    },
  ])

  // get Agency By Id
  const { data } = useQuery({
    queryKey: ["getAgencyById", id],
    queryFn: () => getAgencyById(id as string),
    enabled: !!id,
    select: (data) => data?.data,
    staleTime: 0,
    onSuccess: (data) => {
      updateFields(0, "value", data?.agencyName);
      updateFields(1, "value", data?.location);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
      navigate(allRoutes.agency);
    },
  });

  //add agency
  const addAgencyMutation = useMutation(addAgency, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getAgency"]);
      navigate(allRoutes.agency);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

  //update Agency
  const updateAgencyMutation = useMutation(updateAgency, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getAgency"]);
      navigate(allRoutes.agency);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

  function updateFields(index: number, fieldName: string, value: any): void {
    setAgencyFields((prevState): Array<InputFieldType> => {
      prevState[index] = { ...prevState[index], [fieldName]: value };
      return [...prevState];
    });
  }

  function renderFields(): VNode {
    return (
      <>
        {
          agencyFields?.map((item: InputFieldType, index) => {
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
                  as={item?.as}
                  className={item?.className}
                />
              </>
            )
          })
        }
      </>
    )
  }

  async function onSubmit(e: MouseEvent) {
    e.preventDefault()

    if (
      checkErrors(
        Validation.validate(convertFieldsForValidation(agencyFields)),
        (index: number, value: any) => updateFields(index, "error", value)
      )
    ) {

      return;
    }

    if (!userRef.current && id) {
      toast.error(Strings.toast_filed);
      return;
    }

    const agencyData = {
      agencyName: agencyFields[0]?.value,
      location: agencyFields[1]?.value,
      isActive: id ? data?.isActive : true,
    }

    if (id) {
      updateAgencyMutation.mutate({ agencyData, id });
    } else {
      addAgencyMutation.mutate(agencyData);
    }
  }

  return (
    <>
      <section className="service-type">
        <Row>
          <Col xxl={7} lg={8} md={10}>
            <div className="table-header mb-3">
              <Heading title={id ? Strings.agency_edit : Strings.agency_add} />
            </div>
            <Form>
              {renderFields()}
              <div className="gap-3 d-flex mt-3">
                <Button
                  title={id ? Strings.agency_edit : Strings.agency_save}
                  variant="primary"
                  onClick={onSubmit}
                  isLoading={
                    addAgencyMutation?.isLoading ||
                    updateAgencyMutation?.isLoading
                  }
                  disabled={
                    addAgencyMutation?.isLoading ||
                    updateAgencyMutation?.isLoading
                  }
                  dataCy="addEditAgencySave"
                />
                <Link to={allRoutes.agency}>
                  <Button
                    title={Strings.cancel}
                    variant="outline"
                    dataCy="cancelAgencyBtn"
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

export default AgencyAdd;
