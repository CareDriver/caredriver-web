import { Locations } from "./Locations";
import { Services, ServiceType } from "./Services";
import { MECHANIC_SUB_SERVICES, MechanicSubService } from "./UserRequest";

export type PricingMode = "recommended" | "range" | "fixed";

export interface PriceRange {
  min: number;
  max: number;
}

export interface ServicePricingConfig {
  serviceType: ServiceType;
  pricingMode: PricingMode;
  defaultRecommendedPrice?: number;
  recommendedPriceFormula?: string;
  formulaVariable?: "z";
  defaultRange?: PriceRange;
  defaultCommissionPercent?: number;
  defaultFixedCommissionBs?: number;
  mechanicSubServiceRanges?: Partial<
    Record<
      MechanicSubService,
      {
        recommendedPrice?: number;
        range: PriceRange;
      }
    >
  >;
  byLocation?: Partial<
    Record<
      Locations,
      {
        recommendedPrice?: number;
        recommendedPriceFormula?: string;
        range?: PriceRange;
        commissionPercent?: number;
        fixedCommissionBs?: number;
        mechanicSubServiceRanges?: Partial<
          Record<
            MechanicSubService,
            {
              recommendedPrice?: number;
              range: PriceRange;
            }
          >
        >;
      }
    >
  >;
}

export interface TemporalPricingRule {
  id: string;
  serviceType: ServiceType;
  startAtIso: string;
  endAtIso: string;
  location?: Locations;
  userCreatedBeforeIso?: string;
  pricingMode: PricingMode;
  recommendedPrice?: number;
  range?: PriceRange;
  commissionPercent?: number;
  fixedCommissionBs?: number;
  active: boolean;
  note?: string;
}

export interface AdminPricingSettings {
  id: string;
  updatedAtIso: string;
  updatedByUserId?: string;
  serviceConfigsByLocation: Record<Locations, ServicePricingConfig[]>;
  temporalRules: TemporalPricingRule[];
}

export interface LocationAvailableServices {
  activeServices: Services[];
  upcomingServices: Services[];
  mechanicSubServices: {
    active: MechanicSubService[];
    upcoming: MechanicSubService[];
  };
}

export interface AvailableServicesToGetRequests {
  id: string;
  updatedAtIso: string;
  updatedByUserId?: string;
  byLocation: Record<Locations, LocationAvailableServices>;
}

export const ADMIN_PRICING_SETTINGS_DOC_ID = "provider-pricing-v2-by-location";
export const AVAILABLE_SERVICES_TO_GET_REQUESTS_DOC_ID =
  "availableServicesToGetRequests-v2-by-location";

const DEFAULT_SERVICE_CONFIGS_BY_LOCATION = (): Record<
  Locations,
  ServicePricingConfig[]
> => {
  const mechanicSubServiceRangesDefault: Partial<
    Record<
      MechanicSubService,
      {
        recommendedPrice?: number;
        range: PriceRange;
      }
    >
  > = {
    [MechanicSubService.BatteryJumpStart]: {
      recommendedPrice: 35,
      range: { min: 25, max: 50 },
    },
    [MechanicSubService.TireChange]: {
      recommendedPrice: 30,
      range: { min: 20, max: 40 },
    },
    [MechanicSubService.TireInflation]: {
      recommendedPrice: 20,
      range: { min: 10, max: 30 },
    },
    [MechanicSubService.FlatTireAssistance]: {
      recommendedPrice: 35,
      range: { min: 20, max: 50 },
    },
    [MechanicSubService.FuelDelivery]: {
      recommendedPrice: 40,
      range: { min: 25, max: 60 },
    },
    [MechanicSubService.VehicleUnlock]: {
      recommendedPrice: 55,
      range: { min: 35, max: 80 },
    },
    [MechanicSubService.ObdScan]: {
      recommendedPrice: 70,
      range: { min: 50, max: 100 },
    },
    [MechanicSubService.HomeQuickCheck]: {
      recommendedPrice: 65,
      range: { min: 45, max: 90 },
    },
  };

  const defaultServiceConfigs: ServicePricingConfig[] = [
    {
      serviceType: "driver",
      pricingMode: "recommended",
      recommendedPriceFormula: "46 + 5 * z - 0.0402 * z**2 + 0.000681 * z**3",
      formulaVariable: "z",
      defaultRange: { min: 10, max: 40 },
      defaultCommissionPercent: 13,
    },
    {
      serviceType: "mechanical",
      pricingMode: "range",
      defaultRecommendedPrice: 45,
      defaultRange: { min: 20, max: 150 },
      defaultCommissionPercent: 15,
      defaultFixedCommissionBs: 6,
      mechanicSubServiceRanges: mechanicSubServiceRangesDefault,
    },
    {
      serviceType: "laundry",
      pricingMode: "range",
      defaultRecommendedPrice: 120,
      defaultCommissionPercent: 12,
      defaultRange: { min: 50, max: 300 },
    },
    {
      serviceType: "tow",
      pricingMode: "recommended",
      defaultRecommendedPrice: 180,
      recommendedPriceFormula: "46 + 5 * z - 0.0402 * z**2 + 0.000681 * z**3",
      formulaVariable: "z",
      defaultCommissionPercent: 15,
      defaultRange: { min: 80, max: 500 },
    },
  ];

  return {
    [Locations.CochabambaBolivia]: defaultServiceConfigs,
    [Locations.SantaCruzBolivia]: defaultServiceConfigs,
    [Locations.LaPazBolivia]: defaultServiceConfigs,
    [Locations.TarijaBolivia]: defaultServiceConfigs,
    [Locations.ChuquisacaBolivia]: defaultServiceConfigs,
    [Locations.PotosiBolivia]: defaultServiceConfigs,
    [Locations.OruroBolivia]: defaultServiceConfigs,
    [Locations.BeniBolivia]: defaultServiceConfigs,
    [Locations.PandoBolivia]: defaultServiceConfigs,
  };
};

