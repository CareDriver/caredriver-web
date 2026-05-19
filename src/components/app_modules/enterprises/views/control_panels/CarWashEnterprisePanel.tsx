"use client";

import React, { useState } from "react";
import {
  Enterprise,
  CarWashPlan,
  CarWashScheduleConfig,
  VEHICLE_SIZE_LABEL,
  VehicleSize,
} from "@/interfaces/Enterprise";
import { updateDoc, doc } from "firebase/firestore";
import { firestore } from "@/firebase/FirebaseConfig";
import { Collections } from "@/firebase/CollecionNames";
import { toast } from "react-toastify";
import Soap from "@/icons/Soap";
import Repeat from "@/icons/Repeat";

const DAY_LABELS: Record<number, string> = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
};

const VEHICLE_SIZES: VehicleSize[] = ["small", "medium", "large", "suv"];

interface Props {
  enterprise: Enterprise;
}

const CarWashEnterprisePanel: React.FC<Props> = ({ enterprise }) => {
  const [resettingCancellations, setResettingCancellations] = useState(false);

  const maxCancellations = enterprise.carWashMaxMonthlyCancellations ?? 5;
  const cancellationsUsed = enterprise.carWashCancellationsMonth ?? 0;

  const handleResetCancellations = async () => {
    if (!enterprise.id) return;
    setResettingCancellations(true);
    try {
      const ref = doc(firestore, Collections.Enterprises, enterprise.id);
      await updateDoc(ref, {
        carWashCancellationsMonth: 0,
      });
      toast.success("Contador de cancelaciones reiniciado");
    } catch (err) {
      console.error("[CarWashPanel] Error al reiniciar cancelaciones:", err);
      toast.error("Error al reiniciar el contador");
    } finally {
      setResettingCancellations(false);
    }
  };

  return (
    <div className="max-width-80 margin-top-25">
      <h2 className="text | bold medium icon-wrapper lb">
        <Soap />
        Gestión CarWash
      </h2>

      {/* Rating */}
      <div
        style={{
          padding: "12px 16px",
          borderRadius: 10,
          background: "var(--card-bg, #1a1a1a)",
          border: "1px solid var(--border-color, #333)",
          marginBottom: 16,
        }}
      >
        <p className="text bold" style={{ margin: 0 }}>
          Calificación
        </p>
        <p className="text" style={{ margin: "4px 0 0" }}>
          ⭐{" "}
          {enterprise.rating != null
            ? enterprise.rating.toFixed(1)
            : "Sin calificaciones"}{" "}
          {enterprise.ratingCount != null && (
            <span className="text gray small">
              ({enterprise.ratingCount} valoraciones)
            </span>
          )}
        </p>
      </div>

      {/* Cancellations counter */}
      <div
        style={{
          padding: "12px 16px",
          borderRadius: 10,
          background: "var(--card-bg, #1a1a1a)",
          border: "1px solid var(--border-color, #333)",
          marginBottom: 16,
        }}
      >
        <p className="text bold icon-wrapper" style={{ margin: 0 }}>
          <Repeat />
          Cancelaciones del mes
        </p>
        <p className="text" style={{ margin: "4px 0 8px" }}>
          {cancellationsUsed} / {maxCancellations}
          {cancellationsUsed >= maxCancellations && (
            <span
              className="text small"
              style={{ color: "#ef4444", marginLeft: 8 }}
            >
              Límite alcanzado
            </span>
          )}
        </p>
        <button
          className="small-general-button"
          onClick={handleResetCancellations}
          disabled={resettingCancellations || cancellationsUsed === 0}
        >
          {resettingCancellations ? "Reiniciando..." : "Reiniciar contador"}
        </button>
      </div>

      {/* Plans */}
      {enterprise.carWashPlans && enterprise.carWashPlans.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p className="text bold margin-bottom-10">Planes de servicio</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {enterprise.carWashPlans.map((plan) => (
              <CarWashPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      )}

      {/* Schedule config */}
      {enterprise.carWashScheduleConfig && (
        <div>
          <p className="text bold margin-bottom-10">Horarios de atención</p>
          <CarWashScheduleConfigView
            config={enterprise.carWashScheduleConfig}
          />
        </div>
      )}
    </div>
  );
};

const CarWashPlanCard: React.FC<{ plan: CarWashPlan }> = ({ plan }) => (
  <div
    style={{
      padding: "10px 14px",
      borderRadius: 8,
      background: "var(--card-bg, #1a1a1a)",
      border: "1px solid var(--border-color, #333)",
      opacity: plan.active ? 1 : 0.5,
    }}
  >
    <p className="text bold" style={{ margin: "0 0 2px" }}>
      {plan.name}
      {!plan.active && (
        <span className="text small gray" style={{ marginLeft: 8 }}>
          (Inactivo)
        </span>
      )}
    </p>
    {plan.description && (
      <p className="text small gray" style={{ margin: "0 0 6px" }}>
        {plan.description}
      </p>
    )}
    <p className="text small" style={{ margin: "0 0 4px" }}>
      Duración: {plan.durationMinutes} min
    </p>
    <div className="row-wrapper | gap-8">
      {VEHICLE_SIZES.map((size) => {
        const entry = plan.pricesBySize.find((p) => p.size === size);
        if (!entry) return null;
        return (
          <span key={size} className="text small">
            {VEHICLE_SIZE_LABEL[size]}: <strong>Bs. {entry.price}</strong>
          </span>
        );
      })}
    </div>
  </div>
);

const CarWashScheduleConfigView: React.FC<{
  config: CarWashScheduleConfig;
}> = ({ config }) => (
  <div
    style={{
      padding: "10px 14px",
      borderRadius: 8,
      background: "var(--card-bg, #1a1a1a)",
      border: "1px solid var(--border-color, #333)",
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {config.availabilitySlots.map((slot, i) => (
        <div key={i} className="row-wrapper | gap-10">
          <span className="text bold" style={{ minWidth: 90 }}>
            {DAY_LABELS[slot.dayOfWeek]}
          </span>
          <span className="text small">
            {slot.startTime} – {slot.endTime}
          </span>
          <span className="text small gray">
            Máx. {slot.maxServicesPerSlot} simultáneos
          </span>
        </div>
      ))}
    </div>
    {config.blockedDates && config.blockedDates.length > 0 && (
      <div style={{ marginTop: 10 }}>
        <p className="text small bold" style={{ margin: "0 0 4px" }}>
          Fechas bloqueadas
        </p>
        <p className="text small gray" style={{ margin: 0 }}>
          {config.blockedDates.join(", ")}
        </p>
      </div>
    )}
    <div className="row-wrapper | gap-15 margin-top-10">
      <span className="text small">
        Cancelar con: <strong>{config.cancelLeadTimeHours}h</strong> de
        anticipación
      </span>
      <span className="text small">
        Reagendar con: <strong>{config.rescheduleLeadTimeHours}h</strong> de
        anticipación
      </span>
    </div>
  </div>
);

export default CarWashEnterprisePanel;
