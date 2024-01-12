import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { getRecoil } from "recoil-nexus";

import Checkbox from "src/components/Checkbox";
import FormCard from "src/components/FormCard";
import Heading from "src/components/Heading";
import ThemeTable from "src/components/ThemeTable";
import { PERMISSION, PERMISSION_VALUE } from "src/constants/permissionEnum";

import { SubAdminListAtom } from "src/recoilState/subadminList";
import { Strings } from "src/resources";
import { getAdminDetails } from "src/services/AdminServices";

const ViewSubAdmin = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const adminId = queryParams.get("adminId");
  const subAdminList = getRecoil<SubAdminListType[] | undefined>(
    SubAdminListAtom
  );
  const [adminDetails, setAdminDetails] = useState<
    SubAdminListType | undefined
  >();
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
      payload: PERMISSION.agency,
    },
    {
      id: "09",
      name: Strings.agency_management,
      permissions: [],
      payload: PERMISSION.agent,
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

  useEffect(() => {
    if (adminDetails?.permission) {
      updatePermissions();
    }
  }, [adminDetails]);

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

  return (
    <section className="sub-admin add">
      <div className="bottom-border">
        <div className="table-header mb-3">
          <Heading title={Strings.sub_admin_view} />
        </div>
        <Form>
          <Row className="g-3">
            <Col lg={6}>
              <FormCard
                title={Strings.full_name}
                description={adminDetails?.name}
                fullWidth
                direction="column"
              />
            </Col>
            <Col lg={6}>
              <FormCard
                title={Strings.email}
                description={adminDetails?.emailId}
                fullWidth
                direction="column"
              />
            </Col>
            {/* <Col lg={6}>
              <div className="gap-3 d-flex mt-3">
                <Button title={Strings.save} variant="primary" />
                <Link to={allRoutes.subAdmin}>
                 <Button title={Strings.cancel} variant="outline" />
                </Link>
              </div>
            </Col> */}
          </Row>
        </Form>
      </div>
      <>
        <div className="table-header mb-3">
          <Heading title={Strings.roles_permission} />
        </div>
        <ThemeTable
          labels={subAdminLabels}
          isLoading={false}
          length={rolesAndPermissions?.length}
        >
          {rolesAndPermissions?.map((el: any) => {
            const { id, name, permissions } = el;
            return (
              <tr key={id}>
                <td>{name}</td>
                <td>
                  <Checkbox checked={permissions?.includes(PERMISSION_VALUE.read)} disabled />
                </td>
                <td>
                  <Checkbox checked={permissions?.includes(PERMISSION_VALUE.create)} disabled />
                </td>
                <td>
                  <Checkbox checked={permissions?.includes(PERMISSION_VALUE.update)} disabled />
                </td>
                <td>
                  <Checkbox checked={permissions?.includes(PERMISSION_VALUE.delete)} disabled />
                </td>
                <td>
                  <Checkbox checked={permissions?.includes(PERMISSION_VALUE.activeInactive)} disabled />
                </td>
              </tr>
            );
          })}
        </ThemeTable>
      </>
    </section>
  );
};

export default ViewSubAdmin;
