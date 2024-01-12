import { Link, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";

import Button from "src/components/Button";
import AuthForm from "../components/AuthForm";
import TextField from "src/components/TextField";
import { allRoutes } from "src/constants/AllRoutes";
import React, { useState } from "react";
import { VNode } from "preact";
import { checkErrors, convertFieldsForValidation, Validation } from "src/utils";
import { loginUser } from "src/services/AuthService";
import { toast } from "react-toastify";
import { setRecoil } from "recoil-nexus";
import { accountAtom } from "src/recoilState/account";
import { Strings } from "src/resources";
import { useMutation } from "@tanstack/react-query";
import { getUserRole } from "src/Query/UserRole/userRole.query";
import { setItem } from "src/utils/storage";
import { localStorageKey } from "src/constants/generics";

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const getUserRoleMutation = useMutation(getUserRole, {
    onSuccess: (data) => {
      setItem(localStorageKey.userRole, data?.data?.userRole)
      navigate(allRoutes.dashboard)
    },
  });


  const [loginFields, setLoginFields] = useState<Array<InputFieldType>>([
    {
      type: "text",
      label: Strings.email,
      value: "",
      key: "email",
      name: Strings.email,
      error: "",
      maxLength: 50,
      rules: "required|email|max:50",
      dataCy: "loginEmail",
    },
    {
      type: "password",
      label: Strings.password,
      value: "",
      key: "password",
      name: Strings.password,
      error: "",
      maxLength: 256,
      rules: "required|no_space|min:8|max:256|password",
      dataCy: "loginPassword",
    },
  ]);
  const updateFields = (index: number, fieldName: string, value: any): void => {
    setLoginFields((prevState): Array<InputFieldType> => {
      prevState[index] = { ...prevState[index], [fieldName]: value };
      return [...prevState];
    });
  };

  const renderInputs = (): VNode => {
    return (
      <div>
        {loginFields.map((field: InputFieldType, index: number) => {
          return (
            <>
              <TextField
                label={field?.label}
                type={field.type}
                value={field.value}
                onChange={(newValue: string) => {
                  updateFields(index, "value", newValue.trim());
                }}
                placeHolder={field.placeHolder}
                error={field.error}
                dataCy={field?.dataCy}
                id={field?.key}
                eyeIcon={field?.key == "password" ? true : false}
              ></TextField>
            </>
          );
        })}
      </div>
    );
  };

  const submitLoginForm = async (event: MouseEvent) => {
    event.preventDefault();
    if (
      checkErrors(
        Validation.validate(convertFieldsForValidation(loginFields)),
        (index: number, value: any) => updateFields(index, "error", value)
      )
    )
      return;
    setIsLoading(true);
    const login: any = await loginUser(
      loginFields[0].value,
      loginFields[1].value
    );
    setIsLoading(false);
    if (!login?.success) {
      navigate(allRoutes.login);
      return toast.error(login?.message);
    } else {
      setItem(localStorageKey.authToken, login?.data?.accessToken)
      getUserRoleMutation.mutate()
      setRecoil<AccountType | undefined>(accountAtom, {
        id: login?.data?.uid || "",
        emailId: login?.data?.emailId || "",
        isAdmin: true,
        profilePhoto: login?.data?.profilePhoto,
        name: login?.data?.name,
      });
      return toast.success(login?.message);
    }
  };
  return (
    <div className="login">
      <AuthForm title={Strings.login}>
        <Form>
          {renderInputs()}
          <div className="form-link">
            <Link to={allRoutes.forgotPassword} data-cy="forgot-password">
              {Strings.forgot_pass_title}?
            </Link>
          </div>
          <Button
            title={Strings.login}
            variant="primary"
            fullWidth
            onClick={(event: MouseEvent) => submitLoginForm(event)}
            isLoading={isLoading}
            dataCy="loginButton"
          />
        </Form>
      </AuthForm>
    </div>
  );
}

export default Login;
