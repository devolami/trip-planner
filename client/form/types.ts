import {
    UseFormRegister,
    FieldErrors,
    UseFormSetValue,
    RegisterOptions
  } from "react-hook-form";

export type InputData = {
    current_location: string;
    pickup_location: string;
    drop_off_location: string;
    current_cycle_hours: number;
}

export type InputConfigProps = {
    name: keyof InputData;
    type: string;
    placeholder?: string;
    id: string;
    validationRules?: RegisterOptions<InputData>;
    description?: string;
    label: string;
  };
  export type Coordinates = {
    latitude: number;
    longitude: number;
    // placeName: string;
    // city: string | undefined
    // region: string | undefined
    // address: string | undefined
  };
  export type InputFieldProps = {
    config: InputConfigProps[];
    register: UseFormRegister<InputData>;
    errors: FieldErrors<InputData>;
    setValue: UseFormSetValue<InputData>
  };

