"use client";
import React, { useState} from "react";
import { InputFieldProps, InputData, Coordinates } from "./types";
import mapboxSdk from "@mapbox/mapbox-sdk";
import geocoding from "@mapbox/mapbox-sdk/services/geocoding";
import { GeocodeFeature } from "@mapbox/mapbox-sdk/services/geocoding";
import { useRoute } from "./RouteContext";


const ACCESS_TOKEN: string = process.env.NEXT_PUBLIC_ACCESS_TOKEN!;

const mapboxClient = mapboxSdk({ accessToken: ACCESS_TOKEN });
const geocodingClient = geocoding(mapboxClient);

export const InputField: React.FC<InputFieldProps> = ({
  config,
  register,
  errors,
  setValue,
}) => {
  const { setRouteCoordinates } = useRoute();
  const [suggestions, setSuggestions] = useState<GeocodeFeature[]>([]);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleInputChange =
    (name: keyof InputData) =>
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setValue(name, value, {shouldValidate: true})
      if (value.length > 2) {
        try {
          const response = await geocodingClient
            .forwardGeocode({
              query: value,
              limit: 5,
            })
            .send();

          setSuggestions(response.body.features);
          setFocusedField(name);
        } catch (error) {
          console.error("Geocoding error:", error);
        }
      } else {
        setSuggestions([]);
        setFocusedField(null);
      }
    };


  return (
    <>
      {config.map((fieldConfig, index) => (
        <div key={fieldConfig.name} className="w-full">
          <label
            className="font-bold text-[#344054]"
            htmlFor={fieldConfig.name}
          >
            {fieldConfig.label}
          </label>
          <input
            {...register(fieldConfig.name, fieldConfig.validationRules)}
            type={fieldConfig.type}
            placeholder={fieldConfig.placeholder}
            id={fieldConfig.id}
            className="my-[10px] p-[20px] rounded-sm border-[1.5px] border-[#F4EBFF] w-full font-normal text-[16px] bg-white text-[#364259] focus:outline-none focus:border-[#F4EBFF]"
            onChange={handleInputChange(fieldConfig.name)}
          />

          {suggestions.length > 0 &&
            focusedField === fieldConfig.name &&
            fieldConfig.name !== "current_cycle_hours" && (
              <div className="w-full h-32 p-5 overflow-x-hidden overflow-y-auto border-solid border-[#F4EBFF] z-10">
                <ul>
                  {suggestions.map((suggestion) => (
                    <li
                      onClick={() => {
                        setValue(fieldConfig.name, suggestion.place_name, {
                          shouldValidate: true,
                        });

                        const field_coordinates: Coordinates = {
                          longitude: suggestion.center[0],
                          latitude: suggestion.center[1],
                        };
                        if (index !== config.length - 1) {
                          setRouteCoordinates((prevCoordinates) => {
                            const newCoordinates = [...prevCoordinates];
                            newCoordinates[index] = field_coordinates;

                            return newCoordinates;
                          });
                        }
                        setSuggestions([]);
                        
                      }}
                      key={suggestion.id}
                      className="cursor-pointer m-4"
                    >
                      {suggestion.place_name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          <p className="text-[#FF8A00] text-[12px]">
            {errors[fieldConfig.name]?.message}
          </p>
          <p className="text-gray-600 text-[12px]">
            {fieldConfig?.description}
          </p>
        </div>
      ))}
    </>
  );
};
