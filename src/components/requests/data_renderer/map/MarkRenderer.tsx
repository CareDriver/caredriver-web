"use client";
import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Location } from "@/utils/map/Locator";
import { GOOGLEMAPS_TOKEN } from "@/map/Config";

const MarkRenderer = ({ location }: { location: Location }) => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mapRef && mapRef.current) {
            const initMap = async () => {
                const loader = new Loader({
                    apiKey: GOOGLEMAPS_TOKEN,
                    version: "weekly",
                });

                const { Map } = await loader.importLibrary("maps");

                const position: Location = location;

                const mapOptions: google.maps.MapOptions = {
                    center: position,
                    zoom: 17,
                    mapId: "GOOGLEMAP_FORM_ID",
                };

                const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
                const { AdvancedMarkerElement } = (await google.maps.importLibrary(
                    "marker",
                )) as google.maps.MarkerLibrary;

                new AdvancedMarkerElement({
                    map,
                    position: location,
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
            }}
            ref={mapRef}
        ></div>
    );
};

export default MarkRenderer;
