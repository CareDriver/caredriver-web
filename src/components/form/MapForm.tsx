"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { DEFAULT_LOCATION, Location } from "@/utils/map/Locator";
import { GOOGLEMAPS_TOKEN } from "@/map/Config";

const MapForm = ({
    location,
    setLocation,
}: {
    location: Location | null;
    setLocation: (location: Location) => void;
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    var lastMarker: google.maps.marker.AdvancedMarkerElement | null = null;

    useEffect(() => {
        const initMap = async () => {
            const loader = new Loader({
                apiKey: GOOGLEMAPS_TOKEN,
                version: "weekly",
            });

            const { Map } = await loader.importLibrary("maps");

            const position: Location = location ? location : DEFAULT_LOCATION;

            const mapOptions: google.maps.MapOptions = {
                center: position,
                zoom: 17,
                mapId: "GOOGLEMAP_FORM_ID",
            };

            const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
            const { AdvancedMarkerElement, PinElement } =
                (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;

            const pin = new PinElement({
                scale: 1.6,
                background: "#3bb770",
                glyphColor: "#fff",
                borderColor: "#3bb770",
            });

            // Create the initial InfoWindow.
            /*             let infoWindow = new google.maps.InfoWindow({
                content: "Click the map to get Lat/Lng!",
                position: position,
            });

            infoWindow.open(map); */

            // Configure the click listener.

            if (location) {
                lastMarker = new AdvancedMarkerElement({
                    map,
                    position: location,
                    content: pin.element,
                });
            }

            map.addListener("click", (mapsMouseEvent: any) => {
                var newPosition: Location = {
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

                setLocation(newPosition);

                /* 
                // Close the current InfoWindow.
                infoWindow.close();

                // Create a new InfoWindow.
                infoWindow = new google.maps.InfoWindow({
                    position: mapsMouseEvent.latLng,
                });
                infoWindow.setContent(
                    JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2),
                );
                infoWindow.open(map); */
            });
        };

        initMap();
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

export default MapForm;
