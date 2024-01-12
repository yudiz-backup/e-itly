import React, { useRef, useState } from 'react'
import { VNode } from "preact";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";

// component
import CustomSelect from "src/components/CustomSelect";
import TextField from "src/components/TextField";
import Heading from "src/components/Heading";
import Button from "src/components/Button";

// query
import { addAgent, updateAgent } from "src/Query/Agent/agent.mutation";
import { getAgentById } from "src/Query/Agent/agent.query";
import { getAgency } from "src/Query/Agency/Agency.query";

import { Validation, checkErrors, convertFieldsForValidation } from "src/utils";
import { allRoutes } from "src/constants/AllRoutes";
import { hasError } from "src/services/ApiHelpers";
import queryClient from "src/queryClient";
import { Strings } from "src/resources";

const AgentAdd = () => {

  const userRef: React.MutableRefObject<boolean> = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("agentId");

  const filterAgency: AgencyFilterType = {
    limit: 100,
    isActive: true,
    prevEndBeforeDocId: "",
    nextStartAfterDocId: "",
    search: "",
    firstDocId: "",
    change: false,
  };

  const [selectedOption, setSelectedOption] = useState<{ agencyName: string, address: string } | null>(null);
  const [agentFields, setAgentFields] = useState<Array<InputFieldType>>([
    {
      type: "text",
      value: "",
      key: "name",
      name: Strings.agent_label,
      label: Strings.agent_label,
      placeHolder: Strings.agent_placeHolder,
      error: "",
      rules: "required|name|max:50|min:3",
      dataCy: "name",
    },
    {
      type: "email",
      value: "",
      key: "email",
      name: Strings.email,
      label: Strings.email,
      placeHolder: Strings.email_placeHolder,
      error: "",
      rules: "required|email|max:50",
      dataCy: "email",
    },
    {
      type: "text",
      value: "",
      key: "agentCommission",
      name: Strings.agent_commission,
      label: Strings.agent_commission,
      placeHolder: Strings.agent_commission,
      error: "",
      rules: "required|percentage",
      dataCy: "email",
    },
    {
      type: "text",
      value: "",
      key: "agencyName",
      name: Strings.agency,
      label: Strings.agency,
      placeHolder: Strings.agency,
      error: "",
      rules: "required",
      dataCy: "agencyName",
    },
  ])


  // get Agency Data   
  const { data: agencyList } = useQuery({
    queryKey: ["getAgency", filterAgency],
    queryFn: () => getAgency(filterAgency),
    select: (data) => data?.data?.agencies
  })

  // get agent by Id
  const { data } = useQuery({
    queryKey: ["getAgentById", id],
    queryFn: () => getAgentById(id as string),
    enabled: !!id,
    select: (data) => data?.data,
    staleTime: 0,
    onSuccess: (data) => {
      updateFields(0, 'value', data?.name)
      updateFields(1, 'value', data?.email)
      updateFields(2, 'value', data?.agentCommission)
      updateFields(3, 'value', data?.agencyName)
      setSelectedOption({ agencyName: data?.agencyName, address: data?.agencyAddress })
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
      navigate(allRoutes.agent);
    },
  });

  //add agent
  const addAgentMutation = useMutation(addAgent, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getAgent"]);
      navigate(allRoutes.agent);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

  //update Agent
  const updateAgentMutation = useMutation(updateAgent, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getAgent"]);
      navigate(allRoutes.agent);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });


  function updateFields(
    index: number,
    fieldName: string,
    value: any
  ): void {
    setAgentFields((prevState): Array<InputFieldType> => {
      prevState[index] = { ...prevState[index], [fieldName]: value };
      return [...prevState];
    })
  }


  function renderFields(): VNode {
    return (
      <>
        {
          agentFields?.map((item: InputFieldType, index) => {
            if (item?.key === 'agencyName') {
              return;
            }
            else {
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
                    style={item?.style}
                    as={item?.as}
                  />
                </>
              )
            }
          })
        }
      </>
    )
  }

  async function onSubmit(e: MouseEvent) {
    e.preventDefault()


    if (
      checkErrors(
        Validation.validate(convertFieldsForValidation(agentFields)),
        (index: number, value: any) => updateFields(index, "error", value)
      )
    ) {

      return;
    }

    if (!userRef.current && id) {
      toast.error(Strings.toast_filed);
      return;
    }

    const agentData = {
      name: agentFields[0]?.value,
      email: agentFields[1]?.value,
      agentCommission: agentFields[2]?.value,
      agencyName: selectedOption?.agencyName,
      agencyAddress: selectedOption?.address,
      isActive: id ? data?.isActive : true,
    }
    if (id) {
      updateAgentMutation.mutate({ agentData, id });
    } else {
      addAgentMutation.mutate(agentData);
    }
  }

  function handleSelect(e: any) {
    updateFields(3, 'value', e)
    setSelectedOption({
      agencyName: e?.agencyName,
      address: e?.location
    })
    if (id) {
      userRef.current = true
    }
  }
  
  return (
    <section className="pt-2">
      <Row>
        <Col xxl={7} lg={8} md={10}>
          <div className="table-header mb-3">
            <Heading title={id ? Strings.agent_edit : Strings.agent_add} />
          </div>
          <Form>

            {renderFields()}

            <CustomSelect
              options={agencyList!}
              value={selectedOption}
              onChange={handleSelect}
              placeholder={Strings.select_agency}
              getOptionLabel={(option) => option?.agencyName}
              getOptionValue={(option) => option?.agencyName}
              error={agentFields[3].error}
            />
            <div className="gap-3 d-flex mt-3">
              <Button
                title={id ? Strings.agent_edit : Strings.agent_save}
                variant="primary"
                onClick={onSubmit}
                isLoading={
                  addAgentMutation?.isLoading ||
                  updateAgentMutation?.isLoading
                }
                disabled={
                  addAgentMutation?.isLoading ||
                  updateAgentMutation?.isLoading
                }
                dataCy="addEditAgentSave"
              />
              <Link to={allRoutes.agent}>
                <Button
                  title={Strings.cancel}
                  variant="outline"
                  dataCy="cancelAgentBtn"
                />
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </section>
  );
};

export default AgentAdd;

