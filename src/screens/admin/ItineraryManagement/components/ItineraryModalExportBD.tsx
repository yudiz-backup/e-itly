import React, { useEffect } from "react";
import { ButtonGroup, Col, Modal, OverlayTrigger, Row, ToggleButton, Tooltip } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { VNode } from "preact";

// component
import TextField from "src/components/TextField";
import Button from "src/components/Button";

import { percentageRegExp, positiveNumberWithDecimal, rules } from "src/utils/validationPattern";
import useItineraryExportBDModal from "../hooks/useItineraryExportBDModal";
import { Strings } from "src/resources";

const radios = [
  { name: Strings.percentage, value: Strings.percentage },
  { name: Strings.euro, value: Strings.euro },
];

const ItineraryModalExportBD = ({
  isShowing,
  itineraryData,
  exportData,
  eventModalCloseHandler,
}: ItineraryModalExportBDProps): VNode<any> => {

  const {
    control,
    handleSubmit,
    radioValue,
    setRadioValue,
    handleCloseExportBdModal,
    onSubmit,
    getExportBdSuccessModal,
  } = useItineraryExportBDModal({ exportData, eventModalCloseHandler, itineraryData })

  useEffect(() => {
    if (isShowing) {
      getExportBdSuccessModal(exportData)
    }
  }, [isShowing])

  return (
    <Modal
      show={isShowing}
      onHide={handleCloseExportBdModal}
      centered
      className="itinerary-modal itinerary-modal-exportBD"
    >

      <Modal.Header closeButton>
        <Modal.Title>{Strings.export_bd_title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pb-0">
        <Row>
          <Col lg={12}>
            <Row>
              <Col sm={9}>
                <Controller
                  name="cartasi"
                  control={control}
                  rules={{
                    pattern: {
                      value: radioValue === Strings.percentage ? percentageRegExp : positiveNumberWithDecimal,
                      message: radioValue === Strings.percentage ? "Enter valid percentage" : "Enter Valid Amount"
                    }
                  }}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => {
                    return (
                      <TextField
                        value={value}
                        onChange={onChange}
                        error={error?.message}
                        placeHolder={Strings.export_bd_cartasi}
                        dataCy="cartasi"
                        label={
                          <>
                            {Strings.export_bd_cartasi}
                            <OverlayTrigger
                              placement="right"
                              delay={{ show: 250, hide: 400 }}
                              overlay={<Tooltip id="button-tooltip-2">{Strings.cartasi_tool_tip}</Tooltip>}
                            >
                              <span className='pe-auto'>( i )</span>
                            </OverlayTrigger>
                          </>
                        }
                      />
                    );
                  }}
                />
              </Col>
              <Col sm={3} className="px-0">
                <ButtonGroup className='btn-cartasi'>
                  {radios.map((radio, idx) => (
                    <ToggleButton
                      key={idx}
                      id={`radio-${idx}`}
                      type="radio"
                      variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                      name="radio"
                      value={radio.value}
                      checked={radioValue === radio.value}
                      onChange={(e) => {
                        setRadioValue(e.currentTarget.value)
                      }}
                    >
                      {radio.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
              </Col>
            </Row>
          </Col>
          <Col lg={12}>
            <Controller
              name="agentCommission"
              control={control}
              rules={rules?.percentage(Strings.agent_commission, true)}
              render={({ field: { value, onChange }, fieldState: { error }, }) => {
                return (
                  <TextField
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                    label={Strings.agent_commission}
                    placeHolder={Strings.agent_commission}
                    dataCy="agentCommission"
                  />
                );
              }}
            />
          </Col>
          {/* <Col lg={12}>
            <Controller
              name="agencyAddress"
              control={control}
              rules={rules?.global(Strings.agency_address)}
              render={({ field: { value, onChange }, fieldState: { error }, }) => {
                return (
                  <TextField
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                    label={Strings.agency_address}
                    placeHolder={Strings.agency_address}
                    dataCy="agencyAddress"
                  />
                );
              }}
            />
          </Col> */}
        </Row>

        <div className="gap-3 d-flex mt-3 justify-content-center">
          <Button
            title={Strings.cancel}
            variant="outline"
            onClick={handleCloseExportBdModal}
            fullWidth
          />
          <Button
            title={Strings.save}
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            fullWidth
          />
        </div>

      </Modal.Body>

    </Modal>
  );
};
type ItineraryModalExportBDProps = {
  isShowing: boolean;
  eventModalCloseHandler?: () => void;
  itineraryData?: any;
  exportData?: ExportBDModalType
};
export default ItineraryModalExportBD;
