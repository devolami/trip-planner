// import TripMap from "./components/Map";
import { TripForm } from "@/client/form/Form";
import { RouteProvider } from "@/client/form/RouteContext";
import LogBook from "@/client/log/LogBook";

export default function Home() {
  return (
    <RouteProvider>
      <div className="flex flex-col items-center justify-center">
        <TripForm />
        <LogBook/>
       {/* <div className="relative">
       <TripMap />
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
          <div className="rounded-full w-4 h-4 bg-purple-500"></div>
          <p className="text-gray-500 text-xs  font-bold">Drop-off</p>
        </div>
        <div className="flex flex-row justify-center items-center gap-x-2">
          <div className="rounded-full w-4 h-4 bg-red-500"></div>
          <p className="text-gray-500 text-xs  font-bold">Fuel stop</p>
        </div>
     
       </div>
       </div> */}
      </div>
    </RouteProvider>
  );
}
