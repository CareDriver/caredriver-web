# CareDriver Web — Hallazgos de Arquitectura

> Fecha: 2026-08-07  
> Repo: `caredriver-web`

## Stack Confirmado

| Capa         | Tecnología           | Versión              |
| ------------ | -------------------- | -------------------- |
| Framework    | Next.js              | 14.2.35 (App Router) |
| UI Library   | MUI (Material-UI)    | 5.15.14              |
| Styling      | CSS modules + MUI sx | —                    |
| Auth         | Firebase Auth        | 10.9.0               |
| State        | React Context        | —                    |
| Toast        | react-toastify       | 10.0.5               |
| Build output | Static (`out/`)      | Cloudflare Pages     |

## Estructura de Rutas Actual

```
/app/admin/*          → Panel Admin (enterprise, users, services, settings, providers, profile, userserver)
/app/user/*           → Panel Negocio/Usuario (enterprise/{crane,driverenterprise,laundry,mechanicalworkshop}, profile, userserver)
/app/auth/*           → Auth (signin, signup)
/app/service/*        → Servicios activos
/app/redirector       → Redirección post-auth
```

**Observación:** el enrutamiento ya está separado en dos áreas. La protección actual usa `GuardOfPage` con `UserRole` enum de Firestore (Admin, Support, SupportTwo, BalanceRecharge, User).

## Sistema de Auth

- `AuthContext` (`src/context/AuthContext.tsx`) — Contexto global con:
  - `user: UserInterface` — datos del doc Firestore `users/{uid}`
  - `userProps` — flags de onboarding (hasPhoto, hasLocation, hasPhone)
  - `checkingUserAuth` — loading state
  - `logout()`
  - **`isAdminClaim: boolean`** — NEW: leído del JWT custom claim `admin: true`

- **Custom claim `admin: true`:**
  - Ahora se lee vía `getIdTokenResult(authUser, true)` y se expone en `AuthContext.isAdminClaim`.
  - Esto es el mecanismo canonico para proteger el panel admin, separado del campo `role` de Firestore.
  - Guard dedicado: `AdminClaimGuard` (`src/components/guards/AdminClaimGuard.tsx`).

## Guards Existentes

- `GuardOfPage` (`src/components/guards/views/page_guards/base/GuardOfPage.tsx`) — protección por `UserRole` enum.
- `AdminClaimGuard` (nuevo) — protección por custom claim `admin: true`.
- Guards concretos: `GuardForServices`, `GuardForReadOnlyUserInfo`, `GuardForServerUsers`, `GuardOfEnterprises`, `GuardOfRequests`.

## Sidebar

- `Sidebar.tsx` (`src/components/navigation/sidebar/Sidebar.tsx`) — renderiza sidebars según `pathname` + `user.role`:
  - `AdminSideBar`
  - `SupportSideBar`
  - `SupportTwoSideBar`
  - `BalanceChargeSideBar`
  - `ServerUserSideBar`

## Tema / Tokens de Marca

- **Creado:** `src/theme/CareDriverTheme.ts` — tema MUI centralizado.
- Colores:
  - Esmeralda `#043C40` → `palette.primary.main`
  - Verde `#07E580` → `palette.secondary.main`
  - Menta `#B4FCC7` → `palette.primary.light`, `Chip` background
- Integrado en `src/layouts/Layout.tsx` vía `<ThemeProvider>` + `<CssBaseline>`.
- Antes los colores `#043C40` solo existían hardcodeados en SVGs; ahora hay un token central.

## Backend Connection

- Firebase config: `src/firebase/FirebaseConfig.ts`
- Cloud Functions callable: se consumen desde componentes con `fetch` o `httpsCallable` (aún no unificado).
- Para el directorio nuevo, las functions están en `caredriver-firebase/functions/src/directory/`:
  - `triageProblem`, `identifyDashboardLight`, `assessBodyDamage`
  - `findBusinesses`, `browseBusinesses`
  - `registerContact`, `markBusinessResponse`, `reportUserClosed`
  - `requestRating`, `submitRating`
  - `toggleFavorite`
  - `submitPaymentReceipt`, `reviewPaymentReceipt`, `markReceiptInvoiced`
  - `checkVehicleReminders`, `aggregateSearchTrends`
  - Admin panel (Prompt 02): `verifyBusiness`, `changeBusinessPlan`, `suspendBusiness`, `setUserAdminClaim`, `saveDiscountCampaign`, `saveSeasonalCampaign`.
  - Registration (Prompt 03): `submitDirectoryEnterpriseRequest`, `getPublicPricing`.

## Patrones a Seguir

