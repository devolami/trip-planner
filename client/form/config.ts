import { InputConfigProps } from "./types";

export const formConfig: InputConfigProps[] = [
  {
    name: "current_location",
    type: "text",
    placeholder: "Where are you now?",
    id: "current_location",
    label: "Current location",
    validationRules: {
      required: "Current location is required",
    },
  },
  {
    name: "pickup_location",
    type: "text",
    placeholder: "Where to pick up the item?",
    id: "pickup_location",
    label: "Pickup location",
    validationRules: {
      required: "Pickup location is required",
    },
  },
  {
    name: "drop_off_location",
    type: "text",
    placeholder: "Where to deliver the item?",
    id: "drop_off_location",
    label: "Drop-off location",
    validationRules: {
      required: "Drop-off location is required",
    },
  },
  {
    name: "current_cycle_hours",
    type: "text",
    id: "current_cycle_hours",
    label: "Current Cycle hours",
    validationRules: {
      required: "Current Cycle hour is required",
      pattern: {
        value: /^[0-9]+$/,
        message: "Only numbers are allowed",
      },
      min: { value: 0, message: "Minimum value is 0" },
      max: { value: 70, message: "Maximum value is 70" },
    },
    description: "Hours used in your current 70-hour/8-day cycle (0-70)"
  },
];
