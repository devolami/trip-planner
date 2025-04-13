"use client";
import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { Coordinates } from "../form";

import { along, lineString} from "@turf/turf";
import { Logbook } from "../form";

interface RouteContextType {
  routeCoordinates: Coordinates[];
  setRouteCoordinates: React.Dispatch<React.SetStateAction<Coordinates[]>>;
  errorData: string;
  setErrorData: React.Dispatch<React.SetStateAction<string>>;
  getRoutes: () => Promise<void>;
  calculateFuelingMarkers: () => Promise<void>;
  coords: number[][];
  fuelingMarkers: Coordinates[];
  tripInfoRef: React.RefObject<TripInfoProps>;
  pickupTimeRef: React.RefObject<number>;
  errorDataRef: React.RefObject<string>;
  fuelingMarkersRef: React.RefObject<Coordinates[]>;
  tab: string;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  logData: Logbook[] | null;
  setLogData: React.Dispatch<React.SetStateAction<Logbook[] | null>>;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

const ACCESS_TOKEN: string = process.env.NEXT_PUBLIC_ACCESS_TOKEN as string;

interface TripInfoProps {
  totalTimeMinutes: number;
  totalDistanceMiles: number;
}

export const RouteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinates[]>([
    { latitude: 40.7128, longitude: -74.006 },
    { latitude: 40.7178, longitude: -74.0431 },
    { latitude: 40.7357, longitude: -74.1724 },
  ]);
  const [tripInfo, setTripInfo] = useState<TripInfoProps>({
    totalTimeMinutes: 0,
    totalDistanceMiles: 0,
  });
  const [pickUpTime, setPickUpTime] = useState<number>(0);
  const [errorData, setErrorData] = useState<string>("");
  const [tab, setTab] = useState<string>("form");
  const [coords, setCoords] = useState<number[][]>([]);
  const [fuelingMarkers, setFuelingMarkers] = useState<Coordinates[]>([]);
  const [logData, setLogData] = useState<Logbook[] | null>(null);

  const tripInfoRef = useRef(tripInfo);
  const pickupTimeRef = useRef(pickUpTime);
  const errorDataRef = useRef(errorData);
  const fuelingMarkersRef = useRef(fuelingMarkers);

  useEffect(() => {
    tripInfoRef.current = tripInfo;
    pickupTimeRef.current = pickUpTime;
    errorDataRef.current = errorData;
    fuelingMarkersRef.current = fuelingMarkers;
  }, [tripInfo, pickUpTime, errorData, fuelingMarkers]);

  const getRoutes = useCallback(async () => {
    try {
      const URL = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${routeCoordinates[0].longitude},${routeCoordinates[0].latitude};${routeCoordinates[1].longitude},${routeCoordinates[1].latitude};${routeCoordinates[2].longitude},${routeCoordinates[2].latitude}?steps=true&geometries=geojson&access_token=${ACCESS_TOKEN}`;
      const response = await fetch(URL);

      if (!response.ok) {
        const errorData = await response.json();
        setErrorData(errorData.message);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates;

        setCoords(coords);
      } else {
        console.log("No routes found in the response");
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  }, [routeCoordinates, setErrorData]);

  const calculateFuelingMarkers = async (
  ) => {
    try {
      const [start, pickup, end] = routeCoordinates;
  
      if (!start || !pickup || !end) {
        console.error("Route must have 3 points");
        return;
      }

      const fullRouteURL = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.longitude},${start.latitude};${pickup.longitude},${pickup.latitude};${end.longitude},${end.latitude}?geometries=geojson&access_token=${ACCESS_TOKEN}`;

      const pickupRouteURL = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.longitude},${start.latitude};${pickup.longitude},${pickup.latitude}?geometries=geojson&access_token=${ACCESS_TOKEN}`;
  
      const [fullRes, pickupRes] = await Promise.all([
        fetch(fullRouteURL),
        fetch(pickupRouteURL),
      ]);
  
      const fullData = await fullRes.json();
      const pickupData = await pickupRes.json();
  
      const fullRoute = fullData.routes?.[0];
      const pickupRoute = pickupData.routes?.[0];
  
      if (!fullRoute || !fullRoute.geometry?.coordinates?.length) {
        console.error("No valid full route found.");
        return;
      }
  
      if (pickupRoute?.duration) {
        setPickUpTime(pickupRoute.duration / 60); // seconds → minutes
      }
  
      const coordinates: [number, number][] = fullRoute.geometry.coordinates;
      const line = lineString(coordinates);
  
      const totalDistanceMiles = fullRoute.distance * 0.000621371; // meters → miles
      const totalTimeMinutes = fullRoute.duration / 60; // seconds → minutes
  
      setTripInfo({ totalDistanceMiles, totalTimeMinutes });
  
      const fuelingMarkers: Coordinates[] = [];
  
      const markerInterval = 980;
      const numMarkers = Math.floor(totalDistanceMiles / 1000);
  
  
      for (let i = 1; i <= numMarkers; i++) {
        const targetMiles = i * markerInterval;
       
  
        const point = along(line, targetMiles, { units: "miles" });
        const [lng, lat] = point.geometry.coordinates;
        fuelingMarkers.push({ latitude: lat, longitude: lng });
      }
  
      setFuelingMarkers(fuelingMarkers);
      console.log("Fueling markers:", fuelingMarkers);
    } catch (error) {
      console.error("Error calculating fueling markers:", error);
      setErrorData("Failed to calculate fueling markers.");
    }
  };

  return (
    <RouteContext.Provider
      value={{
        routeCoordinates,
        setRouteCoordinates,
        errorData,
        setErrorData,
        getRoutes,
        coords,
        fuelingMarkers,
        calculateFuelingMarkers,
        tripInfoRef,
        pickupTimeRef,
        errorDataRef,
        fuelingMarkersRef,
        setTab,
        tab,
        logData,
        setLogData,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};

export const useRoute = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error("useRoute must be used within a RouteProvider");
  }
  return context;
};
