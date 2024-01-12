import { EmailAuthProvider } from "firebase/auth";
import { VNode } from "preact";
import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getRecoil } from "recoil-nexus";
import CustomButton from "src/components/Button";
import TextField from "src/components/TextField";
import { allRoutes } from "src/constants/AllRoutes";
import { accountAtom } from "src/recoilState/account";
import { Strings } from "src/resources";
import { changeUserPassword } from "src/services/UserService";
import { checkErrors, convertFieldsForValidation, Validation } from "src/utils";

const UserProfileSettings = () => {
  const account = getRecoil<AccountType | undefined>(accountAtom);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fields, updateFields] = useState<Array<InputFieldType>>([
    {
      type: "password",
      value: "",
      key: "currentPassword",
      name: Strings.old_password,
      placeHolder: "******",
      error: "",
      maxLength: 256,
      rules: "required|no_space|min:8|max:256|password",
      label: Strings.old_password,
      dataCy: "currentPasswordC",
    },
    {
      type: "password",
      value: "",
      key: "newPassword",
      name: Strings.new_password,
      placeHolder: "******",
      error: "",
      maxLength: 256,
      rules: "required|no_space|min:8|max:256|password",
      label: Strings.new_password,
      dataCy: "newPasswordC",
    },
    {
      type: "password",
      value: "",
      key: "confirmPassword",
      name: Strings.confirm_password,
      placeHolder: "******",
      error: "",
      maxLength: 256,
      rules: "required|no_space|min:8|max:256|password",
      label: Strings.confirm_password,
      dataCy: "confirmPasswordC",
    },
  ]);
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
  const renderInputs = (): VNode => {
    return (
      <>
        {fields?.map((field: InputFieldType, index: number) => {
          return (
            <>
              <TextField
                type={field.type}
                value={field.value}
                onChange={(newValue: string) =>
                  updateOneField(index, "value", newValue)
                }
                placeHolder={field.placeHolder}
                id={field?.name}
                error={field.error}
                dataCy={field?.dataCy}
                label={field?.label}
                eyeIcon
              ></TextField>
            </>
          );
        })}
      </>
    );
  };
  const handleSubmit = async (e: MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (
      checkErrors(
        Validation.validate(convertFieldsForValidation(fields)),
        (index: number, value: any) => updateOneField(index, "error", value)
      )
    ) {
      setIsLoading(false);
      return;
    }
    if (fields[1].value !== fields[2].value) {
      updateOneField(
        2,
        "error",
        "Confirm Password does not match with New Password."
      );
      setIsLoading(false);
      return;
    }
    const credentials = EmailAuthProvider.credential(
      account?.emailId || "",
      fields[0].value
    );
    const changePass: AsyncResponseType = await changeUserPassword(
      credentials,
      fields[1].value
    );
    if (changePass?.success === false) {
      updateOneField(0, "error", changePass?.message);
      setIsLoading(false);
      return;
    } else {
      setIsLoading(false);
      toast.success(changePass?.message);
    }
  };
  return (
    <div>
      <Row>
        <Col xxl={4} lg={6} md={8}>
          <Form>
            {renderInputs()}
            <div className="gap-3 d-flex mt-4">
              <CustomButton
                title={Strings.save}
                variant="primary"
                onClick={handleSubmit}
                isLoading={isLoading}
                dataCy="chnageUserPasswordSave"
              />
              <CustomButton
                title={Strings.cancel}
                variant="outline"
                onClick={() => {
                  navigate(allRoutes.dashboard);
                }}
                dataCy="chnageUserPasswordCancel"
              />
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};
export default UserProfileSettings;
