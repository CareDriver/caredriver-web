# CareDriver Web Panel - AI Agent Instructions

## Project Overview

CareDriver is a ride-sharing and automotive services platform (driver, mechanic, tow, car wash) with a web admin panel built on Next.js 14+ (App Router), Firebase, and TypeScript. The app connects service providers (drivers, mechanics, tow operators, car wash) with clients in Bolivia.

## Architecture & Key Concepts

### Application Structure

- **Next.js App Router**: All routes in `src/app/` follow the App Router pattern (layout.tsx, page.tsx)
- **Client-Side Heavy**: Most components are marked `"use client"` due to Firebase client SDK usage
- **Firebase Dual Setup**:
  - Client SDK (`src/firebase/FirebaseConfig.ts`) for auth/firestore in client components
  - Admin SDK (`firebase-admin`) isolated to API routes only (see webpack config excluding it from client bundle)
- **Path Aliases**: Use `@/` for all imports (maps to `src/`)

### Firebase Collections (CollecionNames.ts)

- **users**: All users (clients and service providers) with `UserRole` enum (User, Admin, Support, BalanceRecharge)
- **enterprises**: Companies that group service providers (drivers belong to driver enterprises)
- **driver-requests/mechanic-requests/tow-requests/car-wash-requests**: Service provider applications
- **driver-services/mechanical-services/tow-services/car-wash-services**: Active service records
- **proposals**: Driver proposals for trips
- **license-update-requests**: Driver license renewal requests
- **change-photo-requests**: Profile photo update requests
- **branding-requests**: Custom vehicle branding approval
- **action-on-users**: Admin actions log (bans, approvals)

### Data Model Patterns

**User System**: Users have a `services` array (e.g., `[Services.Normal, Services.Driver]`) and `servicesData` object tracking ratings/comments per service type. Service providers link to enterprises via `driverEnterpriseId`, `mechanicalWorkShopId`, etc.

**Request → Approval Flow**: Service applications (driver-requests, etc.) have `ServiceStateRequest` enum (Pending, Approved, Denied, InRevision). Upon approval, user gains service role and data migrates to user doc + service collection.

**RefAttachment Pattern**: Files (photos, PDFs) use `RefAttachment { ref: string, url: string }` interface. `ref` is Firebase Storage path, `url` is download URL. Use `EMPTY_REF_ATTACHMENT` for empty state, `DELETED_REF_ATTACHMENT` when deleted.

**Location Tracking**: Users store `pickUpLocationsHistory` and `deliveryLocationsHistory` as `HistoryLocationInterface[]` with `GeoPoint` coordinates. App operates in Bolivia, uses `Locations` enum (CochabambaBolivia, etc.).

## Development Workflows

### Running Locally

```bash
npm run dev              # Start dev server (port 3000)
npm run lint             # Run ESLint
npm run type-check       # TypeScript validation
npm run ci-check         # Full check: prettier + lint + type-check
npm run prettier:fix     # Auto-format code
```

### Deployment to Cloudflare Pages

- Build command: `npm ci && npm run build && rm -rf .next/cache`
- `.next/cache` deletion is required to stay under 25 MiB limit (see DEPLOY.md)
- Environment variables: Firebase config + Admin SDK keys (see DEPLOY.md)

### Code Quality

- ESLint rules: `@next/next/no-img-element: off`, `react-hooks/exhaustive-deps: off`
- Prettier for formatting (configured via prettierrc.json)

## Code Conventions

### Component Organization

```
src/components/
  app_modules/          # Feature modules (users, enterprises, services)
    [feature]/
      api/              # Firebase CRUD operations
      views/            # UI components
      validators/       # Input validation
  auth/                 # Authentication flows
  form/                 # Reusable form components
  guards/               # Route protection components
  navigation/           # Nav bars, sidebars
```

### API Layer Pattern (app_modules/\*/api/)

