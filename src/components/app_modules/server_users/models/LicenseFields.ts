import {
  DEFAUL_ATTACHMENT_FIELD,
  DEFAUL_DATE_FIELD,
  DEFAUL_TEXT_FIELD,
} from "@/components/form/models/DefaultFields";
import {
  AttachmentField,
  DateField,
  TextField,
} from "@/components/form/models/FormFields";

export interface License {
  number: TextField;
  expirationDate: DateField;
  frontPhoto: AttachmentField;
  behindPhoto: AttachmentField;
}

export const DEFAULT_LICENSE: License = {
  number: DEFAUL_TEXT_FIELD,
  expirationDate: DEFAUL_DATE_FIELD,
  frontPhoto: DEFAUL_ATTACHMENT_FIELD,
  behindPhoto: DEFAUL_ATTACHMENT_FIELD,
};
