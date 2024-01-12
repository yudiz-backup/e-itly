import React from "react";
import { useNavigate } from "react-router-dom";

// component
import Button from "src/components/Button";

import { calculateTotalExternalCost, calculateTotalInternalCost } from "src/utils/calculation";
import { allRoutes } from "src/constants/AllRoutes";
import { Strings } from "src/resources";
import { downloadPdf } from "../helper";
import api from "src/config/api";

const ItineraryFooter = ({ data, selectedVersion, exportData }: ItineraryFooterType) => {
  const navigate = useNavigate();

  function handleGenerateInvoice() {
    const url = `${import.meta.env.VITE_API_URL}${api.itinerary_module.generate_invoice}/${data?.id}?version=${selectedVersion?.versionNumber || data?.versionNumber}`;
    downloadPdf(url)
  }

  return (
    <div className="view-itinerary-footer">
      <ul>
        <li>
          {Strings.euro} <span>{data?.editedCost}</span>
          <p>{`${Strings.total_cost} (${Strings.edited})`}</p>
        </li>
        <li>
          {Strings.euro}<span>{calculateTotalExternalCost(data)}</span>
          <p>{`${Strings.total_cost} (${Strings.based_on_service})`}</p>
        </li>
        <li>
          {Strings.euro}<span>{calculateTotalInternalCost(data)}</span>
          <p>{Strings.internal_cost_label}</p>
        </li>
        <li className="d-flex gap-3">
          <Button
            variant="outline"
            title={Strings.service_schedule_add}
            onClick={() => navigate(allRoutes.itineraryAddServiceSchedule, { state: selectedVersion || data })}
          />
          <Button
            variant="primary"
            title={Strings.generate_invoice}
            onClick={handleGenerateInvoice}
            tooltip={!exportData && Strings.generate_invoice_tool_tip}
            disabled={!exportData}
          />
        </li>
      </ul>
    </div >
  );
};
type ItineraryFooterType = {
  data: {
    editedCost: number;
    id: string
    versionNumber: number;
  };
  selectedVersion: ItineraryVersionType;
  exportData: ExportBDModalType
}
export default ItineraryFooter;
