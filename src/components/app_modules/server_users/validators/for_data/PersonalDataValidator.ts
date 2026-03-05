import {
  isValidAttachmentField,
  isValidTextField,
} from "@/components/form/validators/FieldValidators";
import { IdCard, PersonalData } from "../../models/PersonalDataFields";

export function isValidPersonalData(data: PersonalData): boolean {
  return (
    !isNaN(Number(data.alternativePhoneNumber.value)) &&
    isValidTextField(data.fullname) &&
    isValidAttachmentField(data.photo) &&
    isValidIdCard(data.idCard)
  );
}

export function isValidIdCard(data: IdCard): boolean {
  return (
    isValidTextField(data.location) &&
    isValidAttachmentField(data.backCard) &&
    isValidAttachmentField(data.frontCard)
  );
}
