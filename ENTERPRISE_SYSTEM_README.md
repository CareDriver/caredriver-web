# Sistema de Registro de Empresas — CareDriver

## Resumen

Este documento describe el sistema de registro, gestión y aprobación de empresas dentro de CareDriver. Permite a los usuarios registrar empresas de cualquiera de los cuatro tipos de servicio (conductor, mecánico, remolque, lavadero), agregar administradores y colaboradores (con documentación personal), y pasar por un flujo de aprobación administrado por el equipo de CareDriver.

---

## Tipos de Servicio (`ServiceType`)

| Clave          | Nombre en español      | Segmento URL         |
| -------------- | ---------------------- | -------------------- |
| `"driver"`     | Empresa de Conductores | `driverenterprise`   |
| `"mechanical"` | Taller Mecánico        | `mechanicalworkshop` |
| `"tow"`        | Empresa de Remolque    | `crane`              |
| `"laundry"`    | Lavadero               | `laundry`            |

---

## Colecciones de Firestore

### `enterprises` (Colección existente)

Empresas **aprobadas** y activas. Cada documento tiene el ID de la empresa.

### `enterprise-requests` (Nueva colección)

Solicitudes de **registro** de nuevas empresas, pendientes de aprobación por un administrador de CareDriver. Una vez aprobada, se crea el documento en `enterprises` y se marca la solicitud como `active: false`.

### `edit-enterprises` (Colección existente)

Solicitudes de **edición** de empresas ya existentes.

---

## Modelo de Datos

### `EnterpriseRequest` (Solicitud de registro)

```typescript
{
  id: string;                          // ID único generado con nanoid(30)
  type: ServiceType;                   // "driver" | "mechanical" | "tow" | "laundry"
  name: string;                        // Nombre de la empresa
  nameArrayLower?: string[];           // Array de keywords para búsqueda
  logoImgUrl: RefAttachment;           // Logo de la empresa { ref, url }
  description?: string;                // Descripción libre (NIT, horarios, etc.)
  coordinates?: GeoPoint;              // Ubicación geográfica (latitud, longitud)
  latitude?: number;
  longitude?: number;
  location?: Locations;                // Enumeración de ciudades de Bolivia

  requestedByUserId: string;           // ID del usuario que registra (auto-admin)
  requestedByFakeId: string;           // fakeId del usuario que registra

  active: boolean;                     // true = pendiente, false = ya revisada
  aproved?: boolean;                   // true = aprobada, false = rechazada
  aprovedBy?: string;                  // ID del admin que revisó
  deleted: boolean;

  members: EnterpriseMember[];         // Array de todos los miembros
  adminUserIds: string[];              // fakeIds de los administradores
  collaboratorUserIds: string[];       // fakeIds de los colaboradores

  // Específicos de mecánica
  mechanicSubServices?: MechanicSubService[];
  mechanicTools?: string;              // Descripción de herramientas
  mechanicToolEvidences?: MechanicToolEvidence[];

  // Específicos de lavadero
  carWashServiceMode?: CarWashServiceMode;

  // Específicos de remolque
  towVehiclePhotos?: RefAttachment[];

  createdAt: Timestamp;
}
```

### `Enterprise` (Empresa aprobada)

Extiende `EnterpriseData` con los mismos campos más:

```typescript
{
  // ... todos los campos de EnterpriseData ...
  adminUserIds: string[];
  collaboratorUserIds: string[];
  members: EnterpriseMember[];

  // Rating
  rating?: number;
  ratingCount?: number;

  // Datos específicos por tipo (mismos que EnterpriseRequest)
  mechanicSubServices?: MechanicSubService[];
  mechanicTools?: string;
  mechanicToolEvidences?: MechanicToolEvidence[];
  carWashServiceMode?: CarWashServiceMode;
  towVehiclePhotos?: RefAttachment[];

  // Financiero
  currentDebt?: Price;
  paidDebtsHistory?: DebtHistory[];
  comissionsHistory?: ComissionHistory[];
  balanceHistory?: BalanceHistoryItem[];

  createdAt?: Timestamp;
  approvedAt?: Timestamp;
}
```

