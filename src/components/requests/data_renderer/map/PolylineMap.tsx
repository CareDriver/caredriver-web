"use client";
import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Location } from "@/utils/map/Locator";
import { GOOGLEMAPS_TOKEN } from "@/map/Config";

/* 
example:
[
    { lat: -3.745, lng: -38.523 },
    { lat: -3.745, lng: -38.513 },
    { lat: -3.735, lng: -38.513 },
    { lat: -3.735, lng: -38.523 },
]
*/

const PolylineMap = ({
    start,
    end,
    coordinates,
}: {
    start: Location;
    end: Location;
    coordinates: Location[];
}) => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (true) {
            const initMap = async () => {
                const loader = new Loader({
                    apiKey: GOOGLEMAPS_TOKEN,
                    version: "weekly",
                });

                const { Map } = await loader.importLibrary("maps");

                const position: Location = start;

                const mapOptions: google.maps.MapOptions = {
                    center: position,
                    zoom: 16,
                    mapId: "GOOGLEMAP_FORM_ID",
                };

                const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
                const { AdvancedMarkerElement } = (await google.maps.importLibrary(
                    "marker",
                )) as google.maps.MarkerLibrary;

                new AdvancedMarkerElement({
                    map,
                    position: start,
                });

                new AdvancedMarkerElement({
                    map,
                    position: end,
                });

                /* const flightPath = new google.maps.Polyline({
                    path: coordinates,
                    geodesic: true,
                    strokeColor: "#3bb770",
                    strokeOpacity: 1.0,
                    strokeWeight: 8,
                });

                flightPath.setMap(map); */
            };

            initMap();
        }
    }, []);

    return (
        true && (
            <div
                style={{
                    height: "80vh",
                    width: "100%",
                    borderRadius: "15px"
                }}
                ref={mapRef}
            ></div>
        )
    );
};

export default PolylineMap;
