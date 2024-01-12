import React from "react";
import { Form, Col, Row, FloatingLabel } from "react-bootstrap";
import { Link } from "react-router-dom";
import Button from "src/components/Button";
// import CustomSelect from "src/components/CustomSelect";
import TableHeader from "src/components/TableHeader";
import { allRoutes } from "src/constants/AllRoutes";
import { Strings } from "src/resources";
// const options = [
//   { value: "chocolate", label: "Chocolate" },
//   { value: "strawberry", label: "Strawberry" },
//   { value: "vanilla", label: "Vanilla" },
// ];
const SendEmail = () => {
  // const [selectedOption, setSelectedOption] = useState(null);
  return (
    <section className="itinerary-bc">
      <TableHeader title={Strings.email_send} />
      <Row>
        <Col lg={12}>
          <div className="mb-3">
            {/* <CustomSelect
              defaultValue={selectedOption}
              onChange={setSelectedOption}
              options={options}
              placeholder={Strings.agency_label}
            /> */}
          </div>
        </Col>
        <Col lg={12}>
          <div className="mb-3">
            {/* <CustomSelect
              defaultValue={selectedOption}
              onChange={setSelectedOption}
              options={options}
              placeholder={Strings.agent_email}
            /> */}
          </div>
        </Col>
        <Col lg={12}>
          <FloatingLabel controlId="floatingTextarea2" label={Strings.enter_msg}>
            <Form.Control
              as="textarea"
              placeholder={Strings.enter_msg}
              className='height-152'
            />
          </FloatingLabel>
        </Col>
        <Col md={12}>
          <Form>
            <div className="gap-3 d-flex mt-3">
              <Button title={Strings.send} variant="primary" />
              <Link
                to={allRoutes.itineraryViewServiceBookingConfirmationDetails}
              >
                <Button title={Strings.cancel} variant="outline" />
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </section>
  );
};

export default SendEmail;
