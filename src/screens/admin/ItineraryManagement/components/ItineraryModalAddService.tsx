import React, { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Col, Modal, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { VNode } from "preact";

// component
import CustomSelect from "src/components/CustomSelect";
import TextField from "src/components/TextField";
import Checkbox from "src/components/Checkbox";
import Button from "src/components/Button";

// query
import { getServiceTypes } from "src/Query/ServiceTypes/serviceTypes.query";
import { addServices } from "src/Query/Service/service.mutation";
import { getSupplier } from "src/Query/Supplier/supplier.query";
import { getRegion } from "src/Query/Region/region.query";
import queryClient from "src/queryClient";

import { Strings } from "src/resources";
import { hasError } from "src/services/ApiHelpers";

const ItineraryModalAddService = ({
  serviceModalCloseHandler,
  updateServiceDraggedList,
  serviceData,
  serviceId,
  isShowing,
}: ItineraryModalAddServiceProps): VNode<any> => {

  const { control, handleSubmit, reset } = useForm();

  const limit: ServiceTypeFilterType = {
    limit: 100,
    search: "",
    isActive: true
  };


  useEffect(() => {
    if (serviceId?.dragId) {
      reset({
        serviceName: serviceData?.serviceName,
        serviceType: { serviceType: serviceData?.serviceType },
        supplierName: { supplierName: serviceData?.supplierName, id: serviceData?.supplierId, email: serviceData?.supplierEmail },
        region: { regionName: serviceData?.region },
        internalCost: serviceData?.internalCost,
        externalCost: serviceData?.externalCost,
        pricePerPerson: serviceData?.pricePerPerson,
        description: serviceData?.description,
      });
    }

  }, [serviceId?.dragId])

  // get Service-Type List
  const { data: serviceTypeList } = useQuery({
    queryKey: ["getServiceType", limit],
    queryFn: () => getServiceTypes(limit),
    select: (data) => data?.data?.serviceTypes,
    enabled: !!isShowing
  });

  // get Region List
  const { data: regionList } = useQuery({
    queryKey: ["getRegion", limit],
    queryFn: () => getRegion(limit),
    select: (data) => data?.data?.regions,
    enabled: !!isShowing
  });

  // get supplier List
  const { data: supplierList } = useQuery({
    queryKey: ["getSupplier", limit],
    queryFn: () => getSupplier(limit),
    select: (data) => data?.data?.suppliers,
    enabled: !!isShowing
  });

  //add services
  const addServiceMutation = useMutation(addServices, {
    onSuccess: (data) => {
      toast.success(data?.message);
      handleCancelService()
      queryClient.invalidateQueries(["getService"]);
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
      region,
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
      region: region?.regionName,
      internalCost,
      externalCost,
      pricePerPerson: pricePerPerson || false,
      description,
      isActive: true,
      // dropeedId: uuid(),
    };
    if (serviceId?.dragId || serviceData) {
      updateServiceDraggedList({ servicesData, serviceId })
      handleCancelService()
    } else {
      addServiceMutation.mutate(servicesData);
    }
  }

  function handleCancelService() {
    reset({
      serviceName: '',
      serviceType: '',
      supplierName: '',
      region: '',
      internalCost: '',
      externalCost: '',
      pricePerPerson: '',
      description: '',
    });
    serviceModalCloseHandler()
  }

  return (
    <Modal
      show={isShowing}
      onHide={handleCancelService}
      centered
      size="xl"
      className="itinerary-modal"
    >
      <>
        <Modal.Header closeButton>
          <Modal.Title>{serviceId?.dragId ? Strings.service_edit : Strings.service_add}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pb-0">
          <Row>
            <Col lg={6}>
              <Controller
                name="serviceName"
                control={control}
                rules={{ required: "Service Name is required" }}
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
                    <div className="mb-3 text-start">
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
                    <div className="mb-3 text-start">
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
                name="region"
                control={control}
                rules={{ required: "Region is required" }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => {
                  return (
                    <div className="mb-3 text-start">
                      <CustomSelect
                        options={regionList!}
                        value={value}
                        onChange={onChange}
                        placeholder={Strings.region_label}
                        getOptionLabel={(option) => option?.regionName}
                        getOptionValue={(option) => option?.regionName}
                        error={error?.message}
                        dataCy="region"
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
                rules={{ required: "Description is required" }}
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
          <div className="gap-3 d-flex mt-3 justify-content-center">
            <Button
              title="Add Service"
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              isLoading={addServiceMutation?.isLoading}
              disabled={addServiceMutation?.isLoading}
            />
            <Button
              title={Strings.cancel}
              variant="outline"
              onClick={handleCancelService}
            />
          </div>
        </Modal.Body>
      </>
    </Modal>
  );
};
type ItineraryModalAddServiceProps = {
  updateServiceDraggedList: (newServiceDraggedList: any) => void;
  isShowing: boolean;
  serviceId: {
    dragId?: string;
  },
  serviceData?: any
  serviceModalCloseHandler?: () => void
};
export default ItineraryModalAddService;
