import { Locations } from "@/interfaces/Locations";
import { AttachmentField, TextField } from "./FormFields";
import { InputValidator } from "@/utils/validator/InputValidator";
import { UserRole } from "@/interfaces/UserInterface";

export type FieldSetter<T> = (data: T) => void;

export type TextFieldSetter = FieldSetter<TextField>;

export type AttachmentFieldSetter = FieldSetter<AttachmentField>;

export type LocationFieldSetter = FieldSetter<Locations>;

export type RoleFieldSetter = FieldSetter<UserRole>;

export interface TextFieldWithSetter {
    values: TextField;
    setter: TextFieldSetter;
    validator: InputValidator;
}
