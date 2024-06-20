import { Locations } from "./Locations";
import { Services } from "./Services";

// Define an enum type for the severity of events
export enum Severity {
    Informative = "informative",
    Warning = "warning",
    Critical = "critical",
}

// Define the structure of a triggered event (For managing for example when service started, finished, was canceled, lack of gps permission, etc)
interface TriggeredEvent {
    comment: string;
    timestamp: number; // timestamp in milliseconds
    severity: Severity;
}

// Define the structure of a coordinate registration during service
export interface CoordinateRegister {
    lat: number;
    long: number;
    timestamp: number; // timestamp in milliseconds
    mockedLocation: boolean; // if the app detected the location as mocked
    comment: string; // any generated comment by the app if is necessary to
}

// Define the structure of the routes and triggered events of a service
export interface ServiceRoutes {
    id?: string; // same id as the firestore document
    priorArrivalRoute: { [key: string]: CoordinateRegister }; // coordinates before service user arrives
    serviceInProgressRoute?: { [key: string]: CoordinateRegister }; // coordinates when the service is in progress, not all services requires registration of this, for example mechanics and car washes do not move from the location when the service is in progress
    // Last registered coordinates:
    lastPriorArrivalRoute?: CoordinateRegister;
    lastServiceInProgressRoute?: CoordinateRegister;
    // Triggered events registered by the app when the service has started
    triggeredEvents: { [key: string]: TriggeredEvent };
    // These 3 attributes are repeated from the firestore document, in this case it will be used just for security rules
    serviceUserArrived: boolean;
    canceled: boolean;
    finished: boolean;
}

// RTDB = Real Time Database
export const RTDBservicesCodes: Record<Exclude<Services, Services.Normal>, string> = {
    [Services.Driver]: "driver-services",
    [Services.Mechanic]: "mechanic-services",
    [Services.Tow]: "tow-services",
    [Services.Laundry]: "car-wash-services",
};

export const RTDBLocationsCodes: Record<Locations, string> = {
    [Locations.CochabambaBolivia]: "cbba-bolivia",
    [Locations.SantaCruzBolivia]: "stz-bolivia",
    [Locations.LaPazBolivia]: "lpz-bolivia",
    [Locations.TarijaBolivia]: "tja-bolivia",
    [Locations.ChuquisacaBolivia]: "ch-bolivia",
    [Locations.PotosiBolivia]: "pt-bolivia",
    [Locations.OruroBolivia]: "or-bolivia",
    [Locations.BeniBolivia]: "be-bolivia",
    [Locations.PandoBolivia]: "pd-bolivia",
};

export const buildUrlDB = (code: string, location: string) => {
    return `https://caredriver-${code}-${location}.firebaseio.com/`;
};

/* 
  To get a url of a database it must be form by 
  https://caredriver-{RTDBservicesCode}-{RTDBLocationsCode}.firebaseio.com/ 
  For example the database for the mechanic services of Tarija, Bolivia would be  
  https://caredriver-mechanic-services-tja-bolivia.firebaseio.com/
*/

/* 
services
    |__ 1aMgTX331lPYqz64Pgaf
            |__canceled
            |__finished
            |__lastPriorArrivalRoute
            |__lastServiceInProgressRoute
            |__priorArrivalRoute
            |__serviceInProgressRoute
            |__serviceUserArrived
            |__triggeredEvents
*/