const DEFAULT_AVAILABLE_SERVICES_BY_LOCATION = (): Record<
  Locations,
  LocationAvailableServices
> => {
  const allMechanicSubServices = MECHANIC_SUB_SERVICES.map((item) => item.key);
  const allAppServices: Services[] = [
    Services.Normal,
    Services.Driver,
    Services.Mechanic,
    Services.Tow,
    Services.Laundry,
  ];
  const cochaUpcomingServices = allAppServices.filter(
    (service) => service !== Services.Driver,
  );

  return {
    [Locations.CochabambaBolivia]: {
      activeServices: [Services.Driver],
      upcomingServices: cochaUpcomingServices,
      mechanicSubServices: {
        active: [],
        upcoming: allMechanicSubServices,
      },
    },
    [Locations.SantaCruzBolivia]: {
      activeServices: [],
      upcomingServices: allAppServices,
      mechanicSubServices: {
        active: [],
        upcoming: allMechanicSubServices,
      },
    },
    [Locations.LaPazBolivia]: {
      activeServices: [],
      upcomingServices: allAppServices,
      mechanicSubServices: {
        active: [],
        upcoming: allMechanicSubServices,
      },
    },
    [Locations.TarijaBolivia]: {
      activeServices: [],
      upcomingServices: [],
      mechanicSubServices: {
        active: [],
        upcoming: [],
      },
    },
    [Locations.ChuquisacaBolivia]: {
      activeServices: [],
      upcomingServices: [],
      mechanicSubServices: {
        active: [],
        upcoming: [],
      },
    },
    [Locations.PotosiBolivia]: {
      activeServices: [],
      upcomingServices: [],
      mechanicSubServices: {
        active: [],
        upcoming: [],
      },
    },
    [Locations.OruroBolivia]: {
      activeServices: [],
      upcomingServices: [],
      mechanicSubServices: {
        active: [],
        upcoming: [],
      },
    },
    [Locations.BeniBolivia]: {
      activeServices: [],
      upcomingServices: [],
      mechanicSubServices: {
        active: [],
        upcoming: [],
      },
    },
    [Locations.PandoBolivia]: {
      activeServices: [],
      upcomingServices: [],
      mechanicSubServices: {
        active: [],
        upcoming: [],
      },
    },
  };
};

export const DEFAULT_ADMIN_PRICING_SETTINGS: AdminPricingSettings = {
  id: ADMIN_PRICING_SETTINGS_DOC_ID,
  updatedAtIso: new Date().toISOString(),
  serviceConfigsByLocation: DEFAULT_SERVICE_CONFIGS_BY_LOCATION(),
  temporalRules: [],
};

export const INITIAL_AVAILABLE_SERVICES: AvailableServicesToGetRequests = {
  id: AVAILABLE_SERVICES_TO_GET_REQUESTS_DOC_ID,
  updatedAtIso: new Date().toISOString(),
  byLocation: DEFAULT_AVAILABLE_SERVICES_BY_LOCATION(),
};
