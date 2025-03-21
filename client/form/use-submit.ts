"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { InputData } from "./types";
import { useRoute } from "./RouteContext";
import { useState } from "react";

type LogEntry = {
  hour: number;
  row: "off-duty" | "sleeper" | "driving" | "on-duty";
  action?: string;
};

type Logbook = {
  logbook: LogEntry[];
  currentHour: number;
  totalTimeTraveled: number;
  timeSpentInOffDuty: number;
  timeSpentInOnDuty: number;
  timeSpentInDriving: number;
  timeSpentInSleeperBerth: number;
};

export function useSubmit() {
  
  const form = useForm<InputData>();
  const {
    register: hookFormRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    reset,
  } = form;

  
  const { tripInfo, pickUpTime } = useRoute();
  const [logData, setLogData] = useState<Logbook[]>([]); 

  
  const submitForm: SubmitHandler<InputData> = async (data) => {
    const API_URL = "http://localhost:8000/api/logs/generate_logbook";

    try {
      const requestData = {
        current_cycle_hour: data.current_cycle_hours,
        total_driving_time: tripInfo.totalTimeMinutes,
        pickup_time: pickUpTime,
        total_distance_miles: tripInfo.totalDistanceMiles
      };

      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Error fetching ELD: ${response.status}`);
      }

      
      const results: Logbook[] = await response.json();
      setLogData(results); 

    } catch (error) {
      console.error("Error submitting form:", error);
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
    isLoading: isSubmitting, 
    logData, 
  };
}
