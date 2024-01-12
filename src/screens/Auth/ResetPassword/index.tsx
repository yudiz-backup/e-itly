import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { VNode } from "preact";

// component
import TextField from "src/components/TextField";
import AuthForm from "../components/AuthForm";
import Button from "src/components/Button";

// services
import { resetPassword } from "src/services/AuthService";

import { Validation, checkErrors, convertFieldsForValidation } from "src/utils";
import { allRoutes } from "src/constants/AllRoutes";
import { hasError } from "src/services/ApiHelpers";
import { Strings } from "src/resources";

function ResetPassword() {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const continueUrl = searchParams.get('continueUrl')
  const code = searchParams.get('oobCode')
  const continueUrlParams = new URL(continueUrl);
  const actionParam = continueUrlParams.searchParams.get("action");

  useEffect(() => {
    if (!code) {
      navigate(allRoutes.login)
    }
  }, [])

  const [fields, updateFields] = useState<Array<InputFieldType>>([
    {
      type: "password",
      label: Strings.new_password,
      value: "",
      key: "password",
      name: Strings.new_password,
      error: "",
      maxLength: 256,
      rules: "required|no_space|min:8|max:256|password",
      dataCy: "newResetPass",
    },
    {
      type: "password",
      label: Strings.re_enter_pass,
      value: "",
      key: "confirm_password",
      name: Strings.confirm_password,
      error: "",
      maxLength: 256,
      rules: "required|no_space|min:8|max:256|password",
      dataCy: "confirmResetPass",
    },
  ]);


  const resetPasswordMutation = useMutation(resetPassword, {
    onSuccess: (data) => {
      toast.success(data?.message);
      navigate(allRoutes.login);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  })

  const renderInputs = (): VNode => {
    return (
      <div>
        {fields.map((field: InputFieldType, index: number) => {
          return (
            <>
              <TextField
                label={field?.label}
                type={field.type}
                value={field.value}
                onChange={(newValue: string) => {
                  updateOneField(index, "value", newValue.trim());
                }}
                placeHolder={field.placeHolder}
                error={field.error}
                dataCy={field?.dataCy}
                id={field?.key}
                eyeIcon={field?.type == "password" ? true : false}
              ></TextField>
            </>
          );
        })}
      </div>
    );
  };

  const updateOneField = (
    index: number,
    fieldName: string,
    value: any
  ): void => {
    updateFields((prevState): Array<InputFieldType> => {
      prevState[index] = { ...prevState[index], [fieldName]: value };
      return [...prevState];
    });
  };

  const submit = async (event: MouseEvent) => {

    event.preventDefault();
  
    if (
      checkErrors(
        Validation.validate(convertFieldsForValidation(fields)),
        (index: number, value: any) => updateOneField(index, "error", value)
      )
    )
      return;

    const resetPasswordData = {
      actionCode: code,
      newPassword: fields[0].value
    }

    resetPasswordMutation.mutate(resetPasswordData)

  };


  return (
    <>
      <AuthForm title={actionParam === "resetPassword" ? Strings.reset_password : Strings.set_password}>
        <Form>
          {renderInputs()}
          <div className="mt-4">
            <Button
              title={Strings.save_password}
              variant="primary"
              fullWidth
              onClick={(event: MouseEvent) => submit(event)}
              dataCy="resetPasswordButton"
            />
          </div>
        </Form>
      </AuthForm>
    </>
  );
}

export default ResetPassword;
