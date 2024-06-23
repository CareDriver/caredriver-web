"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Location } from "@/utils/map/Locator";
import { GOOGLEMAPS_TOKEN } from "@/map/Config";
import { CoordinateRegister } from "@/interfaces/RouteNavigationInterface";
import {
    toLocationFromCoordRes,
    toLocationsFromCoordRes,
} from "@/utils/parser/ToCoordinates";
import { toformatDate } from "@/utils/parser/ForDate";

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
        if (priorArrivalRoute.length > 0) {
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
                    const path = new google.maps.Polyline({
                        path: toLocationsFromCoordRes(priorArrivalRoute),
                        geodesic: true,
                        strokeColor: "#456079",
                        strokeOpacity: 0.8,
                        strokeWeight: 12,
                    });

                    path.setMap(map);
                    priorPolylineRef.current = path;
                }

                if (serviceInProgressRoute.length > 0) {
                    const path = new google.maps.Polyline({
                        path: toLocationsFromCoordRes(serviceInProgressRoute),
                        geodesic: true,
                        strokeColor: "#3bb770",
                        strokeOpacity: 0.8,
                        strokeWeight: 12,
                    });

                    path.setMap(map);
                    inProgressPolylineRef.current = path;
                }

                setMapLoaded(true);
            };

            const renderPriorMarks = async () => {
                if (priorArrivalRoute.length > 0) {
                    const { AdvancedMarkerElement, PinElement } =
                        (await google.maps.importLibrary(
                            "marker",
                        )) as google.maps.MarkerLibrary;

                    var firstMark = priorArrivalRoute[0];
                    var firstMarkCoor = toLocationFromCoordRes(firstMark);
                    if (!existMark(firstMarkCoor)) {
                        const pin = new PinElement({
                            scale: 1.6,
                            background: "#456079",
                            glyphColor: "#fff",
                            borderColor: "#456079",
                        });
                        const mark = new AdvancedMarkerElement({
                            map: mapInstanceRef.current,
                            position: firstMarkCoor,
                            content: pin.element,
                            gmpClickable: true,
                        });
                        const contentString =
                            "<span>" +
                            `<p class="text">${firstMark.comment}</p>` +
                            `<p class="text | small light">${toformatDate(
                                new Date(firstMark.timestamp),
                            )}</p>` +
                            "</span>";

                        let infoWindow = new google.maps.InfoWindow({
                            content: contentString,
                            position: firstMarkCoor,
                            ariaLabel: "Comment",
                        });
                        mark.addListener("click", () => {
                            infoWindow.close();
                            infoWindow.open(mark.map, mark);
                        });
                        priorMarksRef.current.push(mark);
                    }

                    for (let i = 1; i < priorArrivalRoute.length; i++) {
                        const c = priorArrivalRoute[i];
                        const cCoor = toLocationFromCoordRes(c);
                        if (!existMark(cCoor)) {
                            const pin = new PinElement({
                                scale: 0.7,
                                background: "#456079",
                                glyphColor: "#fff",
                                borderColor: "#fff",
                            });
                            const mark = new AdvancedMarkerElement({
                                map: mapInstanceRef.current,
                                position: cCoor,
                                content: pin.element,
                                gmpClickable: true,
                            });
                            const contentString =
                                "<span>" +
                                `<p class="text">${c.comment}</p>` +
                                `<p class="text | small light">${toformatDate(
                                    new Date(c.timestamp),
                                )}</p>` +
                                "</span>";

                            let infoWindow = new google.maps.InfoWindow({
                                content: contentString,
                                position: cCoor,
                                ariaLabel: "Comment",
                            });
                            mark.addListener("click", () => {
                                infoWindow.close();
                                infoWindow.open(mark.map, mark);
                            });
                            priorMarksRef.current.push(mark);
                        }
                    }
                }
            };

            const renderInProgressMarks = async () => {
                if (serviceInProgressRoute.length > 0) {
                    const { AdvancedMarkerElement, PinElement } =
                        (await google.maps.importLibrary(
                            "marker",
                        )) as google.maps.MarkerLibrary;

                    var firstMark = serviceInProgressRoute[0];
                    var firstMarkCoor = toLocationFromCoordRes(firstMark);
                    if (!existMarkInProgess(firstMarkCoor)) {
                        const pin = new PinElement({
                            scale: 1.6,
                            background: "#3bb770",
                            glyphColor: "#fff",
                            borderColor: "#3bb770",
                        });
                        const mark = new AdvancedMarkerElement({
                            map: mapInstanceRef.current,
                            position: firstMarkCoor,
                            content: pin.element,
                            gmpClickable: true,
                        });
                        const contentString =
                            "<span>" +
                            `<p class="text">${firstMark.comment}</p>` +
                            `<p class="text | small light">${toformatDate(
                                new Date(firstMark.timestamp),
                            )}</p>` +
                            "</span>";

                        let infoWindow = new google.maps.InfoWindow({
                            content: contentString,
                            position: firstMarkCoor,
                            ariaLabel: "Comment",
                        });
                        mark.addListener("click", () => {
                            infoWindow.close();
                            infoWindow.open(mark.map, mark);
                        });
                        inProgessMarksRef.current.push(mark);
                    }

                    for (let i = 1; i < serviceInProgressRoute.length; i++) {
                        const c = serviceInProgressRoute[i];
                        const cCoor = toLocationFromCoordRes(c);
                        if (!existMarkInProgess(cCoor)) {
                            const pin = new PinElement({
                                scale: 0.7,
                                background: "#3bb770",
                                glyphColor: "#fff",
                                borderColor: "#fff",
                            });
                            const mark = new AdvancedMarkerElement({
                                map: mapInstanceRef.current,
                                position: cCoor,
                                content: pin.element,
                                gmpClickable: true,
                            });
                            const contentString =
                                "<div>" +
                                `<p class="text">${c.comment}</p>` +
                                `<p class="text | small light">${toformatDate(
                                    new Date(c.timestamp),
                                )}</p>` +
                                "</div>";

                            let infoWindow = new google.maps.InfoWindow({
                                content: contentString,
                                position: cCoor,
                                ariaLabel: "Comment",
                            });
                            mark.addListener("click", () => {
                                infoWindow.close();
                                infoWindow.open(mark.map, mark);
                            });
                            inProgessMarksRef.current.push(mark);
                        }
                    }
                }
            };

            const existMark = (c: Location) => {
                return priorMarksRef.current.some(
                    (mark) =>
                        mark.position?.lat === c.lat && mark.position?.lng === c.lng,
                );
            };

            const existMarkInProgess = (c: Location) => {
                return inProgessMarksRef.current.some(
                    (mark) =>
                        mark.position?.lat === c.lat && mark.position?.lng === c.lng,
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
                    if (inProgressPolylineRef.current) {
                        inProgressPolylineRef.current.setPath(
                            toLocationsFromCoordRes(serviceInProgressRoute),
                        );
                        renderInProgressMarks();
                    }
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
