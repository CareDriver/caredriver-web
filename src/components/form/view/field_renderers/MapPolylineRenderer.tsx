"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { GOOGLEMAPS_TOKEN } from "@/components/form/models/MapProperties";
import { CoordinateRegister } from "@/interfaces/RouteNavigationInterface";
import {
  toLocationFromCoordRes,
  toLocationsFromCoordRes,
} from "@/components/form/utils/CoordinateConverter";
import { timestampDateInSpanishWithHour } from "@/utils/helpers/DateHelper";
import { GeoPoint, Timestamp } from "firebase/firestore";
import { geoPointToLatLng } from "../../utils/MapLocationHelper";
import { isNullOrEmptyText } from "@/validators/TextValidator";
import { MAIN_COLOR, SECOND_COLOR_LIGHT, WHITE_COLOR } from "@/models/Colors";
import { NAME_BUSINESS } from "@/models/Business";
import { createGoogleMapsUrl } from "@/utils/helpers/MapHelper";
import GoogleMapsRedirector from "../maps/GoogleMapsRedirector";

const MapPolylineRenderer = ({
  priorArrivalRoute,
  serviceInProgressRoute,
}: {
  priorArrivalRoute: CoordinateRegister[];
  serviceInProgressRoute: CoordinateRegister[];
}) => {
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const priorPolylineRef = useRef<google.maps.Polyline | null>(null);
  const inProgressPolylineRef = useRef<google.maps.Polyline | null>(null);
  const priorMarksRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const inProgessMarksRef = useRef<google.maps.marker.AdvancedMarkerElement[]>(
    [],
  );
  const currentLocationMarkerRef =
    useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  // Inicializar el mapa solo una vez
  useEffect(() => {
    const initMap = async () => {
      if (mapInstanceRef.current) return;

      const loader = new Loader({
        apiKey: GOOGLEMAPS_TOKEN,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");

      const mapOptions: google.maps.MapOptions = {
        center: toLocationFromCoordRes(
          priorArrivalRoute[0] || serviceInProgressRoute[0],
        ),
        zoom: 16,
        mapId: "GOOGLEMAP_FORM_ID",
      };

      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);
      mapInstanceRef.current = map;
      setMapLoaded(true);
    };

    initMap();
  }, []);

  // Actualizar rutas y marcadores cuando cambien los datos
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    const renderPath = (
      ref: React.MutableRefObject<google.maps.Polyline | null>,
      color: string,
      points: CoordinateRegister[],
    ) => {
      if (ref.current) {
        ref.current.setMap(null);
      }

      if (points.length === 0) return;

      const path = new google.maps.Polyline({
        path: toLocationsFromCoordRes(points),
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 12,
      });

      path.setMap(mapInstanceRef.current);
      ref.current = path;
    };

    const existMark = (
      c: GeoPoint,
      markers: React.MutableRefObject<
        google.maps.marker.AdvancedMarkerElement[]
      >,
    ) => {
      return markers.current.some(
        (mark) =>
          mark.position?.lat === c.latitude &&
          mark.position?.lng === c.longitude,
      );
    };

    const renderPoint = (
      Marker: typeof google.maps.marker.AdvancedMarkerElement,
      Pin: typeof google.maps.marker.PinElement,
      pinConfig: {
        scale: number;
        background: string;
        borderColor: string;
        glyphColor: string;
        label: string;
      },
      coordinate: CoordinateRegister,
      markers: React.MutableRefObject<
        google.maps.marker.AdvancedMarkerElement[]
      >,
      title: string,
    ) => {
      const locationCoordinate = new GeoPoint(coordinate.lat, coordinate.long);

      if (existMark(locationCoordinate, markers)) return;

      const pin = new Pin({
        scale: pinConfig.scale,
        background: pinConfig.background,
        glyphColor: pinConfig.glyphColor,
        borderColor: pinConfig.borderColor,
        glyph: pinConfig.label,
      });

      const mark = new Marker({
        map: mapInstanceRef.current,
        position: geoPointToLatLng(locationCoordinate),
        content: pin.element,
        gmpClickable: true,
        title: title,
      });

      const contentString =
        '<div id="content">' +
        '<div id="siteNotice">' +
        "</div>" +
        `<h3 id="firstHeading" class="firstHeading">${NAME_BUSINESS} - ${title}</h3>` +
        '<div id="bodyContent">' +
        `<p><b>Fecha:</b> ${timestampDateInSpanishWithHour(
          Timestamp.fromMillis(coordinate.timestamp),
        )}</p>` +
        `${
          isNullOrEmptyText(coordinate.comment)
            ? "<p><i>Sin comentario</i></p>"
            : `<p><b>Comentario:</b> ${coordinate.comment}</p>`
        }` +
        `${
          coordinate.mockedLocation
            ? '<p style="color: red;"><b>⚠️ Ubicación simulada detectada</b></p>'
            : ""
        }` +
        "</div>" +
        "</div>";

      const infoWindow = new google.maps.InfoWindow({
        content: contentString,
        position: geoPointToLatLng(locationCoordinate),
        ariaLabel: title,
      });

      mark.addListener("click", () => {
        infoWindow.close();
        infoWindow.open(mark.map, mark);
      });

      const mapUrl: string = createGoogleMapsUrl({
        lat: coordinate.lat,
        lng: coordinate.long,
      });
      setGoogleMapsUrl(mapUrl);
      markers.current.push(mark);
    };

    const renderCurrentLocation = async () => {
      let lastCoordinate: CoordinateRegister | null = null;

      if (serviceInProgressRoute.length > 0) {
        lastCoordinate =
          serviceInProgressRoute[serviceInProgressRoute.length - 1];
      } else if (priorArrivalRoute.length > 0) {
        lastCoordinate = priorArrivalRoute[priorArrivalRoute.length - 1];
      }

      if (!lastCoordinate) return;

      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        "marker",
      )) as google.maps.MarkerLibrary;

      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.map = null;
      }

      const pinElement = document.createElement("div");
      pinElement.style.width = "24px";
      pinElement.style.height = "24px";
      pinElement.style.borderRadius = "50%";
      pinElement.style.backgroundColor = "#4285F4";
      pinElement.style.border = "4px solid white";
      pinElement.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";

      const currentLocationMarker = new AdvancedMarkerElement({
        map: mapInstanceRef.current,
        position: { lat: lastCoordinate.lat, lng: lastCoordinate.long },
        content: pinElement,
        title: "Ubicación actual",
      });

      const contentString =
        '<div id="content">' +
        `<h3 id="firstHeading" class="firstHeading">📍 Ubicación Actual</h3>` +
        '<div id="bodyContent">' +
        `<p><b>Última actualización:</b> ${timestampDateInSpanishWithHour(
          Timestamp.fromMillis(lastCoordinate.timestamp),
        )}</p>` +
        `${
          isNullOrEmptyText(lastCoordinate.comment)
            ? "<p><i>Sin comentario</i></p>"
            : `<p><b>Comentario:</b> ${lastCoordinate.comment}</p>`
        }` +
        `${
          lastCoordinate.mockedLocation
            ? '<p style="color: red;"><b>⚠️ Ubicación simulada detectada</b></p>'
            : ""
        }` +
        "</div>" +
        "</div>";

      const infoWindow = new google.maps.InfoWindow({
        content: contentString,
      });

      currentLocationMarker.addListener("click", () => {
        infoWindow.close();
        infoWindow.open(mapInstanceRef.current, currentLocationMarker);
      });

      currentLocationMarkerRef.current = currentLocationMarker;
      mapInstanceRef.current?.panTo({
        lat: lastCoordinate.lat,
        lng: lastCoordinate.long,
      });
    };

    const renderPoints = async (
      routeType: "prior" | "inProgress",
      coordinates: CoordinateRegister[],
      markers: React.MutableRefObject<
        google.maps.marker.AdvancedMarkerElement[]
      >,
    ) => {
      if (coordinates.length === 0) return;

      const { AdvancedMarkerElement, PinElement } =
        (await google.maps.importLibrary(
          "marker",
        )) as google.maps.MarkerLibrary;

      const isPrior = routeType === "prior";
      const baseBackground = isPrior ? SECOND_COLOR_LIGHT : MAIN_COLOR;
      const baseBorder = isPrior ? SECOND_COLOR_LIGHT : SECOND_COLOR_LIGHT;
      const baseGlyph = isPrior ? WHITE_COLOR : SECOND_COLOR_LIGHT;

      const first = coordinates[0];
      renderPoint(
        AdvancedMarkerElement,
        PinElement,
        {
          scale: 1.5,
          background: baseBackground,
          borderColor: baseBorder,
          glyphColor: WHITE_COLOR,
          label: "I",
        },
        first,
        markers,
        "Inicio",
      );

      if (coordinates.length > 2) {
        for (let i = 1; i < coordinates.length - 1; i++) {
          renderPoint(
            AdvancedMarkerElement,
            PinElement,
            {
              scale: 0.6,
              background: baseBackground,
              borderColor: baseBorder,
              glyphColor: baseGlyph,
              label: "",
            },
            coordinates[i],
            markers,
            `Punto ${i}`,
          );
        }
      }

      if (
        coordinates.length > 1 &&
        routeType === "prior" &&
        serviceInProgressRoute.length === 0
      ) {
        const last = coordinates[coordinates.length - 1];
        renderPoint(
          AdvancedMarkerElement,
          PinElement,
          {
            scale: 1.5,
            background: baseBackground,
            borderColor: baseBorder,
            glyphColor: WHITE_COLOR,
            label: "F",
          },
          last,
          markers,
          "Final",
        );
      }
    };

    const updateMap = async () => {
      console.log("Updating map with new data", {
        priorCount: priorArrivalRoute.length,
        inProgressCount: serviceInProgressRoute.length,
      });

      priorMarksRef.current.forEach((m) => (m.map = null));
      priorMarksRef.current = [];
      inProgessMarksRef.current.forEach((m) => (m.map = null));
      inProgessMarksRef.current = [];

      if (priorArrivalRoute.length > 0) {
        renderPath(priorPolylineRef, SECOND_COLOR_LIGHT, priorArrivalRoute);
      }

      if (serviceInProgressRoute.length > 0) {
        renderPath(inProgressPolylineRef, MAIN_COLOR, serviceInProgressRoute);
      }

      if (priorArrivalRoute.length > 0) {
        await renderPoints("prior", priorArrivalRoute, priorMarksRef);
      }
      if (serviceInProgressRoute.length > 0) {
        await renderPoints(
          "inProgress",
          serviceInProgressRoute,
          inProgessMarksRef,
        );
      }

      await renderCurrentLocation();
    };

    updateMap();
  }, [mapLoaded, priorArrivalRoute, serviceInProgressRoute]);

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "400px",
        }}
      />
      <GoogleMapsRedirector googleMapsUrl={googleMapsUrl} />
    </div>
  );
};

export default MapPolylineRenderer;
