import { VNode } from "preact";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { toast } from "react-toastify";

// component
import CustomSelect from "src/components/CustomSelect";
import TextField from "src/components/TextField";
import Button from "src/components/Button";

// query
import { getAgency } from "src/Query/Agency/Agency.query";
import { addAgent } from "src/Query/Agent/agent.mutation";

import { Validation, checkErrors, convertFieldsForValidation } from "src/utils";
import { hasError } from "src/services/ApiHelpers";
import queryClient from "src/queryClient";
import { Strings } from "src/resources";


const AddAgentDetailSidebar = ({
  agentModalCloseHandler,
  updateAgentDraggedList,
  agentData,
  agentId,
  isShowing
}: AddAgentDetailSidebarProps): VNode<any> => {

  const userRef: React.MutableRefObject<boolean | null> = useRef(null);

  const filterAgency: AgencyFilterType = {
    limit: 100,
    prevEndBeforeDocId: "",
    nextStartAfterDocId: "",
    search: "",
    firstDocId: "",
    change: false,
  };

  const [selectedOption, setSelectedOption] = useState(null);
  const [agentFields, setAgentFields] = useState<Array<InputFieldType>>([
    {
      type: "text",
      value: "",
      key: "name",
      name: Strings.agent_label,
      label: Strings.agent_label,
      placeHolder: Strings.agent_placeHolder,
      error: "",
      rules: "required|name|max:50",
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
      type: "number",
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

  useEffect(() => {
    if (agentId?.dragId) {
      updateFields(0, 'value', agentData?.name)
      updateFields(1, 'value', agentData?.email)
      updateFields(2, 'value', agentData?.agentCommission)
      updateFields(3, 'value', agentData?.agencyName)
      setSelectedOption({ agencyName: agentData?.agencyName })
    }
  }, [agentId?.dragId])

  // get Agency Data   
  const { data: agencyList } = useQuery({
    queryKey: ["getAgency", filterAgency],
    queryFn: () => getAgency(filterAgency),
    select: (data) => data?.data?.agencies
  })

  //add agent
  const addAgentMutation = useMutation(addAgent, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getAgent"]);
      handleCancelAgent()
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
                <TextField
                  key={`${item?.key}-${index}`}
                  type={item?.type}
                  name={item?.name}
                  label={item?.label}
                  value={item.value}
                  onChange={(newValue: string) => {
                    updateFields(index, "value", newValue)
                  }}
                  placeHolder={item.placeHolder}
                  error={item.error}
                  dataCy={item?.dataCy}
                  id={item?.key}
                  style={item?.style}
                  as={item?.as}
                />
              )
            }
          })
        }
      </>
    )
  }

  function handleSelect(e: any) {
    updateFields(3, 'value', e)
    setSelectedOption(e)
  }

  function handleCancelAgent() {
    updateFields(0, 'value', "")
    updateFields(1, 'value', "")
    updateFields(2, 'value', "")
    updateFields(3, 'value', "")
    setSelectedOption(null)

    agentModalCloseHandler()
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

    const agentNewData = {
      name: agentFields[0]?.value,
      email: agentFields[1]?.value,
      agentCommission: agentFields[2]?.value,
      agencyName: selectedOption?.agencyName,
      isActive: (userRef.current !== null && agentId?.dragId) ? userRef.current : false
    }


    if (agentId?.dragId || agentData) {
      updateAgentDraggedList({ agentNewData, agentId })
      handleCancelAgent()
    } else {
      addAgentMutation.mutate(agentNewData);
    }
  }

  return (
    <div className="filter-sidebar">
      <Offcanvas
        show={isShowing}
        onHide={handleCancelAgent}
        placement="end"
        className="addEvent-sidebar"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{agentId?.dragId ? Strings.agent_edit : Strings.agent_detail_add}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>

          {renderFields()}

          <CustomSelect
            options={agencyList!}
            value={selectedOption}
            onChange={handleSelect}
            placeholder={Strings.agency}
            getOptionLabel={(option) => option?.agencyName}
            getOptionValue={(option) => option?.agencyName}
            error={agentFields[3].error}
          />
          <div className="offcanvas-footer flex-between gap-4">
            <Button
              title={Strings.cancel}
              variant="outline"
              fullWidth
              onClick={handleCancelAgent}
            />
            <Button
              title={Strings.save}
              variant="primary"
              fullWidth
              onClick={onSubmit}
            />
          </div>

        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};
type AddAgentDetailSidebarProps = {
  updateAgentDraggedList: (newAgentDraggedList: any) => void;
  agentModalCloseHandler?: () => void
  toggle: (event: MouseEvent) => void;
  isShowing: boolean;
  agentData?: any;
  agentId: {
    dragId?: string;
  }
};
export default AddAgentDetailSidebar;
