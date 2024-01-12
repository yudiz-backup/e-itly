import React from "react";
import ItineraryStep2, { ItineraryStep2Type } from "../ItineraryStep2";

export type Step2Props = Pick<ItineraryStep2Type, "setK" | "k" | "setKey">;

const Step2 = ({ setK, k, setKey }: Step2Props) => {
  return <ItineraryStep2 showVersion showCost setK={setK} k={k} setKey={setKey} />;
};

export default Step2;
