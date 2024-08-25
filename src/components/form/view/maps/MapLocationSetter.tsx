"use client";
import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import {
    DEFAULT_LOCATION,
    GOOGLEMAPS_TOKEN,
} from "@/components/form/models/MapProperties";
import { GeoPoint } from "firebase/firestore";
import { geoPointToLatLng } from "../../utils/MapLocationHelper";

interface Props {
    location: GeoPoint | undefined;
    setLocation: (g: GeoPoint) => void;
}

const MapLocationSetter: React.FC<Props> = ({ location, setLocation }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    var lastMarker: google.maps.marker.AdvancedMarkerElement | null = null;

    useEffect(() => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: GOOGLEMAPS_TOKEN,
                version: "weekly",
            });

            const { Map } = await loader.importLibrary("maps");

            const position: GeoPoint = location ? location : DEFAULT_LOCATION;
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

            /* TODO: move colors to TS file */
            const pin = new PinElement({
                scale: 1.6,
                background: "#3bb770",
                glyphColor: "#fff",
                borderColor: "#3bb770",
            });

            if (location) {
                lastMarker = new AdvancedMarkerElement({
                    map,
                    position: geoPointToLatLng(location),
                    content: pin.element,
                });
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

                setLocation(new GeoPoint(newPosition.lat, newPosition.lng));
            });
        };

        initMap();
    }, []);

    return (
        <div
            /* TODO: move styles to css */
            style={{
                height: "50vh",
                width: "100%",
            }}
            ref={mapRef}
        ></div>
    );
};

export default MapLocationSetter;
