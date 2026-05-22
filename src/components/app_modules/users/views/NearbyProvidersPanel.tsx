"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  NearbyProviderInfo,
  ProviderOnlineStatus,
  getProviderOnlineStatus,
  getNearbyProviders,
} from "@/components/app_modules/users/api/NearbyProvidersRequester";
import { Services, ServicesRender } from "@/interfaces/Services";
import { Locations, locationList } from "@/interfaces/Locations";
import { createGoogleMapsUrl } from "@/utils/helpers/MapHelper";
import { timestampDateInSpanish } from "@/utils/helpers/DateHelper";
import { AvailabilityConfig } from "@/interfaces/UserInterface";
import Whatsapp from "@/icons/Whatsapp";
import LocationDot from "@/icons/LocationDot";
import { NAME_BUSINESS } from "@/models/Business";

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
  online: "Activo",
  recent: "Activo recientemente",
  offline: "Sin actividad reciente",
};

const DAY_LABELS: Record<string, string> = {
  monday: "Lun",
  tuesday: "Mar",
  wednesday: "Mié",
  thursday: "Jue",
  friday: "Vie",
  saturday: "Sáb",
  sunday: "Dom",
};

const DAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const AvailabilityBadges = ({ config }: { config: AvailabilityConfig }) => {
  const enabledDays = DAY_ORDER.filter(
    (d) =>
      config.weeklySchedule[d as keyof typeof config.weeklySchedule]?.enabled,
  );

  if (enabledDays.length === 0) {
    return (
      <p className="text small" style={{ margin: "4px 0 0", color: "#888" }}>
        Sin días configurados
      </p>
    );
  }

  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {enabledDays.map((d) => {
          const day =
            config.weeklySchedule[d as keyof typeof config.weeklySchedule];
          const slots = day.slots
            .map((s) => `${s.startTime}–${s.endTime}`)
            .join(", ");
          return (
            <span
              key={d}
              title={slots || "Todo el día"}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "2px 7px",
                borderRadius: 20,
                background: "#1e3a2f",
                color: "#4ade80",
                cursor: "default",
              }}
            >
              {DAY_LABELS[d]}
              {slots ? ` · ${slots}` : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const getTimeSince = (ms: number): string => {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "hace un momento";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  return `hace ${Math.floor(hours / 24)} días`;
};

const NearbyProvidersPanel: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Services>(
    Services.Driver,
  );
  const [selectedLocation, setSelectedLocation] = useState<Locations>(
    Locations.CochabambaBolivia,
  );
  const [providers, setProviders] = useState<NearbyProviderInfo[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await getNearbyProviders(
        selectedService,
        selectedLocation,
        20,
      );
      setProviders(data);
    } catch (err) {
      console.error("[NearbyProvidersPanel] Error al cargar proveedores:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Filters */}
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
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Cargando..." : "Buscar"}
        </button>
      </div>

      {providers === null && !loading && (
        <p className="text gray">
          Selecciona un servicio y ciudad para buscar proveedores.
        </p>
      )}

      {providers !== null && providers.length === 0 && (
        <p className="text gray">
          No hay proveedores disponibles con esos filtros.
        </p>
      )}

      {providers && providers.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {providers.map((provider) => {
            const status = getProviderOnlineStatus(
              provider.lastKnownLocation,
              provider.isAvailable,
            );
            const mapsUrl = provider.lastKnownLocation
              ? createGoogleMapsUrl({
                  lat: provider.lastKnownLocation.latitude,
                  lng: provider.lastKnownLocation.longitude,
                })
              : null;
            const waUrl = provider.phone
              ? `https://wa.me/591${provider.phone}?text=Hola%20${encodeURIComponent(provider.fullName.split(" ")[0])}%2C%20te%20contactamos%20desde%20${encodeURIComponent(NAME_BUSINESS)}%20Admin.`
              : null;

            return (
              <div
                key={provider.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: "#f8f8f8",
                  border: "1px solid #d4d4d4",
                }}
              >
                {/* Avatar */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  {provider.photoUrl ? (
                    <Image
                      src={provider.photoUrl}
                      alt={provider.fullName}
                      width={44}
                      height={44}
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: "#333",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 18,
                      }}
                    >
                      {provider.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {/* Status dot */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: STATUS_COLOR[status],
                      border: "2px solid #111",
                    }}
                  />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="text bold" style={{ margin: 0 }}>
                    {provider.fullName}
                  </p>
                  <p
                    className="text small"
                    style={{ margin: 0, color: STATUS_COLOR[status] }}
                  >
                    {STATUS_LABEL[status]}
                  </p>
                  {provider.lastKnownLocation && (
                    <p
                      className="text small"
                      style={{ margin: 0, color: "#888" }}
                    >
                      Última conexión{" "}
                      {getTimeSince(
                        provider.lastKnownLocation.updatedAt.toMillis(),
                      )}
                    </p>
                  )}
                  {provider.availabilityConfig ? (
                    <AvailabilityBadges config={provider.availabilityConfig} />
                  ) : (
                    <p
                      className="text small"
                      style={{ margin: "2px 0 0", color: "#aaa" }}
                    >
                      Sin disponibilidad configurada
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="row-wrapper | gap-8">
                  {mapsUrl && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="small-general-button icon-wrapper | less-padding"
                      title="Ver en mapa"
                    >
                      <LocationDot />
                    </a>
                  )}
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="small-general-button icon-wrapper | less-padding"
                      title="Contactar por WhatsApp"
                    >
                      <Whatsapp />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NearbyProvidersPanel;
