"use client";
import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { GOOGLEMAPS_TOKEN } from "@/components/form/models/MapProperties";
import { GeoPoint } from "firebase/firestore";
import { geoPointToLatLng } from "@/components/form/utils/MapLocationHelper";

const MapMarkRenderer = ({ location }: { location: GeoPoint }) => {
    const mapRef = useRef<HTMLDivElement>(null);

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

                const map = new Map(
                    mapRef.current as HTMLDivElement,
                    mapOptions,
                );
                const { AdvancedMarkerElement, PinElement } =
                    (await google.maps.importLibrary(
                        "marker",
                    )) as google.maps.MarkerLibrary;
                const pin = new PinElement({
                    scale: 1.6,
                    background: "#3bb770",
                    glyphColor: "#fff",
                    borderColor: "#3bb770",
                });
                new AdvancedMarkerElement({
                    map,
                    position: geoPointToLatLng(location),
                    content: pin.element,
                });
            };

            initMap();
        }
    }, []);

    return (
        <div
            style={{
                height: "50vh",
                width: "100%",
                borderRadius: "0.9375rem"
            }}
            ref={mapRef}
        ></div>
    );
};

export default MapMarkRenderer;
