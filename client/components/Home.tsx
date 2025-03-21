import React from "react";
import { TripMap } from "../map";
import { LogBook } from "../log";

import { TripForm } from "../form";
import { useRoute } from "../contexts";

export function Home() {
  const { tab} = useRoute();
  
  return (
    <div>
      {tab === "MapAndLog" && <MapLog />}
      {tab === "form" && <TripForm />}
      {tab === "error" && <FetchError />}
    </div>
  );
}

export function MapLog() {
  const { tab} = useRoute();
  return (
    <React.Fragment>
      <LogBook />
      <div className="relative flex flex-col justify-center items-center">
        {tab === "MapAndLog" && <TripMap />}
        <div className="absolute top-0 right-12 bg-white p-4 pr-8 flex flex-col justify-center items-start gap-y-4">
          <div className="flex flex-row justify-center items-center gap-x-2">
            <div className="rounded-full w-4 h-4 bg-green-600"></div>
            <p className="text-gray-500 text-xs  font-bold">Current</p>
          </div>
          <div className="flex flex-row justify-center items-center gap-x-2">
            <div className="rounded-full w-4 h-4 bg-yellow-300"></div>
            <p className="text-gray-500 text-xs  font-bold">Pickup</p>
          </div>
          <div className="flex flex-row justify-center items-center gap-x-2">
            <div className="rounded-full w-4 h-4 bg-[#800080]"></div>
            <p className="text-gray-500 text-xs  font-bold">Drop-off</p>
          </div>
          <div className="flex flex-row justify-center items-center gap-x-2">
            <div className="rounded-full w-4 h-4 bg-red-500"></div>
            <p className="text-gray-500 text-xs  font-bold">Fuel stop</p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export function FetchError(){
  const {errorData} = useRoute()
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
      <p className="text-4xl m-auto p-4 text-gray-600">{errorData}</p>
    </div>
  )
}