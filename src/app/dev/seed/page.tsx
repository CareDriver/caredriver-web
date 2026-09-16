"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { seedDevDataWeb, clearDevDataWeb } from "@/utils/dev/devSeedService";

export default function DevSeedPage() {
  // Garantía estricta: Bloquear completamente en producción
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "Herramienta de desarrollo activa (NODE_ENV = development).",
    "Presione un botón para poblar o limpiar datos de prueba.",
  ]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ${msg}`, ...prev]);
  };

  const handleSeed = async () => {
    setLoading(true);
    addLog("Iniciando inyección de datos de prueba...");
    const res = await seedDevDataWeb();
    addLog(res.success ? `✔ ${res.message}` : `❌ Error: ${res.message}`);
    setLoading(false);
  };

  const handleClear = async () => {
    setLoading(true);
    addLog("Iniciando limpieza de datos de prueba...");
    const res = await clearDevDataWeb();
    addLog(res.success ? `✔ ${res.message}` : `❌ Error: ${res.message}`);
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 760,
        margin: "40px auto",
        padding: 24,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          background: "#181B22",
          border: "1px solid #2E384D",
          borderRadius: 12,
          padding: 24,
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
              color: "#07E580",
            }}
          >
            🛠️ Panel de Datos de Prueba (Dev Seed)
          </h1>
          <span
            style={{
              fontSize: 12,
              background: "#143823",
              color: "#07E580",
              padding: "4px 10px",
              borderRadius: 20,
              fontWeight: 600,
            }}
          >
            DEVELOPMENT ONLY
          </span>
        </div>

        <p
          style={{
            color: "#94A3B8",
            fontSize: 14,
            lineHeight: 1.5,
            marginBottom: 24,
          }}
        >
          Esta herramienta inyecta negocios (talleres, lubricentros,
          eléctricos), ofertas activas, configuración de precios/QR y campañas
          en Cochabamba marcados con <code>isDevMock: true</code>. Está{" "}
          <strong>100% deshabilitada</strong> en entornos de producción.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <button
            onClick={handleSeed}
            disabled={loading}
            style={{
              background: "#07E580",
              color: "#0A1F21",
              border: "none",
              borderRadius: 8,
              padding: "10px 18px",
              fontWeight: 700,
              fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            🌱 Cargar Datos de Prueba
          </button>

          <button
            onClick={handleClear}
            disabled={loading}
            style={{
              background: "#EF4444",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 18px",
              fontWeight: 700,
              fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            🗑️ Limpiar Datos de Prueba
          </button>
        </div>

        <div style={{ marginTop: 24 }}>
          <h3
            style={{
              fontSize: 14,
              color: "#94A3B8",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            Consola de Ejecución
          </h3>
          <div
            style={{
              background: "#0F1217",
              border: "1px solid #202530",
              borderRadius: 8,
              padding: 14,
              minHeight: 160,
              maxHeight: 240,
              overflowY: "auto",
              fontSize: 13,
              fontFamily: "monospace",
              color: "#E2E8F0",
            }}
          >
            {logs.map((log, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 4,
                  color: log.includes("✔")
                    ? "#07E580"
                    : log.includes("❌")
                      ? "#EF4444"
                      : "#CBD5E1",
                }}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
