"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Location } from "@/utils/map/Locator";
import { GOOGLEMAPS_TOKEN } from "@/components/form/models/MapSettings";
import { CoordinateRegister } from "@/interfaces/RouteNavigationInterface";
import {
    toLocationFromCoordRes,
    toLocationsFromCoordRes,
} from "@/utils/parser/ToCoordinates";
import { toformatDate } from "@/utils/parser/ForDate";
import { Timestamp } from "firebase/firestore";

const PolylineMap = ({
    priorArrivalRoute,
    serviceInProgressRoute,
}: {
    priorArrivalRoute: CoordinateRegister[];
    serviceInProgressRoute: CoordinateRegister[];
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    const priorPolylineRef = useRef<google.maps.Polyline | null>(null);
    const inProgressPolylineRef = useRef<google.maps.Polyline | null>(null);
    const priorMarksRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
    const inProgessMarksRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

    useEffect(() => {
        const renderPath = (
            ref: React.MutableRefObject<google.maps.Polyline | null>,
            color: string,
            points: CoordinateRegister[],
        ) => {
            if (mapInstanceRef.current) {
                const path = new google.maps.Polyline({
                    path: toLocationsFromCoordRes(points),
                    geodesic: true,
                    strokeColor: color,
                    strokeOpacity: 0.8,
                    strokeWeight: 12,
                });

                path.setMap(mapInstanceRef.current);
                ref.current = path;
            }
        };

        const renderPoints = async (
            background: string,
            borderColor: string,
            glyphColor: string,
            coordinates: CoordinateRegister[],
            markers: React.MutableRefObject<google.maps.marker.AdvancedMarkerElement[]>,
        ) => {
            if (coordinates.length > 0) {
                const { AdvancedMarkerElement, PinElement } =
                    (await google.maps.importLibrary(
                        "marker",
                    )) as google.maps.MarkerLibrary;

                var scale = 0.8;
                var majorScale = scale + 0.8;

                var first = coordinates[0];
                renderPoint(
                    AdvancedMarkerElement,
                    PinElement,
                    majorScale,
                    background,
                    background,
                    glyphColor,
                    first,
                    markers,
                );

                for (let i = 1; i < coordinates.length; i++) {
                    let coordinatte = coordinates[i];
                    renderPoint(
                        AdvancedMarkerElement,
                        PinElement,
                        scale,
                        background,
                        borderColor,
                        glyphColor,
                        coordinatte,
                        markers,
                    );
                }
            }
        };

        const renderPoint = (
            Marker: typeof google.maps.marker.AdvancedMarkerElement,
            Pin: typeof google.maps.marker.PinElement,
            scale: number,
            background: string,
            borderColor: string,
            glyphColor: string,
            coordinate: CoordinateRegister,
            markers: React.MutableRefObject<google.maps.marker.AdvancedMarkerElement[]>,
        ) => {
            var locationCoordinate = toLocationFromCoordRes(coordinate);
            if (!existMark(locationCoordinate, markers)) {
                const pin = new Pin({
                    scale,
                    background,
                    glyphColor,
                    borderColor,
                });
                const mark = new Marker({
                    map: mapInstanceRef.current,
                    position: locationCoordinate,
                    content: pin.element,
                    gmpClickable: true,
                });
                const contentString =
                    "<span>" +
                    `<p class="text">${coordinate.comment}</p>` +
                    `<p class="text | small light">${toformatDate(
                        Timestamp.fromMillis(coordinate.timestamp).toDate(),
                    )}</p>` +
                    "</span>";

                let infoWindow = new google.maps.InfoWindow({
                    content: contentString,
                    position: locationCoordinate,
                    ariaLabel: "Comment",
                });
                mark.addListener("click", () => {
                    infoWindow.close();
                    infoWindow.open(mark.map, mark);
                });
                markers.current.push(mark);
            }
        };

        const initMap = async () => {
            const loader = new Loader({
                apiKey: GOOGLEMAPS_TOKEN,
                version: "weekly",
            });

            const { Map } = await loader.importLibrary("maps");

            const mapOptions: google.maps.MapOptions = {
                center: toLocationFromCoordRes(priorArrivalRoute[0]),
                zoom: 16,
                mapId: "GOOGLEMAP_FORM_ID",
            };

            const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
            mapInstanceRef.current = map;
            if (priorArrivalRoute.length > 0) {
                renderPath(priorPolylineRef, "#456079", priorArrivalRoute);
            }

            if (serviceInProgressRoute.length > 0) {
                renderPath(inProgressPolylineRef, "#3bb770", serviceInProgressRoute);
            }

            setMapLoaded(true);
        };

        const renderPriorMarks = async () => {
            if (priorArrivalRoute.length > 0) {
                let background = "#456079";
                let borderColor = "#fff";
                let glyphColor = "#fff";
                await renderPoints(
                    background,
                    borderColor,
                    glyphColor,
                    priorArrivalRoute,
                    priorMarksRef,
                );
            }
        };

        const renderInProgressMarks = async () => {
            if (serviceInProgressRoute.length > 0) {
                let background = "#3bb770";
                let borderColor = "#fff";
                let glyphColor = "#fff";
                await renderPoints(
                    background,
                    borderColor,
                    glyphColor,
                    serviceInProgressRoute,
                    inProgessMarksRef,
                );
            }
        };

        const existMark = (
            c: Location,
            markers: React.MutableRefObject<google.maps.marker.AdvancedMarkerElement[]>,
        ) => {
            return markers.current.some(
                (mark) => mark.position?.lat === c.lat && mark.position?.lng === c.lng,
            );
        };

        if (!mapLoaded) {
            initMap().then(() => {
                renderPriorMarks();
                renderInProgressMarks();
            });
        } else {
            if (mapRef.current) {
                if (priorPolylineRef.current) {
                    priorPolylineRef.current.setPath(
                        toLocationsFromCoordRes(priorArrivalRoute),
                    );
                    renderPriorMarks();
                }
                if (serviceInProgressRoute.length > 0 && inProgressPolylineRef.current) {
                    inProgressPolylineRef.current.setPath(
                        toLocationsFromCoordRes(serviceInProgressRoute),
                    );
                    renderInProgressMarks();
                }
            }
        }
    }, [priorArrivalRoute, serviceInProgressRoute]);

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
