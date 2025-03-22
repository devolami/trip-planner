"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { InputData } from "./types";
import { useRoute } from "../contexts";
import { useRouter } from "next/navigation";

const API_URL: string = process.env.NEXT_PUBLIC_BASE_ENDPOINT as string;

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
    tab,
  } = useRoute();
  const router = useRouter()

  const generateLogAndMap: SubmitHandler<InputData> = async (data) => {
    

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
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log("This is from the error bock", responseData)
        router.push("/error-response")
      }
      if (response.ok) {
        setLogData(responseData);
        console.log("Hey! Here is our logbook", responseData)
        setTab("MapAndLog");
        console.log("From the success block, set tab to", tab, responseData);
      }
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
