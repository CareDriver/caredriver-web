"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { GOOGLEMAPS_TOKEN } from "@/components/form/models/MapProperties";
import { GeoPoint } from "firebase/firestore";
import { geoPointToLatLng } from "@/components/form/utils/MapLocationHelper";
import { MAIN_COLOR, SECOND_COLOR_LIGHT, WHITE_COLOR } from "@/models/Colors";
import { createGoogleMapsUrl } from "@/utils/helpers/MapHelper";
import GoogleMapsRedirector from "../maps/GoogleMapsRedirector";
import "@/styles/modules/map.css";

const MapMarkRenderer = ({ location }: { location: GeoPoint }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string | null>(null);

  useEffect(() => {
    if (mapRef && mapRef.current) {
      const initMap = async () => {
        const loader = new Loader({
          apiKey: GOOGLEMAPS_TOKEN,
          version: "weekly",
        });

        const { Map } = await loader.importLibrary("maps");

        const position = geoPointToLatLng(location);

        const mapOptions: google.maps.MapOptions = {
          center: position,
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
        new AdvancedMarkerElement({
          map,
          position: geoPointToLatLng(location),
          content: pin.element,
        });

        let mapUrl: string = createGoogleMapsUrl(position);
        setGoogleMapsUrl(mapUrl);
      };

      initMap();
    }
  }, [location]);

  return (
    <div className="map-main-wrapper">
      <div className="map-content-wrapper" ref={mapRef}></div>
      <GoogleMapsRedirector googleMapsUrl={googleMapsUrl} />
    </div>
  );
};

export default MapMarkRenderer;