### `EnterpriseMember` (Miembro de empresa)

```typescript
{
  userId: string;                       // ID del usuario en CareDriver
  fakeUserId: string;                   // fakeId público del usuario
  role: "admin" | "collaborator";       // Rol dentro de la empresa
  isAlsoCollaborator?: boolean;         // Solo para admins que también trabajan en campo
  accepted: boolean;                    // ¿El usuario aceptó la membresía?

  requiresAdminReview: boolean;         // ¿Necesita revisión de admin CareDriver?
  adminReviewApproved?: boolean;        // undefined = pendiente, true/false = revisado
  reviewedBy?: string;

  // Datos personales
  fullName: string;
  profilePhoto: RefAttachment;
  identityCardFront?: RefAttachment;    // Carnet de identidad (frente)
  identityCardBack?: RefAttachment;     // Carnet de identidad (reverso)
  addressPhoto?: RefAttachment;         // Factura de luz (NO requerida para lavadero)
  homeAddress?: string;                 // Dirección (NO requerida para lavadero)

  // Licencia (para conductor, remolque, lavadero con recojo)
  license?: LicenseInterface;
  policeRecordsPdf?: RefAttachment;     // Antecedentes policiales (opcional)

  // Mecánico específico
  technicalTitle?: TechnicalTitleEvidence;

  // Experiencia
  experience?: string;

  // Remolque específico
  vehiclePhotos?: RefAttachment[];
}
```

---

## Modalidades de Lavadero (`CarWashServiceMode`)

| Valor                 | Etiqueta                            |
| --------------------- | ----------------------------------- |
| `"mobile_only"`       | Lavado móvil (vamos a tu ubicación) |
| `"pickup_and_return"` | Recojo y devolución del vehículo    |
| `"both"`              | Ambas modalidades                   |

---

## Roles de Miembros

### Administrador (`"admin"`)

- **Obligatorio**: Carnet de identidad (frente y reverso), factura de luz (excepto lavadero), dirección, selfie.
- Puede gestionar la empresa, agregar/quitar miembros.
- Opcionalmente puede ser también **colaborador** (`isAlsoCollaborator: true`), en cuyo caso necesita los mismos datos que un colaborador.

### Colaborador (`"collaborator"`)

- Es la persona que **va físicamente a prestar el servicio**.
- Debe **aceptar la membresía** desde su cuenta de CareDriver (hub de servicios).
- Datos requeridos varían por tipo de servicio (ver tabla abajo).

---

## Requisitos por Tipo de Servicio y Rol

| Tipo            | ¿Revisión de CareDriver? | ¿Licencia? | ¿Factura de luz? | ¿Fotos vehículo? | Extras                              |
| --------------- | :----------------------: | :--------: | :--------------: | :--------------: | ----------------------------------- |
| Conductor       |          ✅ Sí           |   ✅ Sí    |      ✅ Sí       |        ❌        |                                     |
| Mecánico        |          ❌ No           |   ❌ No    |      ✅ Sí       |        ❌        | Título técnico (opc.), herramientas |
| Remolque        |          ✅ Sí           |   ✅ Sí    |      ✅ Sí       |      ✅ Sí       |                                     |
| Lavadero móvil  |          ❌ No           |   ❌ No    |      ❌ No       |        ❌        |                                     |
| Lavadero recojo |          ✅ Sí           |   ✅ Sí    |      ❌ No       |        ❌        |                                     |
| Lavadero ambos  |          ✅ Sí           |   ✅ Sí    |      ❌ No       |        ❌        |                                     |

> **Nota**: Los administradores siempre necesitan carnet y factura de luz (excepto lavadero para la factura).

---

## Flujo de Registro

