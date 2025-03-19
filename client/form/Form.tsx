"use client";
import React from "react";

import { Button } from "./Button";
import { useSubmit } from "./use-submit";
import { InputField } from "./Input";
import { formConfig } from "./config";


export function TripForm() {
  const {
    hookFormRegister,
    errors,
    submitForm,
    handleSubmit,
    setValue,
    isLoading,
  } = useSubmit();
 

  return (
    <div className="flex flex-col justify-center items-center bg-[#F4EBFF] py-[50px] w-full">
      <div className="flex flex-col justify-center items-center w-[90%] md:w-[80%] box-border">
        <form
          className="w-full bg-white p-[30px] flex flex-col items-center justify-center"
          onSubmit={handleSubmit(submitForm)}
          noValidate
        >
          <div className="text-center f m-10">
            <h3 className="font-bold text-[#9E77ED] text-2xl">
              Plan Your Trip
            </h3>
            <p className="text-gray-600 text-[12px]">
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
            <Button disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate route and logs"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
