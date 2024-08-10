import { isNullOrEmptyText } from "@/utils/validator/text/TextValidator";
import { TextField } from "../models/FormFields";

export function isValidTextField(field: TextField): boolean {
    return !field.message && !isNullOrEmptyText(field.value);
}
