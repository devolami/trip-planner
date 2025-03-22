"use client";
import React, { useState, useEffect, useRef, RefObject } from "react";
import Map, {
  Marker,
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  Source,
  Layer,
  MapRef,
} from "react-map-gl/mapbox";

import { useRoute } from "../contexts";
import { LngLatBounds } from "mapbox-gl"; // Import LngLatBounds

const ACCESS_TOKEN: string = process.env.NEXT_PUBLIC_ACCESS_TOKEN as string;

function TripMap() {
  const {
    routeCoordinates,
    coords,
    getRoutes,
    fuelingMarkersRef,
  } = useRoute();

  const [viewState, setViewState] = useState({
    longitude: routeCoordinates[0].longitude,
    latitude: routeCoordinates[0].latitude,
    zoom: 7,
  });

  const mapRef: RefObject<MapRef | null> = useRef(null);
  const fuelingMarkers = fuelingMarkersRef.current
  console.log("These are the refuelling markers", fuelingMarkers)

  const geojson: {
    type: "FeatureCollection";
    features: {
      type: "Feature";
      geometry: {
        type: "LineString";
        coordinates: number[][];
      };
      properties: object;
    }[];
  } = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [...coords],
        },
        properties: {},
      },
    ],
  } as const;

  const LINE_JOIN_ROUND = "round" as const;
  const LINE_CAP_ROUND = "round" as const;
  const LINE_TYPE = "line" as const;

  const lineStyle = {
    id: "routeSource",
    type: LINE_TYPE,
    layout: {
      "line-join": LINE_JOIN_ROUND,
      "line-cap": LINE_CAP_ROUND,
    },
    paint: {
      "line-color": "blue",
      "line-width": 4,
      "line-opacity": 0.75,
    },
  };


  useEffect(() => {
    const fetchRoutes = async () =>{
      await getRoutes()
    }
    if (routeCoordinates.length > 0 && mapRef.current) {
      const bounds = new LngLatBounds();
      routeCoordinates.forEach((coord) => {
        bounds.extend([coord.longitude, coord.latitude]);
      });
      mapRef.current.getMap().fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 }, // Add padding around the bounds
        duration: 1000, // Disable animation
      });
    }
    fetchRoutes()
  }, [routeCoordinates, getRoutes]);

  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={ACCESS_TOKEN}
      style={{ height: "100vh", width: "100vw" }}
      ref={mapRef}
    >
      <Source id="routeSource" type="geojson" data={geojson}>
        <Layer {...lineStyle} />
      </Source>
      {routeCoordinates.map((route, index) => (
        <Marker
          key={index}
          longitude={route.longitude}
          latitude={route.latitude}
          color={index === 0 ? "green" : index === 1 ? "yellow" : "purple"}
        />
      ))}

      {fuelingMarkers.map((marker, index) => {
        console.log(`This is a marker: ${marker}: ${index}`);
        return (
          <Marker
            key={`fueling-${index}`}
            longitude={marker.longitude}
            latitude={marker.latitude}
            color="red"
          />
        );
      })}

      <GeolocateControl />
      <FullscreenControl />
      <NavigationControl />
    </Map>
  );
}
export default TripMap;
