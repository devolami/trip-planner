"use client";
import React from "react";

import { Button } from "./Button";
import { useGenerateLogAndMap } from "./use-generate-log";
import { InputField } from "./Input";
import { formConfig } from "./config";

export function TripForm() {
  const {
    hookFormRegister,
    errors,
    generateLogAndMap,
    handleSubmit,
    setValue,
    isSubmitting,
    hasTyped
  } = useGenerateLogAndMap();

  return (
    <div className="flex flex-col justify-center items-center bg-[#F4EBFF] py-[50px] w-full">
      <div className="flex flex-col justify-center items-center my-6 px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-[#1D2939]">
          Plan Your Perfect Route
        </h1>
        <p className="my-3 md:my-4">
          Optimize your journey with smart rest stops and HOS-compliant
          schedules
        </p>
      </div>
      <div className="flex flex-col justify-center items-center w-[90%] md:w-[80%] box-border">
        <form
          className="w-full bg-white p-[30px] flex flex-col items-center justify-center"
          onSubmit={handleSubmit(generateLogAndMap)}
          noValidate
        >
          <div className="text-center py-6 px-0 md:px-6 md:mb-8">
            {/* <h3 className="font-bold text-[#9E77ED] text-2xl">
              Plan Your Trip
            </h3> */}
            <p className="text-gray-600 text-xl mb-3">
              Enter your route details to generate an optimized plan
            </p>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 items-start">
            <InputField
              register={hookFormRegister}
              errors={errors}
              config={formConfig}
              setValue={setValue}
            />
          </div>
          <div className="mt-10">
            <Button disabled={ isSubmitting || !hasTyped}>
              {isSubmitting ? "Generating..." : "Generate route and logs"}
            </Button>
          </div>
          <p className="my-5 text-xs text-gray-600 text-center">
            Your trip data is processed on your device and never stored on any
            servers.
          </p>
        </form>
      </div>
    </div>
  );
}
