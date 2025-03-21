"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { InputData } from "./types";
import { useRoute } from "../contexts";

export function useGenerateLogAndMap() {
  const form = useForm<InputData>();
  const {
    register: hookFormRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    reset,
  } = form;

  const {
    tripInfoRef,
    pickupTimeRef,
    setLogData,
    setTab,
    calculateFuelingMarkers,
    setErrorData,
  } = useRoute();

  const generateLogAndMap: SubmitHandler<InputData> = async (data) => {
    const API_URL = "http://localhost:8000/api/logs/generate_logbook/";

    try {
      await calculateFuelingMarkers();
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Read latest values after the delay
      const latestTripInfo = tripInfoRef.current;
      const latestPickUpTime = pickupTimeRef.current;

      const requestData = {
        current_cycle_hour: data.current_cycle_hours,
        total_driving_time: latestTripInfo.totalTimeMinutes,
        pickup_time: latestPickUpTime,
        total_distance_miles: latestTripInfo.totalDistanceMiles,
      };
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: { "Content-Type": "application/json" },
      });

      const responseData = await response.json();

      if (!response.ok) {
        setErrorData(responseData);
        console.log(responseData)
        setTab("error");
      }

      setLogData(responseData);

      setTab("MapAndLog");
    } catch (error) {
      console.error("Error submitting form:", error);
      reset();
    }
  };

  return {
    hookFormRegister,
    handleSubmit,
    generateLogAndMap,
    errors,
    getValues,
    setValue,
    isLoading: isSubmitting,
  };
}
