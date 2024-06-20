"use client";
import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Location } from "@/utils/map/Locator";
import { GOOGLEMAPS_TOKEN } from "@/map/Config";

const PolylineMap = ({
    start,
    end,
    coordinates,
}: {
    start: Location;
    end: Location | undefined;
    coordinates: Location[];
}) => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: GOOGLEMAPS_TOKEN,
                version: "weekly",
            });

            const { Map } = await loader.importLibrary("maps");

            const mapOptions: google.maps.MapOptions = {
                center: start,
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

            if (end) {
                new AdvancedMarkerElement({
                    map,
                    position: end,
                });
            }

            if (coordinates.length > 0) {
                const flightPath = new google.maps.Polyline({
                    path: coordinates,
                    geodesic: true,
                    strokeColor: "#3bb770",
                    strokeOpacity: 1.0,
                    strokeWeight: 8,
                });
    
                flightPath.setMap(map);
            }
        };

        initMap();
    }, [start, end, coordinates]); // Dependencias para actualizar el mapa cuando cambian

    return (
        <div
            style={{
                height: "80vh",
                width: "100%",
                borderRadius: "15px",
            }}
            ref={mapRef}
        ></div>
    );
};

export default PolylineMap;