1. **No cambiar de framework** — Next.js 14 App Router, MUI v5.
2. **Reusar guards** — `GuardOfPage` para roles Firestore, `AdminClaimGuard` para custom claim.
3. **Consumir las mismas functions que la app móvil** — paridad total.
4. **Campos protegidos son read-only** — `plan`, `verified`, `ratingAvg`, `avgResponseMinutes`, etc. solo backend.
5. **Nunca exponer datos personales del usuario al negocio** — el panel de negocio solo ve resumen anónimo.

## Pendiente (prompts 01 y 02)

- **Prompt 01 (Panel de negocio):**
  - Dashboard con métricas (leads, calificaciones, favoritos)
  - Gestión de ficha (fotos, horarios, sub-servicios)
  - Gestión de ofertas/promos
  - Subida de comprobantes de pago
  - Solicitud de calificaciones a usuarios

- **Prompt 02 (Panel admin):**
  - Aprobación/rechazo de comprobantes de pago con checklist de facturación.
  - Gestión de negocios (verificar, suspender, cambiar plan) a través de Cloud Functions con auditoría.
  - Cola de solicitudes de registro de negocios nuevos.
  - Vista de suscripciones/mora con filtros por días vencidos.
  - Precios, método de pago (QR + instrucciones) y campañas de descuento.
  - Referidos (negocio→negocio y usuario→negocio con pagos manuales).
  - Campañas estacionales.
  - Gestión de usuarios y admins (custom claim).

---

## Directorio (Prompt Maestro — 2026-08-28)

> Hallazgos y patrón a seguir para las nuevas áreas de directorio.

### Enrutamiento separado por rol

Se crearon dos áreas independientes del App Router, sin tocar el marketplace legado (`/app/admin/*`, `/app/user/*`):

| Área              | Ruta                    | Guard                                          | Descripción                                           |
| ----------------- | ----------------------- | ---------------------------------------------- | ----------------------------------------------------- |
| Panel del negocio | `/directory/business/*` | `BusinessPanelGuard` + `BusinessPanelProvider` | Usuarios autenticados con empresa asociada.           |
| Panel admin       | `/directory/admin/*`    | `AdminClaimGuard`                              | Solo usuarios con custom claim `admin: true` del JWT. |

Archivos clave:

- `src/app/directory/business/layout.tsx`
- `src/app/directory/business/page.tsx`
- `src/app/directory/admin/layout.tsx`
- `src/app/directory/admin/page.tsx`
- `src/components/guards/BusinessPanelGuard.tsx`

### Sincronización de modelos de datos con `caredriver-firebase`

Se leyó `caredriver-firebase/DATA_MODEL.md` y el código fuente real de `functions/src/directory/*` para evitar inventar estructuras. Cambios aplicados:

- `src/interfaces/Enterprise.ts`
  - Se agregó `DirectorySubService` (`id`, `categoryId`, `label`, `active`).
  - `Enterprise.subServices` y `EnterpriseRequest.subServices` ahora usan `DirectorySubService[]` en lugar de `MechanicSubService[]`.
  - Se agregó `contactCount?: number` (leads recibidos por directorio).
- `src/interfaces/Directory.ts` (nuevo)
  - `Subscription`, `PaymentReceipt`, `PlatformPricingSettings`, `PlatformPaymentSettings`, `DiscountCampaign`.
  - `Lead`, `SearchEvent`, `TrendSummary`.
  - `Offer`, `SeasonalCampaign`, `RatingRequest`, `EnterpriseReview`, `UserFavorite`.
- `src/interfaces/Referrals.ts` (nuevo)
  - `Referral`, `UserReferralEarnings`, `ReferralEarningsLedger`.

### Tema / tokens de marca

- Fuente de verdad: `src/theme/CareDriverTheme.ts`.
- Colores obligatorios de CareDriver:
  - Esmeralda `#043C40` → `palette.primary.main`
  - Verde `#07E580` → `palette.secondary.main`
  - Menta `#B4FCC7` → `palette.primary.light`
- Ya está integrado en `src/layouts/Layout.tsx` vía `<ThemeProvider>` + `<CssBaseline>`.

### Prompt 01 — Panel del negocio web

Implementado en `src/components/directory/business-panel/` y `src/app/directory/business/*`:

- **Layout de escritorio** con sidebar fija, selector de sucursal y banner de estado.
- **Dashboard**: KPIs, contactos recientes, tendencias (bloqueadas para no `featured`).
- **Contactos**: tabla con filtros, cambio de estado (`markBusinessResponse` + Firestore), solicitud de calificación (`requestRating`) con respeto al plan.
- **Reportes**: métricas históricas, gráficos simples y exportación CSV.
- **Ofertas**: CRUD con límites por plan y duración máxima de 14 días.
- **Ficha**: logo, carrusel, mapa (Google Maps), rubros, tags, horarios y editor de `DirectorySubService` por rubro.
- **Equipo y sucursales**: listado de miembros/roles, branches (`chainId`) y CTA para agregar sucursal.
- **Suscripción**: precio actual (`getCurrentPrice`), QR, instrucciones, subida de comprobante (`submitPaymentReceipt` + ntfy silencioso), historial y referidos (`applyReferralCode`).
- **Control de acceso por rol**: owner/admin, marketing, operador. Los campos protegidos (`plan`, `licenseStatus`, `daysOverdue`, etc.) se leen pero nunca se escriben desde el cliente.

