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
  addSupplier,
  updateSupplier,
} from "src/Query/Supplier/supplier.mutation";
import { getSupplierById } from "src/Query/Supplier/supplier.query";
import queryClient from "src/queryClient";

import { Validation, checkErrors, convertFieldsForValidation } from "src/utils";
import { allRoutes } from "src/constants/AllRoutes";
import { hasError } from "src/services/ApiHelpers";
import { Strings } from "src/resources";

const SupplierAdd = () => {
  const userRef: React.MutableRefObject<boolean> = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("supplierId");

  const [supplierFields, setSupplierFields] = useState<Array<InputFieldType>>([
    {
      type: "text",
      value: "",
      key: "supplierName",
      name: Strings.supplier_label,
      label: Strings.supplier_label,
      placeHolder: Strings.supplier_label,
      error: "",
      rules: "required|name|max:50|min:3",
      dataCy: "supplierName",
    },
    {
      type: "email",
      value: "",
      key: "email",
      name: Strings.email,
      label: Strings.email,
      placeHolder: Strings.email,
      error: "",
      rules: "required|email|name|max:50",
      dataCy: "email",
    },
  ]);

  // get supplier by Id
  const { data } = useQuery({
    queryKey: ["getSupplierById", id],
    queryFn: () => getSupplierById(id as string),
    enabled: !!id,
    select: (data) => data?.data,
    staleTime: 0,
    onSuccess: (data) => {
      updateFields(0, "value", data?.supplierName);
      updateFields(1, "value", data?.email);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
      navigate(allRoutes.suppliers);
    },
  });

  //add supplier
  const addSupplierMutation = useMutation(addSupplier, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getSupplier"]);
      navigate(allRoutes.suppliers);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

  //update supplier
  const updateSupplierMutation = useMutation(updateSupplier, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getSupplier"]);
      navigate(allRoutes.suppliers);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

  function updateFields(index: number, fieldName: string, value: any): void {
    setSupplierFields((prevState): Array<InputFieldType> => {
      prevState[index] = { ...prevState[index], [fieldName]: value };
      return [...prevState];
    });
  }

  function renderFields(): VNode {
    return (
      <>
        {supplierFields?.map((item: InputFieldType, index) => {
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
        Validation.validate(convertFieldsForValidation(supplierFields)),
        (index: number, value: any) => updateFields(index, "error", value)
      )
    ) {
      return;
    }

    if (!userRef.current && id) {
      toast.error(Strings.toast_filed);
      return;
    }

    const supplierData = {
      supplierName: supplierFields[0]?.value,
      email: supplierFields[1]?.value,
      isActive: id ? data?.isActive : true,
    };

    if (id) {
      updateSupplierMutation.mutate({ supplierData, id });
    } else {
      addSupplierMutation.mutate(supplierData);
    }
  }

  return (
    <>
      <section className="service-type">
        <Row>
          <Col xxl={7} lg={8} md={10}>
            <div className="table-header mb-3">
              <Heading title={id ? Strings.supplier_edit : Strings.supplier_add} />
            </div>
            <Form>
              {renderFields()}
              <div className="gap-3 d-flex mt-3">
                <Button
                  title={id ? Strings.supplier_edit : Strings.supplier_save}
                  variant="primary"
                  onClick={onSubmit}
                  isLoading={
                    updateSupplierMutation?.isLoading ||
                    addSupplierMutation?.isLoading
                  }
                  disabled={
                    updateSupplierMutation?.isLoading ||
                    addSupplierMutation?.isLoading
                  }
                  dataCy="adEditSupplierSave"
                />
                <Link to={allRoutes.suppliers}>
                  <Button
                    title={Strings.cancel}
                    variant="outline"
                    dataCy="cancelSupplier"
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

export default SupplierAdd;
