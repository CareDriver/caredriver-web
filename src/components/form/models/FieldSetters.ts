import { Locations } from "@/interfaces/Locations";
import {
  AttachmentField,
  DateField,
  EntityDataField,
  EntityField,
  GeoPointField,
  TextField,
} from "./FormFields";
import { InputValidator } from "@/validators/InputValidatorSignature";
import { UserRole } from "@/interfaces/UserInterface";
import { VehicleTransmission } from "@/interfaces/VehicleInterface";
import { LicenseCategories } from "@/interfaces/LicenseCategories";
import { BloodTypes } from "@/interfaces/BloodTypes";

export type FieldSetter<T> = (data: T) => void;

export type TextFieldSetter = FieldSetter<TextField>;

export type DateFieldSetter = FieldSetter<DateField>;

export type EntityFieldSetter = FieldSetter<EntityField>;

export type EntityDataFieldSetter<T> = FieldSetter<EntityDataField<T>>;

export type AttachmentFieldSetter = FieldSetter<AttachmentField>;

export type LocationFieldSetter = FieldSetter<Locations>;

export type LicenseCategoryFieldSetter = FieldSetter<LicenseCategories>;

export type BloodTypeFieldSetter = FieldSetter<BloodTypes>;

export type OptionFieldSetter = FieldSetter<string>;

export type TransmitionFieldSetter = FieldSetter<VehicleTransmission>;

export type GeoPointFieldSetter = FieldSetter<GeoPointField>;

export type RoleFieldSetter = FieldSetter<UserRole>;

export interface TextFieldWithSetter {
  values: TextField;
  setter: TextFieldSetter;
  validator: InputValidator;
}

export interface DateFieldWithSetter {
  values: DateField;
  setter: DateFieldSetter;
  validator: InputValidator;
}