```
1. Usuario navega a Registros → Tipo de empresa → "Registrar nueva empresa"
2. Completa el formulario:
   - Datos de la empresa (nombre, logo, descripción, coordenadas opcionales)
   - Datos específicos del tipo (subservicios mecánicos, modalidad lavado, etc.)
   - Sus propios datos como admin (carnet, factura de luz, selfie)
   - Opcionalmente marca "También soy colaborador"
   - Agrega miembros adicionales (admins, colaboradores)
3. Se crea documento en `enterprise-requests`
4. Admin de CareDriver revisa la solicitud desde el panel admin
5. Si APRUEBA → se crea documento en `enterprises` con `buildDefaultEnterprise()`
6. Si RECHAZA → se marca como `active: false, aproved: false`
7. Los colaboradores reciben notificación en su hub para ACEPTAR o RECHAZAR la membresía
```

---

## Rutas del Sistema

### Rutas de Usuario (Server User)

| Ruta                                           | Propósito                                    |
| ---------------------------------------------- | -------------------------------------------- |
| `/user/enterprise/driverenterprise`            | Lista de empresas de conductores del usuario |
| `/user/enterprise/driverenterprise/register`   | Registrar nueva empresa de conductores       |
| `/user/enterprise/mechanicalworkshop`          | Lista de talleres mecánicos                  |
| `/user/enterprise/mechanicalworkshop/register` | Registrar nuevo taller mecánico              |
| `/user/enterprise/crane`                       | Lista de empresas de grúa                    |
| `/user/enterprise/crane/register`              | Registrar nueva empresa de remolque          |
| `/user/enterprise/laundry`                     | Lista de lavaderos                           |
| `/user/enterprise/laundry/register`            | Registrar nuevo lavadero                     |
| `/user/enterprise/[tipo]/manage/[id]`          | Gestionar empresa específica                 |

### Rutas de Admin

| Ruta                                                         | Propósito                                 |
| ------------------------------------------------------------ | ----------------------------------------- |
| `/admin/enterprise/request/register/driverenterprise`        | Lista solicitudes de registro (conductor) |
| `/admin/enterprise/request/register/driverenterprise/[id]`   | Revisar solicitud específica              |
| `/admin/enterprise/request/register/mechanicalworkshop`      | Lista solicitudes de registro (mecánico)  |
| `/admin/enterprise/request/register/mechanicalworkshop/[id]` | Revisar solicitud específica              |
| `/admin/enterprise/request/register/crane`                   | Lista solicitudes de registro (remolque)  |
| `/admin/enterprise/request/register/crane/[id]`              | Revisar solicitud específica              |
| `/admin/enterprise/request/register/laundry`                 | Lista solicitudes de registro (lavadero)  |
| `/admin/enterprise/request/register/laundry/[id]`            | Revisar solicitud específica              |

---

## Integración con App Móvil

### Para la app móvil, consultar:

#### Registro de empresa

- Crear un documento en `enterprise-requests` con la estructura de `EnterpriseRequest` (incluyendo subir archivos a Firebase Storage).
- El usuario que registra se convierte automáticamente en `admin` con `accepted: true`.
- Los `adminUserIds` y `collaboratorUserIds` se calculan automáticamente del array `members`.

#### Aceptar membresía (Colaborador)

- Consultar colección `enterprises` donde `collaboratorUserIds` o `adminUserIds` contengan el `fakeId` del usuario.
- Filtrar por miembros con `accepted: false` y `userId` o `fakeUserId` del usuario actual.
- Para aceptar: actualizar el miembro en el array `members` cambiando `accepted` a `true`.
- Para rechazar: eliminar el miembro del array y de los arrays `collaboratorUserIds`/`adminUserIds`.

#### Estructura de archivos en Firebase Storage

| Directorio              | Contenido                       |
| ----------------------- | ------------------------------- |
| `enterprises/`          | Logos de empresas               |
| `enterprises/members/`  | Fotos de perfil de miembros     |
| `enterprises/vehicles/` | Fotos de vehículos              |
| `enterprises/tools/`    | Fotos de herramientas           |
| `id-cards/`             | Carnets de identidad            |
| `licenses/`             | Licencias de conducir           |
| `selfies/`              | Selfies de verificación         |
| `electricity-bills/`    | Facturas de luz                 |
| `documents/`            | Antecedentes policiales y otros |

#### Subservicios mecánicos disponibles

