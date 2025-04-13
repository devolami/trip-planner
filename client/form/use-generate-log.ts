"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { InputData } from "./types";
import { useRoute } from "../contexts";
import { useRouter } from "next/navigation";

const API_URL: string = process.env.NEXT_PUBLIC_BASE_ENDPOINT as string;

export function useGenerateLogAndMap() {
  const form = useForm<InputData>({
    mode: "onChange",
    defaultValues: {current_cycle_hours: 0, current_location: "", drop_off_location: "", pickup_location: ""}
  });
  const {
    register: hookFormRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    reset,
    watch,
  } = form;

  const {
    tripInfoRef,
    pickupTimeRef,
    setLogData,
    setTab,
    calculateFuelingMarkers,
    setErrorData,
 
  } = useRoute();
  const router = useRouter();
  const watchFields = watch();
  
  const hasTyped = Object.values(watchFields).every((value) =>
    typeof value === "number" ? value >= 0 : value.length > 0
  );

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
        
        router.push("/error-response");
      }
      if (response.ok) {
        setLogData(responseData);      
        setTab("MapAndLog");
      
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
    isSubmitting,
    hasTyped,
  };
}
