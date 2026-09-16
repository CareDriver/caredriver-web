import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { auth, firestore } from "@/firebase/FirebaseConfig";

export interface WebSeedResult {
  success: boolean;
  message: string;
  businessesCreated?: number;
  offersCreated?: number;
}

/**
 * Inserta datos de prueba en Firestore para desarrollo en caredriver-web.
 * EXCLUSIVO de desarrollo: Bloqueado en producción.
 */
export async function seedDevDataWeb(): Promise<WebSeedResult> {
  if (process.env.NODE_ENV !== "development") {
    const msg =
      "[DevSeed] Operación bloqueada: Solo permitida en ambiente de desarrollo (NODE_ENV !== 'production').";
    console.warn(msg);
    return { success: false, message: msg };
  }

  try {
    const currentUid = auth.currentUser?.uid || "dev_web_test_user";
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // 1. Negocios de prueba en Cochabamba
    const mockBusinesses = [
      {
        id: "dev_taller_central_cbba",
        name: "Taller Mecánico Central Cbba",
        nameArrayLower: ["taller", "mecanico", "central", "cbba"],
        type: "mechanicalWorkShop",
        city: "cochabamba",
        zoneLabel: "Cala Cala / Zona Norte",
        directoryCategories: ["motor", "frenos", "inspeccion"],
        subServices: [
          { id: "cambio_pastillas", name: "Cambio de Pastillas de Freno" },
          { id: "afinacion_motor", name: "Afinación y Escaneo Electrónico" },
        ],
        plan: "featured",
        active: true,
        aproved: true,
        deleted: false,
        userId: currentUid,
        rating: 4.9,
        ratingCount: 28,
        favoriteCount: 7,
        avgResponseMinutes: 8,
        latitude: -17.385,
        longitude: -66.155,
        coordinates: { latitude: -17.385, longitude: -66.155 },
        phone: "70712345",
        phoneCountryCode: "+591",
        whatsapp: "59170712345",
        description:
          "Especialistas en mecánica preventiva, frenos ABS y diagnóstico computarizado multimarca.",
        isNew: false,
        isDevMock: true,
        hours: {
          mon: { open: "08:00", close: "19:00", closed: false },
          tue: { open: "08:00", close: "19:00", closed: false },
          wed: { open: "08:00", close: "19:00", closed: false },
          thu: { open: "08:00", close: "19:00", closed: false },
          fri: { open: "08:00", close: "19:00", closed: false },
          sat: { open: "08:30", close: "14:00", closed: false },
          sun: { open: "00:00", close: "00:00", closed: true },
        },
      },
      {
        id: "dev_lubricentro_elsol",
        name: "Lubricentro & Filtros El Sol",
        nameArrayLower: ["lubricentro", "filtros", "el", "sol"],
        type: "mechanicalWorkShop",
        city: "cochabamba",
        zoneLabel: "Av. América Oeste",
        directoryCategories: ["lubricentro", "motor"],
        subServices: [
          { id: "cambio_aceite", name: "Cambio de Aceite de Motor y Caja" },
        ],
        plan: "verified",
        active: true,
        aproved: true,
        deleted: false,
        userId: currentUid,
        rating: 4.7,
        ratingCount: 19,
        favoriteCount: 4,
        avgResponseMinutes: 5,
        latitude: -17.391,
        longitude: -66.16,
        coordinates: { latitude: -17.391, longitude: -66.16 },
        phone: "71798765",
        phoneCountryCode: "+591",
        whatsapp: "59171798765",
        description:
          "Aceites 100% originales Castrol, Liqui Moly, Shell y filtros para todas las marcas.",
        isNew: false,
        isDevMock: true,
      },
      {
        id: "dev_electroauto_baterias",
        name: "ElectroAuto Bolivia & Baterías",
        nameArrayLower: ["electroauto", "bolivia", "baterias"],
        type: "mechanicalWorkShop",
        city: "cochabamba",
        zoneLabel: "La Cancha / Av. Aroma",
        directoryCategories: ["electrico", "bateria", "aire_acondicionado"],
        subServices: [
          { id: "cambio_bateria", name: "Venta e Instalación de Baterías" },
        ],
        plan: "featured",
        active: true,
        aproved: true,
        deleted: false,
        userId: currentUid,
        rating: 4.8,
        ratingCount: 34,
        favoriteCount: 11,
        avgResponseMinutes: 6,
        latitude: -17.398,
        longitude: -66.152,
        coordinates: { latitude: -17.398, longitude: -66.152 },
        phone: "72734567",
        phoneCountryCode: "+591",
        whatsapp: "59172734567",
        description:
          "Servicio de auxilio eléctrico, venta de baterías Bosch y mantenimiento de aire acondicionado.",
        isNew: false,
        isDevMock: true,
      },
    ];

    let bCount = 0;
    for (const b of mockBusinesses) {
      await setDoc(
        doc(firestore, "enterprises", b.id),
        { ...b, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
        { merge: true },
      );
      bCount++;
    }

    // 2. Miembros de prueba (para que el usuario logueado en caredriver-web acceda de inmediato al panel de negocio)
    if (auth.currentUser?.uid) {
      await setDoc(
        doc(
          firestore,
          "enterprises",
          "dev_taller_central_cbba",
          "members",
          auth.currentUser.uid,
        ),
        {
          userId: auth.currentUser.uid,
          role: "owner",
          active: true,
          isDevMock: true,
          createdAt: serverTimestamp(),
        },
        { merge: true },
      );
    }

    // 3. Ofertas de prueba
    const mockOffers = [
      {
        enterpriseId: "dev_taller_central_cbba",
        id: "dev_offer_escaneo",
        title: "Escaneo Computarizado Gratis",
        description:
          "Por cualquier reparación de frenos o motor, el escaneo es 100% bonificado.",
        discountValue: 0,
        active: true,
        startsAt: Timestamp.fromDate(now),
        endsAt: Timestamp.fromDate(in30Days),
        views: 14,
        redemptions: 3,
        isDevMock: true,
      },
      {
        enterpriseId: "dev_lubricentro_elsol",
        id: "dev_offer_aceite",
        title: "20% Descuento en Aceite Sintético",
        description:
          "Válido en marcas Castrol y Liqui Moly con mano de obra y filtro incluidos.",
        discountValue: 20,
        active: true,
        startsAt: Timestamp.fromDate(now),
        endsAt: Timestamp.fromDate(in30Days),
        views: 29,
        redemptions: 8,
        isDevMock: true,
      },
    ];

    let oCount = 0;
    for (const off of mockOffers) {
      const { enterpriseId, id, ...rest } = off;
      await setDoc(
        doc(firestore, "enterprises", enterpriseId, "offers", id),
        { ...rest, createdAt: serverTimestamp() },
        { merge: true },
      );
      oCount++;
    }

    // 4. Configuración de plataforma de prueba (Precios y Pagos)
    await setDoc(
      doc(firestore, "platformSettings", "pricing"),
      {
        verifiedBasePrice: 150,
        featuredBasePrice: 350,
        verifiedTag: "Recomendado",
        featuredTag: "Destacado VIP",
        isDevMock: true,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    await setDoc(
      doc(firestore, "platformSettings", "payment"),
      {
        qrCodeImageUrl:
          "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=CareDriverPagoDev",
        paymentInstructions:
          "Realizar transferencia QR a nombre de CareDriver Bolivia (Cuenta de Pruebas). Enviar comprobante para aprobación inmediata.",
        isDevMock: true,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    // 5. Campañas de prueba
    await setDoc(
      doc(firestore, "discountCampaigns", "dev_promo_bienvenida"),
      {
        name: "Promo Bienvenida Talleres",
        discountType: "percent",
        discountValue: 30,
        durationCycles: 3,
        appliesToPlans: ["verified", "featured"],
        active: true,
        isDevMock: true,
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );

    await setDoc(
      doc(firestore, "seasonalCampaigns", "dev_chequeo_invierno"),
      {
        name: "Chequeo de Invierno 2026",
        bannerText:
          "¡Prepará tu auto para el frío! Descuentos en baterías y frenos",
        categoryIds: ["bateria", "frenos", "motor"],
        active: true,
        startsAt: Timestamp.fromDate(now),
        endsAt: Timestamp.fromDate(in30Days),
        isDevMock: true,
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );

    return {
      success: true,
      message: `Datos de prueba inyectados (${bCount} talleres, ${oCount} ofertas, precios y campañas).`,
      businessesCreated: bCount,
      offersCreated: oCount,
    };
  } catch (error: any) {
    console.error("[DevSeed Web] Error poblando datos de prueba:", error);
    return { success: false, message: error?.message || "Error desconocido" };
  }
}

/**
 * Elimina exclusivamente los datos con flag `isDevMock: true`.
 * EXCLUSIVO de desarrollo.
 */
export async function clearDevDataWeb(): Promise<WebSeedResult> {
  if (process.env.NODE_ENV !== "development") {
    const msg =
      "[DevSeed] Operación bloqueada: Solo permitida en ambiente de desarrollo.";
    console.warn(msg);
    return { success: false, message: msg };
  }

  try {
    let deletedCount = 0;

    const entSnap = await getDocs(
      query(
        collection(firestore, "enterprises"),
        where("isDevMock", "==", true),
      ),
    );
    for (const d of entSnap.docs) {
      await deleteDoc(d.ref);
      deletedCount++;
    }

    const campSnap = await getDocs(
      query(
        collection(firestore, "discountCampaigns"),
        where("isDevMock", "==", true),
      ),
    );
    for (const d of campSnap.docs) {
      await deleteDoc(d.ref);
      deletedCount++;
    }

    const seasSnap = await getDocs(
      query(
        collection(firestore, "seasonalCampaigns"),
        where("isDevMock", "==", true),
      ),
    );
    for (const d of seasSnap.docs) {
      await deleteDoc(d.ref);
      deletedCount++;
    }

    return {
      success: true,
      message: `Se eliminaron ${deletedCount} registros de prueba de desarrollo.`,
    };
  } catch (error: any) {
    console.error("[DevSeed Web] Error limpiando datos:", error);
    return { success: false, message: error?.message || "Error desconocido" };
  }
}
