/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { Tab, Tabs } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";

// component
import ItinerarySuccessModal from "src/components/Modal/ItinerarySuccessModal";
import Button from "src/components/Button";

import Step1 from "./Step/Step1";
import Step2 from "./Step/Step2";
import Step3 from "./Step/Step3";

// query
import { addItinerary, updateItinerary } from "src/Query/Itinerary/itinerary.mutation";
import queryClient from "src/queryClient";

import { itineraryAtom } from "src/recoilState/itinerary";
import { allRoutes } from "src/constants/AllRoutes";
import { hasError } from "src/services/ApiHelpers";
import { Strings } from "src/resources";
import "./itinerary.scss";


const ItineraryAdd = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const itineraryId = queryParams.get("itineraryId");

  const [successModal, setSuccessModal] = useState({ open: false, id: '' })
  const [itineraryData, setItineraryData] = useRecoilState<ItineraryType | undefined>(
    itineraryAtom
  );

  // update itinerary
  const updateItineraryMutation = useMutation(updateItinerary, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getItineraryById"]);
      queryClient.invalidateQueries(["getItinerary"]);
      navigate(allRoutes.itinerary);
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

  //add itinerary
  const addItineraryMutation = useMutation(addItinerary, {
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["getItinerary"]);         
      setSuccessModal({ open: true, id: data?.data?.id })
    },
    onError: (error) => {
      const errorResponse = hasError(error);
      toast.error(errorResponse.message);
    },
  });

  const [key, setKey] = useState("step1");
  const [k, setK] = useState({
    step1: true,
    step2: true,
    step3: true,
  })

  function setSelectedKey(key: string) {
    if (k[key]) {
      setKey(key)
    }
  }

  async function handleItineraryAdd() {
    if (!itineraryData?.agent) {
      toast.error(Strings.agent_is_required)
    }
    else if (itineraryId) {
      const { itineraryVersion, versionNumber, ...rest } = itineraryData
      const newItineraryData = { ...rest }
      updateItineraryMutation.mutate({ newItineraryData, itineraryId });
    } else {
      addItineraryMutation.mutate(itineraryData)
      setItineraryData(undefined)
    }
  }


  return (
    <section className="itinerary">
      <div className="event-w mb-3 mb-md-5">
        <div className={`tabs-list ${key === "step1" ? "step1" : ""}`}>
          <Tabs id="profile-tabs" activeKey={key} onSelect={(k) => setSelectedKey(k)}>
            <Tab eventKey="step1" title={Strings.step_1}>
              <Step1 setK={setK} k={k} setKey={setKey} />
            </Tab>
            <Tab eventKey="step2" title={Strings.step_2}>
              <Step2 setK={setK} k={k} setKey={setKey} />
            </Tab>
            <Tab eventKey="step3" title={Strings.step_3}>
              <Step3 />
            </Tab>
          </Tabs>
        </div>
        {key === "step3" && (
          <div className="position-absolute end-0 top-0">
            <Button
              variant="outline"
              title={Strings.cancel}
              className="me-3"
              onClick={() => navigate(allRoutes.itinerary)}
            />
            <Button
              variant="primary"
              title={itineraryId ? Strings.itinerary_edit : Strings.itinerary_save}
              onClick={handleItineraryAdd}
            />
          </div>
        )}
      </div>

      <ItinerarySuccessModal
        isShowing={successModal}
        toggle={() => setSuccessModal({ open: false, id: '' })}
      />

    </section>
  );
};

export default ItineraryAdd;
