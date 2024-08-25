import {
    isValidAttachmentField,
    isValidDateField,
    isValidTextField,
} from "@/components/form/validators/FieldValidators";
import { Vehicle } from "../../models/VehicleFields";
import { License } from "../../models/LicenseFields";

export function isValidVehicle(vehicle: Vehicle): boolean {
    return isValidVehicleLicense(vehicle.license);
}

export function isValidVehicleLicense(license: License): boolean {
    return (
        isValidTextField(license.number) &&
        isValidDateField(license.expirationDate) &&
        isValidAttachmentField(license.frontPhoto) &&
        isValidAttachmentField(license.behindPhoto)
    );
}

export function areValidVehicles(vehicles: Vehicle[]): boolean {
    return vehicles.reduce((acc, current) => {
        return acc && isValidVehicle(current);
    }, true);
}
