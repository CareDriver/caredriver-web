"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import {
    DEFAULT_LOCATION,
    GOOGLEMAPS_TOKEN,
} from "@/components/form/models/MapProperties";
import { GeoPoint } from "firebase/firestore";
import { geoPointToLatLng } from "../../utils/MapLocationHelper";
import { MAIN_COLOR, SECOND_COLOR_LIGHT, WHITE_COLOR } from "@/models/Colors";
import { createGoogleMapsUrl } from "@/utils/helpers/MapHelper";
import LocationDot from "@/icons/LocationDot";
import GoogleMapsRedirector from "./GoogleMapsRedirector";

interface Props {
    location: GeoPoint | undefined;
    setLocation: (g: GeoPoint) => void;
}

const MapLocationSetter: React.FC<Props> = ({ location, setLocation }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    var lastMarker: google.maps.marker.AdvancedMarkerElement | null = null;
    const [googleMapsUrl, setGoogleMapsUrl] = useState<string | null>(null);

    useEffect(() => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: GOOGLEMAPS_TOKEN,
                version: "weekly",
            });

            const { Map } = await loader.importLibrary("maps");

            const position = location ? location : DEFAULT_LOCATION;

            const mapOptions: google.maps.MapOptions = {
                center: geoPointToLatLng(position),
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

                let mapUrl: string = createGoogleMapsUrl(newPosition);
                setGoogleMapsUrl(mapUrl);
                setLocation(new GeoPoint(newPosition.lat, newPosition.lng));
            });
        };

        initMap();
    }, []);

    return (
        <div className="map-main-wrapper">
            <div className="map-content-wrapper" ref={mapRef}></div>
            <GoogleMapsRedirector googleMapsUrl={googleMapsUrl} />
        </div>
    );
};

export default MapLocationSetter;
