import { VNode } from "preact";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import CustomButton from "src/components/Button";
import TextField from "src/components/TextField";
import { accountAtom } from "src/recoilState/account";
import "./user-profile.scss";
import { checkErrors, convertFieldsForValidation, Validation } from "src/utils";
import { updateUser } from "src/services/UserService";
import { toast } from "react-toastify";
import UserProfileImage from "./UserProfileImage";
import { allRoutes } from "src/constants/AllRoutes";
import { Strings } from "src/resources";
const UserProfileMyAccount = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useRecoilState<AccountType | undefined>(
    accountAtom
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<InputFieldType>({
    type: "file",
    value: "",
    key: "profilePhoto",
    name: "Profile Photo",
    placeHolder: "",
    error: "",
    maxLength: 50,
    rules: "max:20",
    dataCy: "editUserPhoto",
    accept: "image/png, image/gif, image/jpeg",
    file: undefined,
  });
  const [fields, updateFields] = useState<Array<InputFieldType>>([
    {
      type: "text",
      value: account?.name || "",
      key: "userName",
      name: Strings.name,
      placeHolder: Strings.name,
      error: "",
      maxLength: 50,
      rules: "required|name|max:50",
      label: Strings.name,
      dataCy: "editUserName",
    },
    {
      type: "text",
      value: account?.emailId || "",
      key: "userEmail",
      name: Strings.email,
      placeHolder: Strings.email,
      error: "",
      maxLength: 50,
      rules: "required|email|max:50",
      label: Strings.email,
      dataCy: "editUserEmail",
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
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    setProfileImage((prevObject) => ({
      ...prevObject,
      value: URL.createObjectURL(file!),
      file: file,
    }));
  };
  useEffect(() => {
    if (account?.profilePhoto) {
      const image = account?.profilePhoto;
      setProfileImage((prevObject) => ({
        ...prevObject,
        value: image,
      }));
    }
    if (account?.name) {
      updateOneField(0, "value", account?.name);
    }
    if (account?.emailId) {
      updateOneField(1, "value", account?.emailId);
    }
  }, [account]);

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
                eyeIcon={field?.key == "password" ? true : false}
              ></TextField>
            </>
          );
        })}
      </div>
    );
  };
  const handleSubmit = async (e: MouseEvent) => {
    setIsLoading(true);
    e.preventDefault();
    if (
      checkErrors(
        Validation.validate(convertFieldsForValidation(fields)),
        (index: number, value: any) => updateOneField(index, "error", value)
      )
    ) {
      setIsLoading(false);
      return;
    }

    const formdata = new FormData();
    if (profileImage?.file) {
      formdata.append("profilePhoto", profileImage?.file);
    }
    formdata.append("emailId", fields[1]?.value);
    formdata.append("name", fields[0]?.value);
    formdata.append("permission", JSON.stringify(account?.permission));
    formdata.append("isActive", account!.isActive!.toString());
    const user: AsyncResponseType = await updateUser(
      formdata,
      account?.emailId || ""
    );
    if (user?.success) {
      setAccount((prevObject: any) => ({
        ...prevObject,
        name: fields[0]?.value,
        emailId: fields[1]?.value,
        profilePhoto: profileImage?.value,
      }));
      toast.success(user?.data?.message);
      navigate(allRoutes.termsConditions);
    } else {
      toast.success(user?.data?.message);
    }
    setIsLoading(false);
  };
  return (
    <div>
      <Row>
        <Col xxl={4} lg={6} md={8}>
          <Form>
            <UserProfileImage
              handleFileUpload={handleFileUpload}
              accept={profileImage?.accept}
              value={profileImage?.value}
            />
            {renderInputs()}
            <div className="gap-3 d-flex mt-4">
              <CustomButton
                title={Strings.save}
                variant="primary"
                onClick={handleSubmit}
                isLoading={isLoading}
                dataCy="editUserProfileButton"
              />
              <CustomButton
                variant="outline"
                title={Strings.cancel}
                onClick={() => {
                  navigate(allRoutes.dashboard);
                }}
                dataCy="editUserProfileCancel"
              />
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default UserProfileMyAccount;