### Prompt 02 — Panel admin de CareDriver

Implementado en `src/components/directory/admin-panel/` y `src/app/directory/admin/*`:

- **Protección**: `AdminClaimGuard` (`admin: true` en JWT).
- **Dashboard**: métricas de plataforma, negocios por plan, deuda de referidos y colas de trabajo.
- **Gestión de negocios**: tabla con verificar/des-verificar, cambio de plan y suspensión manual. Todas las escrituras a campos protegidos pasan por Cloud Functions (`verifyBusiness`, `changeBusinessPlan`, `suspendBusiness`) y se registran en `adminAuditLogs`.
- **Solicitudes de registro**: cola de `EnterpriseRequest` con aprobación/rechazo (`approveDirectoryEnterpriseRequest`), indicador de sucursales (`chainId`) y badge en sidebar.
- **Comprobantes de pago**: cola `paymentReceipts` pending, vista inline del comprobante, aprobar/rechazar (`reviewPaymentReceipt`) y checklist de facturación (`markReceiptInvoiced`). El panel no envía ntfy; solo recibe suscripción al topic `CareDriver_Comprobantes_Admin`.
- **Suscripciones / mora**: tabla filtrable por `licenseStatus` y `daysOverdue`, columna de descuento activo (`discountCyclesRemaining`) y acción de suspender/reactivar.
- **Precios y descuentos**: edición de precios base (`updatePricingSettings`), QR/instrucciones de pago (`platformSettings/payment`), CRUD de campañas de descuento (`saveDiscountCampaign`) con conteo de negocios asignados.
- **Referidos**: tabla negocio→negocio (solo lectura) y tabla usuario→negocio con pago manual (`payUserReferralEarnings`) y auditoría del ledger.
- **Campañas estacionales**: CRUD (`saveSeasonalCampaign`) con rubros, fechas y activación.
- **Usuarios**: búsqueda y gestión del claim `admin` (`setUserAdminClaim`).

### Prompt 03 — Registro de negocio nuevo

Implementado en `src/app/directory/register/page.tsx` y `src/components/directory/registration/`:

- **Layout de escritorio**: formulario a la izquierda, vista previa en vivo a la derecha.
- **Secciones**: datos básicos, rubros/sub-servicios (chips seleccionables y agregables), tags, ciudad + mapa interactivo (OpenStreetMap con marcador), fotos (logo + carrusel hasta 6 imágenes), horarios por día.
- **Selector de plan**: precios dinámicos desde `getPublicPricing`, precio tachado + precio con descuento + etiqueta de campaña, o tag simple según `platformSettings/pricing`.
- **Código de referido**: campo opcional con texto genérico.
- **Envío**: `submitDirectoryEnterpriseRequest` + POST a `ntfy.sh/CareDriver_Registros_Admin` después del éxito (silencioso si falla).
- **Sucursales**: desde `TeamView` el botón "Agregar sucursal" abre el mismo formulario con `chainId` pre-cargado por query param.

### Patrón a seguir para prompts 01 y 02

1. **No crear nuevas colecciones ni campos** sin actualizar primero `caredriver-firebase` y luego estos interfaces.
2. **Reusar los guards existentes**:
   - Admin: `AdminClaimGuard` (claim `admin: true`).
   - Negocio: `BusinessPanelGuard` + `BusinessPanelProvider` (autenticación + descubrimiento de empresa).
3. **Campos protegidos siguen siendo read-only**: `plan`, `verifiedAt`, `rating`, `ratingCount`, `favoriteCount`, `avgResponseMinutes`, `licenseStatus`, `daysOverdue`, `contactCount`.
4. **Nunca exponer datos personales del usuario al negocio**: el panel de negocio solo ve resúmenes anónimos (`vehicleSummary`, no nombres/teléfonos).
5. **Consumir las mismas Cloud Functions que la app móvil**:
   - Suscripciones/pagos: `submitPaymentReceipt`, `reviewPaymentReceipt`, `getCurrentPrice`, `updatePricingSettings`.
   - Ofertas: `createOffer`, `updateOffer`.
   - Leads: `registerContact`, `markBusinessResponse`, `reportUserClosed`, `getContactHistory`.
   - Calificaciones: `requestRating`, `submitRating`.
   - Directorio: `findBusinesses`, `browseBusinesses`, `toggleFavorite`.
   - Admin: `assignDiscountCampaign`, `payUserReferralEarnings`, `approveDirectoryEnterpriseRequest`.
6. **Usar los tokens del tema** en lugar de colores hardcodeados.
