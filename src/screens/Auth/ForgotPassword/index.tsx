import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { VNode } from "preact";

// component
import Button from "src/components/Button";
import AuthForm from "../components/AuthForm";
import TextField from "src/components/TextField";

// query
import { forgotPassword } from "src/services/AuthService";

import { checkErrors, convertFieldsForValidation, Validation } from "src/utils";
import { allRoutes } from "src/constants/AllRoutes";
import { hasError } from "src/services/ApiHelpers";
import { Strings } from "src/resources";

function ForgotPassword() {

  const navigate = useNavigate();

  const [forgotPasswordFields, setForgotPasswordFields] = useState<
    Array<InputFieldType>
  >([
    {
      type: "text",
      value: "",
      key: "email",
      name: Strings.email,
      placeHolder: Strings.email,
      error: "",
      maxLength: 50,
      rules: "required|email|max:50",
      dataCy: "forgotEmail",
      label: Strings.email,
    },
  ]);

  const forgotPasswordMutation = useMutation(forgotPassword, {
    onSuccess: (data) => {
      toast.success(data?.message);
      navigate(allRoutes.login);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  })

  const updateForgotPasswordFields = (
    index: number,
    fieldName: string,
    value: any
  ): void => {
    setForgotPasswordFields((prevState): Array<InputFieldType> => {
      prevState[index] = { ...prevState[index], [fieldName]: value };
      return [...prevState];
    });
  };


  const renderInputs = (): VNode => {
    return (
      <div>
        {forgotPasswordFields.map((field: InputFieldType, index: number) => {
          return (
            <>
              <TextField
                type={field.type}
                value={field.value}
                onChange={(newValue: string) =>
                  updateForgotPasswordFields(index, "value", newValue.trim())
                }
                placeHolder={field.placeHolder}
                error={field.error}
                dataCy={field?.dataCy}
                onKeyPress={(e: any) => {
                  if (e.key === "Enter") {
                    // submit(e);
                  }
                }}
                label={field?.label}
              ></TextField>
            </>
          );
        })}
      </div>
    );
  };

  const submitForgotPassword = async (event: MouseEvent) => {
    event.preventDefault();
    if (
      checkErrors(
        Validation.validate(convertFieldsForValidation(forgotPasswordFields)),
        (index: number, value: any) =>
          updateForgotPasswordFields(index, "error", value)
      )
    )
      return;

    const forgotPasswordData = {
      email: forgotPasswordFields[0]?.value
    }

    forgotPasswordMutation.mutate(forgotPasswordData)

  };
  return (
    <>
      <AuthForm
        title={Strings.forgot_pass_title}
        description={Strings.forgot_pass_description}
      >
        <Form>
          {renderInputs()}
          <div className="mt-4">
            <Button
              title={Strings.submit}
              variant="primary"
              fullWidth
              dataCy="forgotButton"
              onClick={(event: MouseEvent) => submitForgotPassword(event)}
              isLoading={forgotPasswordMutation?.isLoading}
            />
          </div>
          <div className="form-link mt-2">
            <Link to={allRoutes.login}>
              {Strings.back_to_login}
            </Link>
          </div>
        </Form>
      </AuthForm>
    </>
  );
}

export default ForgotPassword;
