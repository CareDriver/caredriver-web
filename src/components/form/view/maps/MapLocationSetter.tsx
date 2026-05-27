"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import {
  DEFAULT_LOCATION,
  GOOGLEMAPS_TOKEN,
} from "@/components/form/models/MapProperties";
import { GeoPoint } from "firebase/firestore";
import { geoPointToLatLng } from "../../utils/MapLocationHelper";
import { MAIN_COLOR, SECOND_COLOR_LIGHT } from "@/models/Colors";
import { createGoogleMapsUrl } from "@/utils/helpers/MapHelper";
import GoogleMapsRedirector from "./GoogleMapsRedirector";
import "@/styles/modules/map.css";

interface Props {
  location: GeoPoint | undefined;
  setLocation: (g: GeoPoint) => void;
}

function getUserPosition(): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 5000 },
    );
  });
}

const MapLocationSetter: React.FC<Props> = ({ location, setLocation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string | null>(null);
  const setLocationRef = useRef(setLocation);

  useEffect(() => {
    setLocationRef.current = setLocation;
  }, [setLocation]);

  // Initializes the map only once to avoid re-creating it (and flickering)
  // when location changes. The click handler updates the marker and pans
  // the map in-place.
  useEffect(() => {
    let lastMarker: google.maps.marker.AdvancedMarkerElement | null = null;

    const initMap = async () => {
      const loader = new Loader({
        apiKey: GOOGLEMAPS_TOKEN,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");

      // Use the saved location, or the user's real GPS position, or Cochabamba.
      const userPos = !location ? await getUserPosition() : null;
      const center: { lat: number; lng: number } = location
        ? { lat: location.latitude, lng: location.longitude }
        : (userPos ?? {
            lat: DEFAULT_LOCATION.latitude,
            lng: DEFAULT_LOCATION.longitude,
          });

      const mapOptions: google.maps.MapOptions = {
        center,
        zoom: 17,
        mapId: "GOOGLEMAP_FORM_ID",
      };

      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
      const { AdvancedMarkerElement, PinElement } =
        (await google.maps.importLibrary(
          "marker",
        )) as google.maps.MarkerLibrary;

      const pin = new PinElement({
        scale: 2,
        background: MAIN_COLOR,
        glyphColor: SECOND_COLOR_LIGHT,
        borderColor: SECOND_COLOR_LIGHT,
      });

      // Show a blue "you are here" dot when there is no saved location.
      if (!location && userPos) {
        const dot = document.createElement("div");
        dot.style.cssText =
          "width:14px;height:14px;background:#4285F4;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.4)";
        new AdvancedMarkerElement({
          map,
          position: userPos,
          content: dot,
        });
      }

      if (location) {
        lastMarker = new AdvancedMarkerElement({
          map,
          position: geoPointToLatLng(location),
          content: pin.element,
        });
        let mapUrl: string = createGoogleMapsUrl({
          lat: location.latitude,
          lng: location.longitude,
        });
        setGoogleMapsUrl(mapUrl);
      }

      map.addListener("click", (mapsMouseEvent: any) => {
        var newPosition = {
          lat: mapsMouseEvent.latLng.toJSON().lat,
          lng: mapsMouseEvent.latLng.toJSON().lng,
        };

        if (lastMarker !== null) {
          lastMarker.position = newPosition;
        } else {
          lastMarker = new AdvancedMarkerElement({
            map,
            position: newPosition,
            content: pin.element,
          });
        }

        map.panTo(newPosition);
        let mapUrl: string = createGoogleMapsUrl(newPosition);
        setGoogleMapsUrl(mapUrl);
        setLocationRef.current(new GeoPoint(newPosition.lat, newPosition.lng));
      });
    };

    initMap();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="map-main-wrapper">
      <p className="text | light" style={{ marginBottom: 8, fontSize: 14 }}>
        Toca el mapa para marcar tu ubicación exacta
      </p>
      <div className="map-content-wrapper" ref={mapRef}></div>
      <GoogleMapsRedirector googleMapsUrl={googleMapsUrl} />
    </div>
  );
};

export default MapLocationSetter;
