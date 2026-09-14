export interface WhatsAppMessagePayload {
  type: "service_receipt" | "preventive_reminder";
  phone: string; // E.164 or local
  customerName: string;
  plate: string;
  workshopName: string;
  currentKm: number;
  nextKm: number;
  totalBs?: number;
}

/**
 * Normalizes phone number to Bolivia international format (+591)
 */
export function sanitizeBoliviaPhone(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.startsWith("591")) return digits;
  if (digits.length === 8) return `591${digits}`;
  return digits;
}

/**
 * Generates a wa.me deep link with pre-filled encoded text
 */
export function generateWhatsAppMessage(
  payload: WhatsAppMessagePayload,
): string {
  const cleanPhone = sanitizeBoliviaPhone(payload.phone);

  let text = "";

  if (payload.type === "service_receipt") {
    text =
      `👋 Hola *${payload.customerName}*!\n\n` +
      `Te saludamos de *${payload.workshopName}*. Tu vehículo con placa *${payload.plate}* ha sido atendido exitosamente.\n\n` +
      `📋 *Detalle del Servicio:*\n` +
      `• Kilometraje actual: ${payload.currentKm.toLocaleString()} km\n` +
      (payload.totalBs ? `• Total abonado: Bs. ${payload.totalBs}\n` : "") +
      `• *Próximo servicio recomendado:* ${payload.nextKm.toLocaleString()} km\n\n` +
      `📲 Lleva la hoja de vida digital de tu auto gratis en la app de *CareDriver*:\n` +
      `https://caredriver.app/descargar?placa=${payload.plate}`;
  } else if (payload.type === "preventive_reminder") {
    text =
      `🚗 Hola *${payload.customerName}*!\n\n` +
      `Recordatorio preventivo de *${payload.workshopName}*: Tu auto (*${payload.plate}*) está próximo a cumplir los *${payload.nextKm.toLocaleString()} km* para su mantenimiento preventivo.\n\n` +
      `¿Deseas que te reservemos un espacio esta semana? Responde a este mensaje para coordinar tu horario. ¡Cuidamos tu motor! 🔧`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function openWhatsAppUrl(url: string) {
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
