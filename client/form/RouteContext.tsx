"use client";
import React, { createContext, useState, useContext, useCallback } from "react";
import mapboxSdk from "@mapbox/mapbox-sdk";
import Directions from "@mapbox/mapbox-sdk/services/directions";
import { Coordinates } from "./types";
import polyline from "@mapbox/polyline";

interface RouteContextType {
  routeCoordinates: Coordinates[];
  setRouteCoordinates: React.Dispatch<React.SetStateAction<Coordinates[]>>;
  fetchError: string;
  setFetchError: React.Dispatch<React.SetStateAction<string>>;
  getRoutes: () => Promise<void>;
  calculateFuelingMarkers: () => Promise<void>;
  coords: number[][];
  fuelingMarkers: Coordinates[];
  tripInfo: TripInfoProps;
  pickUpTime: number;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

const ACCESS_TOKEN: string = process.env.NEXT_PUBLIC_ACCESS_TOKEN as string;
const mapboxClient = mapboxSdk({ accessToken: ACCESS_TOKEN });
const directionServices = Directions(mapboxClient);

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
  const [fetchError, setFetchError] = useState<string>("");
  const [coords, setCoords] = useState<number[][]>([]);
  const [fuelingMarkers, setFuelingMarkers] = useState<Coordinates[]>([]);

  const getRoutes = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${routeCoordinates[0].longitude},${routeCoordinates[0].latitude};${routeCoordinates[1].longitude},${routeCoordinates[1].latitude};${routeCoordinates[2].longitude},${routeCoordinates[2].latitude}?steps=true&geometries=geojson&access_token=${ACCESS_TOKEN}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        setFetchError(errorData.message);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates;
        console.log("Coordinates", coords);
        console.log("Other data", data.routes[0].geometry);
        setCoords(coords);
      } else {
        console.log("No routes found in the response");
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  }, [routeCoordinates, setFetchError]);

  const calculateFuelingMarkers = useCallback(async () => {
    if (routeCoordinates.length < 3) {
      console.error(
        "Insufficient coordinates for calculating fueling markers."
      );
      return;
    }

    try {
      const [firstCoordinate, secondCoordinate, lastCoordinate] =
        routeCoordinates;

      const totalDistanceWaypoints = [
        {
          coordinates: [
            firstCoordinate.longitude,
            firstCoordinate.latitude,
          ] as [number, number],
        },
        {
          coordinates: [lastCoordinate.longitude, lastCoordinate.latitude] as [
            number,
            number
          ],
        },
      ];

      const pickupDistanceWaypoints = [
        {
          coordinates: [
            firstCoordinate.longitude,
            firstCoordinate.latitude,
          ] as [number, number],
        },
        {
          coordinates: [
            secondCoordinate.longitude,
            secondCoordinate.latitude,
          ] as [number, number],
        },
      ];

      const [totalDistanceResponse, pickupDistanceResponse] = await Promise.all(
        [
          directionServices
            .getDirections({
              waypoints: totalDistanceWaypoints,
              profile: "driving",
            })
            .send(),
          directionServices
            .getDirections({
              waypoints: pickupDistanceWaypoints,
              profile: "driving",
            })
            .send(),
        ]
      );

      if (pickupDistanceResponse.body.routes?.length > 0) {
        console.log("Pickup distance fetched successfully.");
        const pickupRoute = pickupDistanceResponse.body.routes[0];
        setPickUpTime(pickupRoute.duration / 60);
      } else {
        console.warn("No pickup routes found.");
      }

      if (!totalDistanceResponse.body.routes?.length) {
        console.error("No total distance routes found.");
        return;
      }
      console.log("Total distance fetched successfully.");
      const route = totalDistanceResponse.body.routes[0];
      const totalDistanceMiles = route.distance * 0.000621371; // Convert meters to miles
      const durationMinutes = route.duration / 60;
      setTripInfo({ totalDistanceMiles, totalTimeMinutes: durationMinutes });

      const numFuelingStops = Math.floor(totalDistanceMiles / 1000);
      console.log(`Estimated fueling stops: ${numFuelingStops}`);

      if (numFuelingStops > 0 && route.geometry) {
        const fuelingMarkersCoords: Coordinates[] = [];
        const decodedCoordinates = polyline.decode(route.geometry); // Decode polyline once

        let currentDistance = 0;
        let nextTargetDistance = 1000; // Start at first fueling stop

        for (let j = 0; j < decodedCoordinates.length - 1; j++) {
          const segmentStart = decodedCoordinates[j];
          const segmentEnd = decodedCoordinates[j + 1];
          const segmentDistanceMiles =
            getDistance(segmentStart, segmentEnd) * 0.000621371; // Convert meters to miles

          currentDistance += segmentDistanceMiles;

          if (currentDistance >= nextTargetDistance) {
            const remainingDistance =
              nextTargetDistance - (currentDistance - segmentDistanceMiles);
            const fraction = remainingDistance / segmentDistanceMiles;

            const markerLat =
              segmentStart[0] + (segmentEnd[0] - segmentStart[0]) * fraction;
            const markerLng =
              segmentStart[1] + (segmentEnd[1] - segmentStart[1]) * fraction;

            fuelingMarkersCoords.push({
              longitude: markerLng,
              latitude: markerLat,
            });

            console.log(
              `Fuel stop ${fuelingMarkersCoords.length} added at ${markerLat}, ${markerLng}`
            );

            if (fuelingMarkersCoords.length >= numFuelingStops) break;
            nextTargetDistance += 1000; // Move to the next fueling stop distance
          }
        }

        setFuelingMarkers(fuelingMarkersCoords);
      }
    } catch (error) {
      console.error("Error calculating fueling markers:", error);
    }
  }, [routeCoordinates]);

  const getDistance = (coord1: number[], coord2: number[]): number => {
    const toRadians = (deg: number) => (deg * Math.PI) / 180;
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;

    const R = 6371e3; // Radius of Earth in meters
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))); // Distance in meters
  };

  return (
    <RouteContext.Provider
      value={{
        routeCoordinates,
        setRouteCoordinates,
        fetchError,
        setFetchError,
        getRoutes,
        coords,
        fuelingMarkers,
        calculateFuelingMarkers,
        tripInfo,
        pickUpTime,
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
