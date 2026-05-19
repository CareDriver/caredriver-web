/// <reference types="@types/google.maps" />
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import {
  DEFAULT_LOCATION,
  GOOGLEMAPS_TOKEN,
} from "@/components/form/models/MapProperties";
import {
  NearbyProviderInfo,
  ProviderOnlineStatus,
  getProviderOnlineStatus,
  getNearbyProviders,
} from "@/components/app_modules/users/api/NearbyProvidersRequester";
import { Services, ServicesRender } from "@/interfaces/Services";
import { Locations, locationList } from "@/interfaces/Locations";

const SERVICE_OPTIONS = [
  Services.Driver,
  Services.Mechanic,
  Services.Tow,
  Services.Laundry,
];

const STATUS_COLOR: Record<ProviderOnlineStatus, string> = {
  online: "#22c55e",
  recent: "#eab308",
  offline: "#ef4444",
};

const STATUS_LABEL: Record<ProviderOnlineStatus, string> = {
  online: "Activo (< 5 min)",
  recent: "Activo recientemente (< 30 min)",
  offline: "Sin actividad reciente",
};

const ProviderLocationMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedService, setSelectedService] = useState<Services>(
    Services.Driver,
  );
  const [selectedLocation, setSelectedLocation] = useState<Locations>(
    Locations.CochabambaBolivia,
  );
  const [providers, setProviders] = useState<NearbyProviderInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const loadProviders = async () => {
    setLoading(true);
    try {
      const data = await getNearbyProviders(
        selectedService,
        selectedLocation,
        50,
      );
      setProviders(data);
    } catch (err) {
      console.error("[ProviderLocationMap] Error al cargar proveedores:", err);
    } finally {
      setLoading(false);
    }
  };

  // Init map once
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: GOOGLEMAPS_TOKEN,
        version: "weekly",
      });
      const { Map } = await loader.importLibrary("maps");
      const map = new Map(mapRef.current as HTMLDivElement, {
        center: {
          lat: DEFAULT_LOCATION.latitude,
          lng: DEFAULT_LOCATION.longitude,
        },
        zoom: 12,
        mapId: "PROVIDER_MAP_ID",
      });
      mapInstanceRef.current = map;
      infoWindowRef.current = new google.maps.InfoWindow();
    };
    initMap();
  }, []);

  // Update markers when providers change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const updateMarkers = async () => {
      // Clear old markers
      markersRef.current.forEach((m) => (m.map = null));
      markersRef.current = [];

      const { AdvancedMarkerElement, PinElement } =
        (await google.maps.importLibrary(
          "marker",
        )) as google.maps.MarkerLibrary;

      for (const provider of providers) {
        if (!provider.lastKnownLocation) continue;
        const status = getProviderOnlineStatus(
          provider.lastKnownLocation,
          provider.isAvailable,
        );
        const pin = new PinElement({
          background: STATUS_COLOR[status],
          glyphColor: "#fff",
          borderColor: "#fff",
          scale: 1.2,
          glyph: provider.fullName.charAt(0).toUpperCase(),
        });
        const marker = new AdvancedMarkerElement({
          map: mapInstanceRef.current!,
          position: {
            lat: provider.lastKnownLocation.latitude,
            lng: provider.lastKnownLocation.longitude,
          },
          content: pin.element,
          title: provider.fullName,
        });

        // Info popup on click
        const lastSeenMs = provider.lastKnownLocation.updatedAt.toMillis();
        const diffMin = Math.floor((Date.now() - lastSeenMs) / 60000);
        const lastSeenText =
          diffMin < 1
            ? "hace un momento"
            : diffMin < 60
              ? `hace ${diffMin} min`
              : diffMin < 1440
                ? `hace ${Math.floor(diffMin / 60)} h`
                : `hace ${Math.floor(diffMin / 1440)} días`;

        const phoneHtml = provider.phone
          ? `<a href="https://wa.me/591${provider.phone}" target="_blank" style="color:#22c55e;">+591 ${provider.phone}</a>`
          : "<span style='color:#888'>Sin teléfono</span>";

        const DAY_ORDER = [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ];
        const DAY_LABELS: Record<string, string> = {
          monday: "Lun",
          tuesday: "Mar",
          wednesday: "Mié",
          thursday: "Jue",
          friday: "Vie",
          saturday: "Sáb",
          sunday: "Dom",
        };
        const schedule = provider.availabilityConfig?.weeklySchedule;
        const availabilityHtml = schedule
          ? (() => {
              const enabled = DAY_ORDER.filter(
                (d) => schedule[d as keyof typeof schedule]?.enabled,
              );
              if (enabled.length === 0)
                return "<p style='margin:6px 0 0;color:#888;font-size:11px'>Sin días configurados</p>";
              return (
                `<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px">` +
                enabled
                  .map((d) => {
                    const day = schedule[d as keyof typeof schedule];
                    const slots = day.slots
                      .map(
                        (s: { startTime: string; endTime: string }) =>
                          `${s.startTime}–${s.endTime}`,
                      )
                      .join(", ");
                    return `<span title="${slots || "Todo el día"}" style="font-size:11px;font-weight:600;padding:2px 7px;border-radius:20px;background:#1e3a2f;color:#4ade80">${DAY_LABELS[d]}${slots ? ` · ${slots}` : ""}</span>`;
                  })
                  .join("") +
                `</div>`
              );
            })()
          : "";

        const infoContent = `
          <div style="font-family:sans-serif;font-size:13px;min-width:200px;padding:4px 2px">
            <p style="margin:0 0 4px;font-weight:700;font-size:15px">${provider.fullName}</p>
            <p style="margin:0 0 2px;color:${STATUS_COLOR[status]};font-weight:600">${STATUS_LABEL[status]}</p>
            <p style="margin:0 0 6px;color:#888">Última conexión ${lastSeenText}</p>
            <p style="margin:0 0 4px">${phoneHtml}</p>
            ${availabilityHtml}
          </div>`;

        marker.addListener("click", () => {
          infoWindowRef.current?.close();
          infoWindowRef.current?.setContent(infoContent);
          infoWindowRef.current?.open({
            anchor: marker,
            map: mapInstanceRef.current!,
          });
        });

        markersRef.current.push(marker);
      }
    };
    updateMarkers();
  }, [providers]);

  return (
    <div>
      <div className="row-wrapper | gap-10 margin-bottom-15">
        <select
          className="form-section-input"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value as Services)}
          style={{ flex: 1 }}
        >
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {ServicesRender[s] ?? s}
            </option>
          ))}
        </select>
        <select
          className="form-section-input"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value as Locations)}
          style={{ flex: 1 }}
        >
          {locationList.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <button
          className="small-general-button"
          onClick={loadProviders}
          disabled={loading}
        >
          {loading ? "Cargando..." : "Buscar"}
        </button>
      </div>

      {/* Legend */}
      <div className="row-wrapper | gap-15 margin-bottom-10">
        {(["online", "recent", "offline"] as ProviderOnlineStatus[]).map(
          (s) => (
            <span key={s} className="row-wrapper | gap-5 text small">
              <span
                style={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: STATUS_COLOR[s],
                }}
              />
              {STATUS_LABEL[s]}
            </span>
          ),
        )}
      </div>

      <div
        ref={mapRef}
        style={{ width: "100%", height: 500, borderRadius: 12 }}
      />

      <p className="text small | margin-top-10">
        {providers.length} proveedores encontrados
        {providers.filter((p) => !p.lastKnownLocation).length > 0 && (
          <>
            {" "}
            · {providers.filter((p) => !p.lastKnownLocation).length} sin
            ubicación registrada
          </>
        )}
      </p>
    </div>
  );
};

export default ProviderLocationMap;
