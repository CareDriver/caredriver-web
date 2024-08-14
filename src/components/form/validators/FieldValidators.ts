import { isNullOrEmptyText } from "@/utils/validator/text/TextValidator";
import {
    AttachmentField,
    DateField,
    EntityField,
    GeoPointField,
    TextField,
} from "../models/FormFields";

export function isValidTextField(field: TextField): boolean {
    return field.message === null && !isNullOrEmptyText(field.value);
}

export function isValidDateField(field: DateField): boolean {
    return field.message === null && field.value !== undefined;
}

export function isValidAttachmentField(field: AttachmentField): boolean {
    return field.message === null && field.value !== undefined;
}

export function isValidEntityField(field: EntityField): boolean {
    return field.message === null && field.value !== undefined;
}

export function isValidGeoPointField(field: GeoPointField): boolean {
    return field.message === null && field.value !== undefined;
}
