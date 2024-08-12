import { Locations } from "@/interfaces/Locations";
import { AttachmentField, DateField, EntityField, TextField } from "./FormFields";
import { InputValidator } from "@/utils/validator/InputValidator";
import { UserRole } from "@/interfaces/UserInterface";
import { VehicleTransmission } from "@/interfaces/VehicleInterface";

export type FieldSetter<T> = (data: T) => void;

export type TextFieldSetter = FieldSetter<TextField>;

export type DateFieldSetter = FieldSetter<DateField>;

export type EntityFieldSetter = FieldSetter<EntityField>;

export type AttachmentFieldSetter = FieldSetter<AttachmentField>;

export type LocationFieldSetter = FieldSetter<Locations>;

export type TransmitionFieldSetter = FieldSetter<VehicleTransmission>;

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
