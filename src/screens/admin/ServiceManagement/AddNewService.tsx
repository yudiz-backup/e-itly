import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";

// component
import CustomSelect from "src/components/CustomSelect";
import TextField from "src/components/TextField";
import Checkbox from "src/components/Checkbox";
import Heading from "src/components/Heading";
import Button from "src/components/Button";

// query
import {
  addServices,
  updateServices,
} from "src/Query/Service/service.mutation";
import { getServiceTypes } from "src/Query/ServiceTypes/serviceTypes.query";
import { getServicesById } from "src/Query/Service/service.query";
import { getSupplier } from "src/Query/Supplier/supplier.query";
import { getRegion } from "src/Query/Region/region.query";
import queryClient from "src/queryClient";

import { allRoutes } from "src/constants/AllRoutes";
import { hasError } from "src/services/ApiHelpers";
import { Strings } from "src/resources";

const AddNewService = () => {
  const { control, handleSubmit, reset, formState } = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("serviceId");

  // get services by Id
  useQuery({
    queryKey: ["getServicesById", id],
    queryFn: () => getServicesById(id as string),
    enabled: !!id,
    select: (data) => data?.data,
    staleTime: 0,
    onSuccess: (data) => {
      reset({
        serviceName: data?.serviceName,
        serviceType: { serviceType: data?.serviceType },
        supplierName: { supplierName: data?.supplierName, id: data?.supplierId, email: data?.supplierEmail },
        regionName: { regionName: data?.region },
        internalCost: data?.internalCost,
        externalCost: data?.externalCost,
        pricePerPerson: data?.pricePerPerson,
        description: data?.description,
      });
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
      navigate(allRoutes.services);
    },
  });

  const limit: ServiceTypeFilterType = {
    limit: 100,
    search: "",
    isActive: true
  };

  // get Service-Type List
  const { data: serviceTypeList } = useQuery({
    queryKey: ["getServiceType", limit],
    queryFn: () => getServiceTypes(limit),
    select: (data) => data?.data?.serviceTypes,
  });

  // get Region List
  const { data: regionList } = useQuery({
    queryKey: ["getRegion", limit],
    queryFn: () => getRegion(limit),
    select: (data) => data?.data?.regions,
  });

  // get supplier List
  const { data: supplierList } = useQuery({
    queryKey: ["getSupplier", limit],
    queryFn: () => getSupplier(limit),
    select: (data) => data?.data?.suppliers,
  });

  //add services
  const addServiceMutation = useMutation(addServices, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getService"]);
      navigate(allRoutes.services);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

  //update services
  const updateServicesMutation = useMutation(updateServices, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getService"]);
      navigate(allRoutes.services);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

  async function onSubmit(data: any) {
    const {
      description,
      externalCost,
      internalCost,
      pricePerPerson,
      regionName,
      serviceName,
      serviceType,
      supplierName,
    } = data;

    const servicesData = {
      serviceName,
      serviceType: serviceType?.serviceType,
      supplierName: supplierName?.supplierName,
      supplierId: supplierName?.id,
      supplierEmail: supplierName?.email,
      region: regionName?.regionName,
      internalCost,
      externalCost,
      pricePerPerson: pricePerPerson || false,
      description,
      isActive: id ? data?.isActive : true,
    };

    if (id) {
      if (!formState.isDirty) {
        toast.error(Strings.toast_filed);
      } else {
        updateServicesMutation.mutate({ servicesData, id });
      }
    } else {
      addServiceMutation.mutate(servicesData);
    }
  }

  return (
    <>
      <section className="services">
        <div className="table-header mb-3">
          <Heading title={id ? Strings.service_edit : Strings.service_add} />
        </div>
        <Form>
          <Row>
            <Col lg={6}>
              <Controller
                name="serviceName"
                control={control}
                rules={{
                  required: "Service Name is required",
                  minLength: { value: 3, message: "Service Name must be at least 3 characters." }
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => {
                  return (
                    <TextField
                      value={value}
                      error={error?.message}
                      onChange={onChange}
                      label={Strings.service_label}
                      placeHolder={Strings.service_label}
                      dataCy="serviceName"
                    />
                  );
                }}
              />
            </Col>
            <Col lg={6}>
              <Controller
                name="serviceType"
                control={control}
                rules={{ required: "Service Type is required" }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => {
                  return (
                    <div className="mb-3">
                      <CustomSelect
                        options={serviceTypeList!}
                        value={value}
                        onChange={onChange}
                        placeholder={Strings.service_type_label}
                        getOptionLabel={(option) => option?.serviceType}
                        getOptionValue={(option) => option?.serviceType}
                        error={error?.message}
                        dataCy="serviceType"
                      />
                    </div>
                  );
                }}
              />
            </Col>
            <Col lg={6}>
              <Controller
                name="supplierName"
                control={control}
                rules={{ required: "Supplier Name is required" }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => {
                  return (
                    <div className="mb-3">
                      <CustomSelect
                        options={supplierList!}
                        value={value}
                        onChange={onChange}
                        placeholder={Strings.supplier_label}
                        getOptionLabel={(option) => option?.supplierName}
                        getOptionValue={(option) => option?.supplierName}
                        error={error?.message}
                        dataCy="supplierName"
                      />
                    </div>
                  );
                }}
              />
            </Col>
            <Col lg={6}>
              <Controller
                name="regionName"
                control={control}
                rules={{ required: "Region is required" }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => {
                  return (
                    <div className="mb-3">
                      <CustomSelect
                        options={regionList!}
                        value={value}
                        onChange={onChange}
                        placeholder={Strings.region_label}
                        getOptionLabel={(option) => option?.regionName}
                        getOptionValue={(option) => option?.regionName}
                        error={error?.message}
                        dataCy="regionName"
                      />
                    </div>
                  );
                }}
              />
            </Col>
            <Col lg={6}>
              <Controller
                name="internalCost"
                control={control}
                rules={{
                  required: "Internal Cost is required",
                  pattern: {
                    value: /^[0-9]*$/,
                    message: "Please enter numbers only",
                  },
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => {
                  return (
                    <TextField
                      type="number"
                      value={value}
                      error={error?.message}
                      onChange={onChange}
                      label={Strings.internal_cost_label}
                      placeHolder="Internal Cost"
                      dataCy="internalCost"
                    />
                  );
                }}
              />
            </Col>
            <Col lg={6}>
              <Controller
                name="externalCost"
                control={control}
                rules={{
                  required: "External Cost is required",
                  pattern: {
                    value: /^[0-9]*$/,
                    message: "Please enter numbers only",
                  },
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => {
                  return (
                    <TextField
                      type="number"
                      value={value}
                      error={error?.message}
                      onChange={onChange}
                      label={Strings.external_cost_label}
                      placeHolder="External Cost"
                      dataCy="externalCost"
                    />
                  );
                }}
              />
            </Col>
            <Col lg={12}>
              <div className="mt-1">
                <Controller
                  name="pricePerPerson"
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Checkbox
                        checked={value}
                        onChange={onChange}
                        label={Strings.price_per_person_label}
                      />
                    );
                  }}
                />
              </div>
            </Col>

            <Col lg={12}>
              <Controller
                name="description"
                control={control}
                rules={{
                  required: "Description is required",
                  minLength: { value: 3, message: "Description must be at least 3 characters." },
                  maxLength: { value: 700, message: "Description may not be greater than 700 characters." }
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => {
                  return (
                    <TextField
                      as="textarea"
                      value={value}
                      error={error?.message}
                      onChange={onChange}
                      label={Strings.service_description_label}
                      placeHolder={Strings.service_description_label}
                      className="height-152"
                      dataCy="description"
                    />
                  );
                }}
              />
            </Col>
          </Row>
          <div className="gap-3 d-flex mt-3">
            <Button
              title={id ? Strings.service_edit : Strings.service_save}
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              isLoading={
                updateServicesMutation?.isLoading ||
                addServiceMutation?.isLoading
              }
              disabled={
                updateServicesMutation?.isLoading ||
                addServiceMutation?.isLoading
              }
              dataCy="addEditServicesBtn"
            />
            <Link to={allRoutes.services}>
              <Button
                title={Strings.cancel}
                variant="outline"
                dataCy="cancelServicesBtn"
              />
            </Link>
          </div>
        </Form>
      </section>
    </>
  );
};

export default AddNewService;
