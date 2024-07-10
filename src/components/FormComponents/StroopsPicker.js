import React from "react";
import PositiveIntPicker from "./PositiveIntPicker";

export default function SequencePicker(props) {
  let { value, onUpdate } = props;

  return (
    <PositiveIntPicker
      value={value}
      placeholder="Amount in micro PI (1 lumen = 10,000,000 micro PI)"
      onUpdate={(value) => onUpdate(value)}
    />
  );
}
