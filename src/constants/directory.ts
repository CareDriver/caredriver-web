/**
 * Directory business panel constants.
 *
 * Mirrors the constants used in the mobile app business panel so the web panel
 * has the same closed lists, labels and plan definitions.
 */

export type DirectoryServiceType =
  | "workshop"
  | "tire_shop"
  | "body_shop"
  | "lubricant_shop"
  | "electrical_shop"
  | "auto_parts_store";

export type PlanTier = "free" | "verified" | "featured";

export const PLAN_LABELS: Record<PlanTier, string> = {
  free: "Ficha",
  verified: "Verificado",
  featured: "Destacado",
};

export const PLAN_FEATURES: Record<PlanTier, string[]> = {
  free: [
    "Ficha visible en el catálogo",
    "Hasta 3 fotos del local",
    "Rubros y sub-servicios",
  ],
  verified: [
    "Todo lo de Ficha",
    "Sello verificado",
    "Recibí contactos del asistente",
    "1 oferta activa",
    "3 usuarios del equipo",
  ],
  featured: [
    "Todo lo de Verificado",
    "Sello destacado",
    "Radio ampliado (6 km)",
    "3 ofertas activas",
    "5 usuarios del equipo",
    "Tendencias completas",
  ],
};

export type MemberRole = "admin" | "collaborator" | "marketing";

export const ROLE_LABELS: Record<MemberRole, string> = {
  admin: "Dueño",
  collaborator: "Operador",
  marketing: "Marketing",
};

export type CategoryId = (typeof CATEGORIES)[number];

export const CATEGORIES = [
  "frenos",
  "motor",
  "bateria",
  "llantas",
  "alineacion",
  "lubricentro",
  "lavado",
  "electrico",
  "aire_acondicionado",
  "radiador",
  "vidrios",
  "chapa_pintura",
  "tapiceria",
  "repuestos",
  "gnv",
  "escuela_manejo",
  "inspeccion",
  "car_audio",
  "moto",
  "grua",
  "auxilio",
  "seguros",
  "concesionaria",
  "otro",
] as const;

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  frenos: "Frenos",
  motor: "Motor",
  bateria: "Batería",
  llantas: "Llantas",
  alineacion: "Alineación",
  lubricentro: "Lubricentro",
  lavado: "Lavado",
  electrico: "Eléctrico",
  aire_acondicionado: "Aire acondicionado",
  radiador: "Radiador",
  vidrios: "Vidrios",
  chapa_pintura: "Chapa y pintura",
  tapiceria: "Tapicería",
  repuestos: "Repuestos",
  gnv: "GNV",
  escuela_manejo: "Escuela de manejo",
  inspeccion: "Inspección",
  car_audio: "Car audio",
  moto: "Moto",
  grua: "Grúa",
  auxilio: "Auxilio",
  seguros: "Seguros",
  concesionaria: "Concesionaria",
  otro: "Otro",
};

export type TagId = (typeof TAGS)[number];

export const TAGS = [
  "24_horas",
  "acepta_tarjeta",
  "servicio_a_domicilio",
  "atiende_domingos",
  "garantia_por_escrito",
  "zona_de_espera",
  "wifi_gratis",
  "acepta_transferencia",
] as const;

export const TAG_LABELS: Record<TagId, string> = {
  "24_horas": "24 horas",
  acepta_tarjeta: "Acepta tarjeta",
  servicio_a_domicilio: "Servicio a domicilio",
  atiende_domingos: "Atiende domingos",
  garantia_por_escrito: "Garantía por escrito",
  zona_de_espera: "Zona de espera",
  wifi_gratis: "WiFi gratis",
  acepta_transferencia: "Acepta transferencia",
};

export type DayKey = (typeof DAY_KEYS)[number];

export const DAY_KEYS = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;