```typescript
enum MechanicSubService {
  BatteryJumpStart = "Pasa corriente / arranque con batería",
  TireChange = "Cambio de llanta",
  TireInflation = "Inflado de llanta",
  FlatTireAssistance = "Auxilio por llanta pinchada",
  FuelDelivery = "Entrega de combustible",
  VehicleUnlock = "Apertura de vehículo / Cerrajero",
  ObdScan = "Escaneo electrónico del vehículo con OBD",
  HomeQuickCheck = "Chequeo rápido del vehículo a domicilio",
}
```

---

## Función `collaboratorRequiresReview()`

Determina si un colaborador necesita revisión del admin de CareDriver:

```typescript
function collaboratorRequiresReview(
  serviceType: ServiceType,
  carWashMode?: CarWashServiceMode,
): boolean {
  // Mecánico → NO (la empresa lo gestiona)
  // Lavadero solo móvil → NO
  // Lavadero con recojo/ambos → SÍ (licencia requerida)
  // Conductor → SÍ (licencia requerida)
  // Remolque → SÍ (licencia requerida)
}
```

---

## Funciones de Construcción

### `buildEnterpriseRequest()`

Crea el objeto `EnterpriseRequest` calculando automáticamente:

- `adminUserIds`: fakeIds de miembros con `role === "admin"`
- `collaboratorUserIds`: fakeIds de miembros con `role === "collaborator"` O `isAlsoCollaborator === true`
- `createdAt`: Timestamp actual
- `active: true`, `deleted: false`

### `buildDefaultEnterprise()`

Convierte una `EnterpriseRequest` aprobada en un documento `Enterprise`:

- Copia todos los datos de la solicitud
- Agrega `aproved: true`, `aprovedBy`, `approvedAt`
- Inicializa `currentDebt` en **-40 Bs.** (crédito inicial para la empresa, sin fecha de vencimiento)

---

## Componentes Principales

| Componente                                      | Ubicación                                          | Propósito                                        |
| ----------------------------------------------- | -------------------------------------------------- | ------------------------------------------------ |
| `NewEnterpriseRequestForm`                      | `enterprises/views/request_forms/`                 | Formulario de registro de empresa (por tipo)     |
| `ListOfEnterpriseRegistrationRequests`          | `enterprises/views/list_of_cards/`                 | Lista paginada de solicitudes pendientes (admin) |
| `CardToEnterpriseRegistrationRequest`           | `enterprises/views/cards/`                         | Card de solicitud individual                     |
| `ReviewEnterpriseRegistrationRequest`           | `enterprises/views/review_forms/for_registration/` | Formulario de revisión con aprobar/rechazar      |
| `ReviewEnterpriseRegistrationRequestWithLoader` | `enterprises/views/review_forms/for_registration/` | Wrapper con carga de datos                       |
| `EnterpriseMembershipBanner`                    | `enterprises/views/membership/`                    | Banner de aceptación de membresía en el hub      |
| `EnterpriseRequestRequester`                    | `enterprises/api/`                                 | CRUD para `enterprise-requests`                  |

---

## Notas Importantes

1. **El que registra es admin automático**: `accepted: true`, sin necesidad de aceptar membresía.
2. **Los colaboradores SIEMPRE deben aceptar**: Aparece un banner en el hub (`ServerServicesHub`) con la invitación.
3. **Los IDs de miembros son `fakeIds`**: Los arrays `adminUserIds` y `collaboratorUserIds` contienen `fakeId`, no `userId`.
4. **Lavadero es solo empresarial**: El formulario individual de lavadero redirige a registrar empresa. No se puede ser lavadero sin empresa.
5. **Se eliminó el campo de empresa de los formularios individuales**: Los formularios de conductor, mecánico, remolque y lavadero ya no tienen selector de empresa. La empresa se asigna después de la aprobación o a través del sistema de miembros.
6. **Keywords**: Al guardar la solicitud, se generan keywords con `generateKeywords()` para búsqueda.
7. **RefAttachment**: Todos los archivos usan la interfaz `{ ref: string, url: string }`. `ref` es la ruta en Storage, `url` es la URL de descarga.
