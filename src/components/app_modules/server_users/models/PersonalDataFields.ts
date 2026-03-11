import {
  DEFAUL_TEXT_FIELD,
  DEFAUL_ATTACHMENT_FIELD,
  DEFAUL_TEXT_FIELD_GENDER,
  DEFAUL_BLOOD_TYPE,
} from "@/components/form/models/DefaultFields";
import {
  AttachmentField,
  EntityDataFieldMandatory,
  TextArrayField,
  TextField,
} from "@/components/form/models/FormFields";
import { BloodTypes } from "@/interfaces/BloodTypes";

export interface IdCard {
  frontCard: AttachmentField;
  backCard: AttachmentField;
  location: TextField;
}

export interface PersonalData {
  fullname: TextField;
  fullNameArrayLower?: TextArrayField;
  photo: AttachmentField;
  gender: TextField;
  homeAddress: TextField;
  addressPhoto: AttachmentField; // factura de luz
  bloodType: EntityDataFieldMandatory<BloodTypes>; // blood type, mandatory for drivers
  idCard: IdCard;
  alternativePhoneNumberName: TextField;
  alternativePhoneNumber: TextField;
}

export const DEFAULT_ID_CARD: IdCard = {
  frontCard: DEFAUL_ATTACHMENT_FIELD,
  backCard: DEFAUL_ATTACHMENT_FIELD,
  location: DEFAUL_TEXT_FIELD,
};

export const DEFAULT_PERSONAL_DATA: PersonalData = {
  fullname: DEFAUL_TEXT_FIELD,
  photo: DEFAUL_ATTACHMENT_FIELD,
  gender: DEFAUL_TEXT_FIELD_GENDER,
  homeAddress: DEFAUL_TEXT_FIELD,
  addressPhoto: DEFAUL_ATTACHMENT_FIELD,
  bloodType: DEFAUL_BLOOD_TYPE,
  idCard: DEFAULT_ID_CARD,
  alternativePhoneNumberName: DEFAUL_TEXT_FIELD,
  alternativePhoneNumber: DEFAUL_TEXT_FIELD,
};