export const DAY_LABELS: Record<DayKey, string> = {
  mon: "Lunes",
  tue: "Martes",
  wed: "Miércoles",
  thu: "Jueves",
  fri: "Viernes",
  sat: "Sábado",
  sun: "Domingo",
};

export const DEFAULT_HOURS: Record<
  DayKey,
  { open: string; close: string; closed: boolean }
> = {
  mon: { open: "08:00", close: "18:00", closed: false },
  tue: { open: "08:00", close: "18:00", closed: false },
  wed: { open: "08:00", close: "18:00", closed: false },
  thu: { open: "08:00", close: "18:00", closed: false },
  fri: { open: "08:00", close: "18:00", closed: false },
  sat: { open: "08:00", close: "13:00", closed: false },
  sun: { open: "08:00", close: "18:00", closed: true },
};

export const OFFER_LIMITS: Record<PlanTier, number> = {
  free: 0,
  verified: 1,
  featured: 3,
};

export const TEAM_MEMBER_LIMITS: Record<PlanTier, number> = {
  free: 1,
  verified: 3,
  featured: 5,
};

export const MAX_OFFER_DURATION_DAYS = 14;

export const RATING_REQUEST_LIMITS: Record<PlanTier, number | null> = {
  free: 0,
  verified: 10,
  featured: null, // unlimited
};

export const REFERRAL_BONUS_DAYS = 15;

export type LeadBusinessStatus =
  | "contacted"
  | "quoted"
  | "closed"
  | "not_closed";

export const LEAD_STATUS_LABELS: Record<LeadBusinessStatus, string> = {
  contacted: "Contacté",
  quoted: "Coticé",
  closed: "Cerré",
  not_closed: "No cerré",
};

export const LEAD_STATUS_COLORS: Record<LeadBusinessStatus, string> = {
  contacted: "#f5a623",
  quoted: "#2196F3",
  closed: "#07e580",
  not_closed: "#E7546B",
};

export const LICENSE_STATUS_LABELS: Record<string, string> = {
  active: "Activo",
  past_due: "Mora",
  suspended: "Suspendido",
  none: "Sin suscripción",
};

export const BOLIVIAN_CITIES = [
  "La Paz",
  "El Alto",
  "Santa Cruz de la Sierra",
  "Cochabamba",
  "Sucre",
  "Oruro",
  "Potosí",
  "Tarija",
  "Trinidad",
  "Cobija",
];

export const CATEGORY_SUB_SERVICES: Partial<Record<CategoryId, string[]>> = {
  frenos: [
    "Cambio de pastillas",
    "Rectificación de discos",
    "Líquido de frenos",
  ],
  motor: ["Cambio de aceite", "Filtros", "Afinación", "Diagnóstico"],
  bateria: ["Venta de baterías", "Carga", "Prueba de vida útil"],
  llantas: ["Venta de llantas", "Parchado", "Balanceo", "Alineación"],
  alineacion: ["Alineación 3D", "Balanceo", "Camber"],
  lubricentro: ["Cambio de aceite", "Lubricación", "Fluídos"],
  lavado: ["Lavado exterior", "Lavado de motor", "Encerado"],
  electrico: ["Batería", "Alternador", "Luces", "Arranque"],
  aire_acondicionado: ["Recarga de gas", "Reparación", "Limpieza"],
  radiador: ["Limpieza", "Reparación", "Cambio de agua"],
  vidrios: ["Polarizado", "Reparación de chip", "Cambio de parabrisas"],
  chapa_pintura: ["Chapa", "Pintura", "Desabollado"],
  tapiceria: ["Limpieza de tapicería", "Restauración"],
  repuestos: ["Repuestos originales", "Repuestos genéricos"],
  moto: ["Service", "Llantas", "Batería"],
  grua: ["Auxilio mecánico", "Traslado"],
  auxilio: ["Cambio de neumático", "Pasacorriente", "Cerrajería"],
  seguros: ["Soat", "Seguro vehicular", "Trámites"],
  otro: ["Otro"],
};