- One file per collection (e.g., `DriveRequester.ts`, `EnterpriseRequester.ts`)
- Export collection reference: `export const driveReqCollection = collection(firestore, "driver-requests")`
- CRUD functions: `saveX`, `getXById`, `updateX`, `deleteX`
- Pagination helpers: `getXPaginated(currentPage, itemsPerPage, filters)` + `getXNumPages(itemsPerPage, filters)`

### State Management

- **AuthContext**: Global auth state (`user: UserInterface | undefined`, `checkingUserAuth: boolean`)
  - Loads user data from `users` collection after Firebase auth
  - Provides `logout()` method
  - Auto-redirects disabled/deleted users
- **PageStateContext**: UI state (loading, errors, page-level data)

### User Feedback (react-toastify)

```tsx
import { toast } from "react-toastify";

toast.success("Operación exitosa");
toast.error("Error al procesar");
toast.warning("Permiso denegado");
toast.info("Información importante");
```

Use Spanish messages; configure with `autoClose: 4000`, `hideProgressBar: true` (see Layout.tsx).

### Validators & Helpers

- **Validators** (`src/validators/`): Return `InputState` objects from form validation
- **Helpers** (`src/utils/helpers/`):
  - `PhoneHelper.ts`: `parseBoliviaPhone()` for +591 numbers
  - `DateHelper.ts`: `timestampDateInSpanish()` for localized dates
  - `StringHelper.ts`: `generateKeywords()` for Firestore search arrays
  - `MapHelper.ts`: `createGoogleMapsUrl()` for lat/lng links

### File Upload Pattern

```tsx
import { uploadFileBase64, deleteFile } from "@/utils/requesters/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";

// Upload returns RefAttachment
const attachment = await uploadFileBase64(
  DirectoryPath.Selfies,
  base64String,
  userId,
);

// Cleanup
await deleteFile(attachment.ref);
```

### Icons

All icons are React components in `src/icons/`. Import like: `import Xmark from "@/icons/Xmark";`

## Common Patterns

### Guard Components

Wrap pages with guard components to enforce role/auth requirements:

```tsx
<GuardOfPage requiredRole={UserRole.Admin}>
  <AdminPanel />
</GuardOfPage>
```

### Form Submission

Use `BaseFormWithTwoButtons` for standardized forms with submit/cancel actions. Forms typically:

1. Validate inputs with validators
2. Show toast on error/success
3. Update Firestore collection
4. Navigate on success

### Pagination Lists

Use `useListPagination` hook with pagination API functions. Lists follow pattern:

- Load page of items
- Display in cards/table
- Page navigation controls
- Loading/error states

### Real-time Updates

Use Firestore `onSnapshot` for live data (e.g., active service requests). Clean up listeners in useEffect returns.

## Important Notes

- **Spanish UI**: All user-facing text in Spanish
- **Bolivia-centric**: Phone parsing, currency (Bs.), locations are Bolivia-specific
- **Multi-role Users**: Users can have multiple service roles simultaneously
- **Enterprise Associations**: Service providers must link to enterprises; use `addUserServerToEnterprise()` API
- **Fake IDs**: Users have `fakeId` for public display (generated via `genFakeId()`)
- **Keywords**: User/enterprise docs include `keywords` array for search (use `generateKeywords()`)
- **Balance System**: Service providers have `balance` and `balanceHistory` for payment tracking
- **Disabled Users**: Users can be temporarily disabled via `disabledUntil: Timestamp`

## When Making Changes

1. **Check role permissions**: Admin/Support/BalanceRecharge have different access levels
2. **Update keywords**: When changing names/searchable fields, regenerate keywords array
3. **Handle file attachments**: Always clean up old files when replacing RefAttachments
4. **Maintain audit trail**: Log admin actions to `action-on-users` collection
5. **Test pagination**: Ensure filters work correctly with pagination functions
6. **Validate Spanish text**: Keep consistent tone/terminology in user messages
