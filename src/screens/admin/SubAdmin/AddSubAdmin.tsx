import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import { VNode } from "preact";

// component
import CustomSelect from "src/components/CustomSelect";
import ThemeTable from "src/components/ThemeTable";
import TextField from "src/components/TextField";
import Checkbox from "src/components/Checkbox";
import Heading from "src/components/Heading";
import Button from "src/components/Button";

// query
import {
  addSubAdmin,
  getAdminDetails,
  updateAdmin,
} from "src/services/AdminServices";

import { SubAdminListAtom } from "src/recoilState/subadminList";
import { allRoutes } from "src/constants/AllRoutes";
import { Strings } from "src/resources";
import "./sub-admin.scss";

import { checkErrors, convertFieldsForValidation, Validation } from "src/utils";
import { PERMISSION, PERMISSION_VALUE } from "src/constants/permissionEnum";

const userTypeOption = [
  { value: Strings.sub_admin, label: Strings.sub_admin },
  { value: Strings.booker, label: Strings.booker }
]

const subAdminLabels = [
  {
    name: Strings.sub_admin_module_name,
    sort: false,
    sortName: "",
    sortOrder: false,
  },
  {
    name: Strings.view,
    sort: false,
    sortName: "",
    sortOrder: false,
  },
  {
    name: Strings.add_check,
    sort: false,
    sortName: "",
    sortOrder: false,
  },
  {
    name: Strings.edit,
    sort: false,
    sortName: "",
    sortOrder: false,
  },
  {
    name: Strings.delete,
    sort: false,
    sortName: "",
    sortOrder: false,
  },
  {
    name: Strings.A_I,
    sort: false,
    sortName: "",
    sortOrder: false,
  },
]

