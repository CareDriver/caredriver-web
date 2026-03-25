"use client";

import { useContext, useEffect, useState } from "react";
import {
  fetchAvailableServicesToGetRequests,
  getAdminPricingSettings,
  saveAvailableServicesToGetRequests,
  saveAdminPricingSettings,
} from "../api/AdminPricingSettingsRequester";
import {
  ADMIN_PRICING_SETTINGS_DOC_ID,
  AdminPricingSettings,
  AVAILABLE_SERVICES_TO_GET_REQUESTS_DOC_ID,
  AvailableServicesToGetRequests,
  DEFAULT_ADMIN_PRICING_SETTINGS,
  INITIAL_AVAILABLE_SERVICES,
} from "@/interfaces/AdminSettings";
import { toast } from "react-toastify";
import PageLoading from "@/components/loaders/PageLoading";
import { AuthContext } from "@/context/AuthContext";

const AdminPricingSettingsPanel = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jsonValue, setJsonValue] = useState("");
  const [availableServicesJsonValue, setAvailableServicesJsonValue] =
    useState("");

  useEffect(() => {
    Promise.all([
      getAdminPricingSettings()
        .then((settings) => {
          setJsonValue(JSON.stringify(settings, null, 2));
        })
        .catch((error) => {
          console.error(error);
          toast.error("No se pudo cargar admin-settings de precios");
          setJsonValue(JSON.stringify(DEFAULT_ADMIN_PRICING_SETTINGS, null, 2));
        }),
      fetchAvailableServicesToGetRequests((data) => {
        if (data === "loading") {
          return;
        }
        setAvailableServicesJsonValue(JSON.stringify(data, null, 2));
      }).catch((error) => {
        console.error(error);
        toast.error("No se pudo cargar servicios disponibles");
        setAvailableServicesJsonValue(
          JSON.stringify(INITIAL_AVAILABLE_SERVICES, null, 2),
        );
      }),
    ]).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (saving) {
      return;
    }

    let parsedPricing: AdminPricingSettings;
    let parsedAvailableServices: AvailableServicesToGetRequests;
    try {
      parsedPricing = JSON.parse(jsonValue) as AdminPricingSettings;
      parsedAvailableServices = JSON.parse(
        availableServicesJsonValue,
      ) as AvailableServicesToGetRequests;
    } catch {
      toast.error("JSON inválido. Revisa el formato antes de guardar.");
      return;
    }

    setSaving(true);
    try {
      const nowIso = new Date().toISOString();

      const pricingToSave: AdminPricingSettings = {
        ...parsedPricing,
        id: parsedPricing.id || ADMIN_PRICING_SETTINGS_DOC_ID,
        updatedAtIso: nowIso,
        updatedByUserId: user?.id,
      };

      const availableServicesToSave: AvailableServicesToGetRequests = {
        ...parsedAvailableServices,
        id:
          parsedAvailableServices.id ||
          AVAILABLE_SERVICES_TO_GET_REQUESTS_DOC_ID,
        updatedAtIso: new Date().toISOString(),
        updatedByUserId: user?.id,
      };

      await Promise.all([
        saveAdminPricingSettings(pricingToSave),
        saveAvailableServicesToGetRequests(availableServicesToSave),
      ]);

      setJsonValue(JSON.stringify(pricingToSave, null, 2));
      setAvailableServicesJsonValue(
        JSON.stringify(availableServicesToSave, null, 2),
      );
      toast.success("Admin settings guardado");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo guardar admin-settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoading />;
  }

  return (
    <section className="service-form-wrapper">
      <h1 className="text | big bold">
        Admin Settings de Precios y Comisiones
      </h1>
      <p className="text | light margin-top-10 max-width-80">
        Aquí puedes configurar rangos/precios recomendados, comisiones por
        ubicación, reglas temporales por fecha/hora y reglas para usuarios
        creados antes de una fecha.
      </p>

      <div className="form-sub-container | margin-top-25 max-width-80">
        <fieldset className="form-section">
          <textarea
            className="form-section-input"
            rows={18}
            value={jsonValue}
            onChange={(e) => setJsonValue(e.target.value)}
          />
          <legend className="form-section-legend">
            Documento admin-settings (precios y comisiones)
          </legend>
        </fieldset>

        <fieldset className="form-section margin-top-15">
          <textarea
            className="form-section-input"
            rows={12}
            value={availableServicesJsonValue}
            onChange={(e) => setAvailableServicesJsonValue(e.target.value)}
          />
          <legend className="form-section-legend">
            Documento availableServicesToGetRequests
          </legend>
        </fieldset>

        <button
          type="button"
          className="general-button green margin-top-15"
          onClick={save}
          disabled={saving}
        >
          {saving ? "Guardando..." : "Guardar configuración"}
        </button>
      </div>
    </section>
  );
};

export default AdminPricingSettingsPanel;
