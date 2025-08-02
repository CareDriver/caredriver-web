import { Gender } from "@/interfaces/UserInterface";
import {
  AttachmentField,
  CheckField,
  DateField,
  EntityDataField,
  EntityField,
  GeoPointField,
  TextField,
  VerificationCodeField,
} from "./FormFields";

export const DEFAUL_TEXT_FIELD: TextField = {
  value: "",
  message: null,
};

export const DEFAULT_CHECK_FIELD: CheckField = {
  value: false,
  message: null,
};

export const DEFAUL_TEXT_FIELD_GENDER: TextField = {
  value: Gender.Male,
  message: null,
};

export const DEFAUL_DATE_FIELD: DateField = {
  value: undefined,
  message: null,
};

export const DEFAUL_ENTITY_FIELD: EntityField = {
  value: undefined,
  message: null,
};

export const DEFAUL_ENTITY_DATA_FIELD: EntityDataField<any> = {
  value: undefined,
  message: null,
};

export const DEFAUL_ATTACHMENT_FIELD: AttachmentField = {
  value: undefined,
  message: null,
};

export const DEFAUL_GEOPOINT_FIELD: GeoPointField = {
  value: undefined,
  message: null,
};

export const DEFAUL_VERIFICATION_CODE_FIELD: VerificationCodeField = {
  codeSent: "",
  currentCode: "",
  message: null,
};