const AddSubAdmin = () => {

  const userRef: React.MutableRefObject<boolean> = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const adminId = queryParams.get("adminId");

  const [userSelectedOption, setUserSelectedOption] = useState(null)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [subAdminList, setSubAdminList] = useRecoilState<
    SubAdminListType[] | undefined
  >(SubAdminListAtom);
  const [adminDetails, setAdminDetails] = useState<
    SubAdminListType | undefined
  >();

  const [adminFields, setAdminFields] = useState<Array<InputFieldType>>([
    {
      type: "text",
      label: Strings.full_name,
      value: "",
      key: "fullName",
      name: Strings.full_name,
      error: "",
      maxLength: 50,
      rules: "required|max:50|min:3",
      dataCy: "adminName",
    },
    {
      type: "text",
      label: Strings.email,
      value: "",
      key: "emailId ",
      name: Strings.email,
      error: "",
      maxLength: 50,
      rules: "required|email|max:50",
      dataCy: "adminEmailId",
    },
    {
      type: "text",
      label: Strings.user_type,
      value: "",
      key: "userType",
      name: Strings.user_type,
      error: "",
      maxLength: 50,
      rules: "required",
      dataCy: "userType",
    },
  ]);

  const [rolesAndPermissions, setRolesAndPermissions] = useState<any>([
    {
      id: "01",
      name: Strings.itinerary_management,
      permissions: [],
      payload: PERMISSION.itinerary,
    },
    {
      id: "02",
      name: Strings.event_management,
      permissions: [],
      payload: PERMISSION.event,
    },
    {
      id: "03",
      name: Strings.block_management,
      permissions: [],
      payload: PERMISSION.block,
    },
    {
      id: "04",
      name: Strings.service_type_management,
      permissions: [],
      payload: PERMISSION.serviceType,
    },
    {
      id: "05",
      name: Strings.supplier_management,
      permissions: [],
      payload: PERMISSION.supplier,
    },
    {
      id: "06",
      name: Strings.service_management,
      permissions: [],
      payload: PERMISSION.services,
    },
    {
      id: "07",
      name: Strings.region_management,
      permissions: [],
      payload: PERMISSION.region,
    },
    {
      id: "08",
      name: Strings.agent_management,
      permissions: [],
      payload: PERMISSION.agent,
    },
    {
      id: "09",
      name: Strings.agency_management,
      permissions: [],
      payload: PERMISSION.agency,
    },
    {
      id: "10",
      name: Strings.sub_admin_title,
      permissions: [],
      payload: PERMISSION.subAdmin,
    },
    {
      id: "11",
      name: Strings.terms_conditions_management,
      permissions: [],
      payload: PERMISSION.termsCondition,
    },
  ]);


  useEffect(() => {
    fetchAdminDetails();
  }, [adminId]);

  const fetchAdminDetails = async () => {
    if (subAdminList?.length) {
      const findAdmin = subAdminList?.find((i) => i?.id === adminId);
      if (findAdmin?.id) {
        setAdminDetails(findAdmin);
      }
    } else if (adminId) {
      const admin = await getAdminDetails(adminId);
      if (admin?.success) {
        setAdminDetails(admin?.data);
      }
    }
  };

  useEffect(() => {
    updateAdminDetails();
  }, [adminDetails]);

  const updateAdminDetails = async () => {
    if (adminDetails && adminId != undefined) {
      updateFields(0, "value", adminDetails?.name);
      updateFields(1, "value", adminDetails?.emailId);
      updateFields(2, "value", adminDetails?.userType);
      setUserSelectedOption({ value: adminDetails?.userType, label: adminDetails?.userType })
      updatePermissions();
    }
  };

  const updatePermissions = () => {
    if (adminDetails?.permission) {
      const updatedRolesAndPermissions = rolesAndPermissions.map(
        (role: any) => {
          const matchingPermission = JSON.parse(adminDetails?.permission).find(
            (permission: any) => permission[role.payload]
          );

          if (matchingPermission) {
            role.permissions = matchingPermission[role.payload];
          }

          return role;
        }
      );
      setRolesAndPermissions(updatedRolesAndPermissions);
    }
  };

  const handleChangePermission = (
    value: any,
    record: any,
    permission: string
  ) => {
    const updatedRolesAndPermissions = rolesAndPermissions.map((role: any) => {
      if (role.id === record.id) {
        if (value === true) {
          return {
            ...role,
            permissions: [...role.permissions, permission],
          };
        } else {
          return {
            ...role,
            permissions: role.permissions.filter((p: any) => p !== permission),
          };
        }
      }

      return role;
    });

    setRolesAndPermissions(updatedRolesAndPermissions);
  };

  const updateFields = (index: number, fieldName: string, value: any): void => {
    setAdminFields((prevState): Array<InputFieldType> => {
      prevState[index] = { ...prevState[index], [fieldName]: value };
      return [...prevState];
    });
  };

  const renderInputs = (): VNode => {
    return (
      <>
        {adminFields.map((field: InputFieldType, index: number) => {
          if (field?.key === "userType") {
            return;
          }
          else {
            return (
              <Col lg={6} key={index}>
                <TextField
                  label={field?.label}
                  type={field.type}
                  value={field.value}
                  onChange={(newValue: string) => {
                    updateFields(index, "value", newValue)
                    if (adminId) {
                      userRef.current = true
                    }
                  }}
                  placeHolder={field.placeHolder}
                  error={field.error}
                  dataCy={field?.dataCy}
                  id={field?.key}
                ></TextField>
              </Col>
            );
          }
        })}
      </>
    );
  };
  function handleSelect(e) {
    setUserSelectedOption(e)
    updateFields(2, "value", e?.value)
    if (adminId) {
      userRef.current = true
    }
  }

  const handleSubmit = async (event: MouseEvent) => {
    event.preventDefault();
    if (
      checkErrors(
        Validation.validate(convertFieldsForValidation(adminFields)),
        (index: number, value: any) => updateFields(index, "error", value)
      )
    )
      return;

    if (!userRef.current && adminId) {
      toast.error(Strings.toast_filed);
      return;
    }

    const permissionsArray = rolesAndPermissions.map(
      ({ permissions, payload }: any) => {
        const permissionsObject = { [payload]: permissions };
        return permissionsObject;
      }
    );

    const formdata = new FormData();
    if (adminFields[0]?.value) {
      formdata.append("name", adminFields[0]?.value);
    }
    formdata.append("emailId", adminFields[1]?.value);
    formdata.append("userType", adminFields[2]?.value);
    formdata.append("permission", JSON.stringify(permissionsArray));

    if (adminId) {
      if (adminDetails?.isActive) {
        formdata.append("isActive", adminDetails?.isActive.toString());
      } else {
        formdata.append("isActive", "true");
      }
      //update
      const subAdmin: AsyncResponseType = await updateAdmin(formdata, adminId);
      if (subAdmin?.success) {
        toast.success(subAdmin?.message);
        setSubAdminList([]);
        navigate(allRoutes.subAdmin);
      } else {
        toast.error(subAdmin?.message);
      }
    } else {
      formdata.append("isActive", "false");
      const subAdmin: AsyncResponseType = await addSubAdmin(formdata);
      if (subAdmin?.success) {
        toast.success(subAdmin?.message);
        setSubAdminList([]);
        navigate(allRoutes.subAdmin);
      } else {
        toast.error(subAdmin?.message);
      }
    }

    setIsLoading(false);
  };

  return (
    <section className="sub-admin add">
      <div className="bottom-border">
        <div className="table-header mb-3">
          <Heading
            title={adminId ? Strings.sub_admin_edit : Strings.sub_admin_add}
          />
        </div>
        <Form>
          <Row>
            {renderInputs()}
            <Col>
              <CustomSelect
                options={userTypeOption}
                value={userSelectedOption}
                onChange={handleSelect}
                placeholder={Strings.user_type}
                getOptionLabel={(option) => option?.label}
                getOptionValue={(option) => option?.value}
                error={adminFields[2]?.error}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <div className="gap-3 d-flex mt-3">
                <Button
                  title={
                    adminId ? Strings.sub_admin_edit : Strings.sub_admin_save
                  }
                  variant="primary"
                  onClick={(event: MouseEvent) => handleSubmit(event)}
                  isLoading={isLoading}
                  disabled={isLoading}
                />
                <Link to={allRoutes.subAdmin}>
                  <Button title={Strings.cancel} variant="outline" />
                </Link>
              </div>
            </Col>
          </Row>
        </Form>
      </div>

      <div className="table-header mb-3">
        <Heading title={Strings.roles_permission} />
      </div>
      <ThemeTable
        labels={subAdminLabels}
        isLoading={isLoading}
        length={adminFields?.length}
      >
        {rolesAndPermissions?.map((el: any) => {
          const { id, name, permissions } = el;

          return (
            <tr key={id}>
              <td>{name}</td>
              <td>
                <Checkbox
                  onChange={(e: any) => {
                    handleChangePermission(e.target.checked, el, PERMISSION_VALUE.read)
                    if (adminId) {
                      userRef.current = true
                    }
                  }}
                  checked={permissions?.includes(PERMISSION_VALUE.read)}
                />
              </td>
              <td>
                <Checkbox
                  onChange={(e: any) => {
                    handleChangePermission(e.target.checked, el, PERMISSION_VALUE.create)
                    if (adminId) {
                      userRef.current = true
                    }
                  }}
                  checked={permissions?.includes(PERMISSION_VALUE.create)}
                />
              </td>
              <td>
                <Checkbox
                  onChange={(e: any) => {
                    handleChangePermission(e.target.checked, el, PERMISSION_VALUE.update)
                    if (adminId) {
                      userRef.current = true
                    }
                  }}
                  checked={permissions?.includes(PERMISSION_VALUE.update)}
                />
              </td>
              <td>
                <Checkbox
                  onChange={(e: any) => {
                    handleChangePermission(e.target.checked, el, PERMISSION_VALUE.delete)
                    if (adminId) {
                      userRef.current = true
                    }
                  }}
                  checked={permissions?.includes(PERMISSION_VALUE.delete)}
                />
              </td>
              <td>
                <Checkbox
                  onChange={(e: any) => {
                    handleChangePermission(e.target.checked, el, PERMISSION_VALUE.activeInactive)
                    if (adminId) {
                      userRef.current = true
                    }
                  }}
                  checked={permissions?.includes(PERMISSION_VALUE.activeInactive)}
                />
              </td>
            </tr>
          );
        })}
      </ThemeTable>
    </section>
  );
};

export default AddSubAdmin;
