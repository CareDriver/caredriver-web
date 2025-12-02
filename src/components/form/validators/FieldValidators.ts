import { isNullOrEmptyText } from "@/validators/TextValidator";
import {
  AttachmentField,
  DateField,
  EntityDataField,
  EntityField,
  GeoPointField,
  TextField,
} from "../models/FormFields";

export function isValidTextField(field: TextField): boolean {
  return !field.message && !isNullOrEmptyText(field.value);
}

export function isValidDateField(field: DateField): boolean {
  return !field.message && field.value !== undefined;
}

export function isValidAttachmentField(field: AttachmentField): boolean {
  return !field.message && field.value !== undefined;
}

export function isValidEntityField(field: EntityField): boolean {
  return !field.message && field.value !== undefined;
}

export function isValidEntityDataField(field: EntityDataField<any>): boolean {
  return !field.message && field.value !== undefined;
}

export function isValidGeoPointField(field: GeoPointField): boolean {
  return !field.message && field.value !== undefined;
}
