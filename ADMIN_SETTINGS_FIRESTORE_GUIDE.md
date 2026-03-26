# Admin Settings Firestore Guide

## Objetivo

Este documento explica cómo leer y escribir la configuración administrativa de precios/comisiones y disponibilidad de servicios por ubicación, incluyendo fórmulas por distancia y rangos por subservicio mecánico.

## Colección y documentos

Todos los documentos están en la colección:

- `admin-settings`

Documentos vigentes (estructura v2 por ubicación):

- `provider-pricing-v2-by-location`
- `availableServicesToGetRequests-v2-by-location`

> Estos IDs nuevos separan el esquema v2 del esquema anterior.

---

## 1) Documento de precios/comisiones

### ID

- `provider-pricing-v2-by-location`

### Tipo

- `AdminPricingSettings` (ver `src/interfaces/AdminSettings.ts`)

### Estructura

```ts
{
  id: string,
  updatedAtIso: string,
  updatedByUserId?: string,
  serviceConfigsByLocation: {
    [location in Locations]: ServicePricingConfig[]
  },
  temporalRules: TemporalPricingRule[]
}
```

### ServicePricingConfig

```ts
{
  serviceType: ServicesApp, // ServicesApp.Driver="Conductor" | ServicesApp.Mechanic="Mecánico" | ServicesApp.Tow="Remolque" | ServicesApp.CarWash="Lavadero"
  pricingMode: "recommended" | "range" | "fixed",
  defaultRecommendedPrice?: number,
  recommendedPriceFormula?: string, // ej: "46 + 5 * z - 0.0402 * z**2 + 0.000681 * z**3"
  formulaVariable?: "z", // z en km
  defaultRange?: { min: number, max: number },
  defaultCommissionPercent?: number,
  defaultFixedCommissionBs?: number,
  mechanicSubServiceRanges?: {
    [mechanicSubService in MechanicSubService]?: {
      recommendedPrice?: number,
      range: { min: number, max: number }
    }
  },
  byLocation?: {
    [location in Locations]?: {
      recommendedPrice?: number,
      recommendedPriceFormula?: string,
      range?: { min: number, max: number },
      commissionPercent?: number,
      fixedCommissionBs?: number,
      mechanicSubServiceRanges?: {
        [mechanicSubService in MechanicSubService]?: {
          recommendedPrice?: number,
          range: { min: number, max: number }
        }
      }
    }
  }
}
```

### TemporalPricingRule

```ts
{
  id: string,
  serviceType: ServicesApp, // ServicesApp.Driver="Conductor" | ServicesApp.Mechanic="Mecánico" | ServicesApp.Tow="Remolque" | ServicesApp.CarWash="Lavadero"
  startAtIso: string,
  endAtIso: string,
  location?: Locations,
  userCreatedBeforeIso?: string,
  pricingMode: "recommended" | "range" | "fixed",
  recommendedPrice?: number,
  range?: { min: number, max: number },
  commissionPercent?: number,
  fixedCommissionBs?: number,
  active: boolean,
  note?: string
}
```

### Configuración base actual (v2)

- Comisiones:
  - Conductor: 13%
  - Mecánico: 15%
  - Remolque: 15%
  - Lavadero: 12%
- Fórmula recomendada por distancia (Conductor y Remolque):
  - `46 + 5 * z - 0.0402 * z**2 + 0.000681 * z**3`
  - donde `z` = distancia en km.
- Mecánico:
  - usa rangos por subservicio (`mechanicSubServiceRanges`), con precio recomendado opcional por cada subservicio.
  - si no se conoce el caso exacto, se puede operar con rango de precio.

---

## 2) Documento de servicios disponibles por ubicación

### ID

- `availableServicesToGetRequests-v2-by-location`

### Tipo

- `AvailableServicesToGetRequests` (ver `src/interfaces/AdminSettings.ts`)

### Estructura

```ts
{
  id: string,
  updatedAtIso: string,
  updatedByUserId?: string,
  byLocation: {
    [location in Locations]: {
      activeServices: Services[],
      upcomingServices: Services[],
      mechanicSubServices: {
        active: MechanicSubService[],
        upcoming: MechanicSubService[]
      }
    }
  }
}
```

### Estado inicial configurado

- Cochabamba: activo solo `Conductor`; resto de servicios en `upcoming`.
- Santa Cruz, La Paz y El Alto: todos los servicios en `upcoming`.
- Resto de departamentos: vacío.
- Subservicios mecánicos:
  - Cochabamba / Santa Cruz / La Paz / El Alto: en `upcoming`.
  - Resto: vacío.

---

## Cómo obtener desde Firestore (web o móvil)

## Lectura del documento de precios

```ts
const docRef = doc(
  firestore,
  "admin-settings",
  "provider-pricing-v2-by-location",
);
const snap = await getDoc(docRef);
if (snap.exists()) {
  const data = snap.data();
}
```

## Lectura del documento de disponibilidad

```ts
const docRef = doc(
  firestore,
  "admin-settings",
  "availableServicesToGetRequests-v2-by-location",
);
const snap = await getDoc(docRef);
if (snap.exists()) {
  const data = snap.data();
}
```

## Recomendación para app móvil

1. Leer ambos documentos al iniciar sesión o en splash.
2. Guardar en caché local (memoria + persistencia local).
3. Filtrar UI por `location` del usuario:
   - Mostrar solicitudes solo si el servicio está en `activeServices`.
   - Mostrar etiqueta “Próximamente” si está en `upcomingServices`.
4. Para mecánico:
   - Mostrar solo subservicios de `mechanicSubServices.active`.
   - Si está en `upcoming`, mostrar como bloqueado/próximamente.
5. Revalidar periódicamente (o usar listener en tiempo real si aplica).
6. Para recomendación de precio por distancia (Conductor/Remolque):
   - Evaluar la fórmula con `z = distanciaKm`.
   - Validar que el resultado sea numérico y no negativo antes de mostrar.
7. Para Mecánico:
   - Si hay subservicio seleccionado, usar su `mechanicSubServiceRanges`.
   - Si no hay diagnóstico exacto, mostrar/usar el rango del subservicio o rango general.

---

## Precio y rango en servicios (modelo runtime)

En `ServiceRequestInterface` ahora existen ambos campos opcionales:

```ts
price?: {
  currency: "Bs";
  price: number;
  method: "cash" | "qr";
  amount: number;
};

priceRange?: {
  currency: "Bs";
  min: number;
  max: number;
};
```

### Uso recomendado

- Conductor / Remolque / Lavadero: normalmente `price`.
- Mecánico: normalmente `priceRange` (o `price` cuando ya está cerrado el monto).

---

## Reglas Firestore recomendadas (resumen)

- Lectura: usuarios autenticados.
- Escritura: solo Admin/Support.
- Limitar escritura solo a los dos doc IDs v2.

Ejemplo (adaptar a tu archivo de reglas):

```rules
match /admin-settings/{docId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null
               && hasAdminOrSupportRole(request.auth.uid)
               && (docId == "provider-pricing-v2-by-location"
                   || docId == "availableServicesToGetRequests-v2-by-location");
}
```

---

## Referencias internas

- `src/interfaces/AdminSettings.ts`
- `src/components/app_modules/admin_settings/api/AdminPricingSettingsRequester.ts`
- `src/components/app_modules/admin_settings/views/AdminPricingSettingsPanel.tsx`
- `src/interfaces/UserRequest.ts` (subservicios mecánico)
