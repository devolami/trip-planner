"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { InputData } from "./types";
import { useRoute } from "./RouteContext";
import { useState } from "react";
// import { useState } from "react";

export function useSubmit() {
  const form = useForm<InputData>();
  const {
    register: hookFormRegister,
    handleSubmit,
    formState,
    getValues,
    setValue,
    reset,
  } = form;
  const { errors, isLoading } = formState;
  const {getRoutes, tripInfo} = useRoute()
  // const [durationMinutes, setDurationMinutes] = useState<number>(0)
  // const [distanceMiles, setDistanceMiles] = useState<number>(0)
  const [drawLog, setDrawLog] = useState<boolean>(false)
  

  const submitForm: SubmitHandler<InputData> = async (data) => {
    try {
      const drivingTime = tripInfo.totalTimeMinutes
      const pickUpAndDropOffTime: number = 60 // in minutes
      const currentCycleHours = data.current_cycle_hours
      const remainingCycleHours: number = (70 - currentCycleHours) * 60 // convert to minutes
      const numFuelingStops: number = Math.floor(tripInfo.totalDistanceMiles / 1000);
      const totalTimeToRefuel: number = numFuelingStops * 30 // Assuming 30 mins for each refuelling.
      const totalOnDutyTime: number = drivingTime + totalTimeToRefuel + pickUpAndDropOffTime
      const timeBeforeRefuel = (drivingTime / tripInfo.totalDistanceMiles) * 1000;

      // const distanceFromLocatinoToPickup = 
      // const DurationFromCurrentToPickup 
      // if (remainingCycleHours <= totalOnDutyTime){
      //   setDrawLog(false)
      // }
      // else {

      // }
      console.log(data)
      console.log()
      getRoutes()
    } catch (error) {
      console.error("Error signing in to your account", error);

      reset();
    }
  };
  return {
    hookFormRegister,
    handleSubmit,
    submitForm,
    errors,
    getValues,
    setValue,
    isLoading,
  };
}
