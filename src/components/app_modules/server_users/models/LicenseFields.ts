import {
  DEFAUL_ATTACHMENT_FIELD,
  DEFAUL_DATE_FIELD,
  DEFAUL_TEXT_FIELD,
  DEFAULT_CHECK_FIELD,
} from "@/components/form/models/DefaultFields";
import {
  AttachmentField,
  CheckField,
  DateField,
  TextField,
} from "@/components/form/models/FormFields";

export interface License {
  number: TextField;
  expirationDate: DateField;
  frontPhoto: AttachmentField;
  behindPhoto: AttachmentField;
  category: TextField;
  requireGlasses: CheckField;
  requiredHeadphones: CheckField;
}

export const DEFAULT_LICENSE: License = {
  number: DEFAUL_TEXT_FIELD,
  expirationDate: DEFAUL_DATE_FIELD,
  frontPhoto: DEFAUL_ATTACHMENT_FIELD,
  behindPhoto: DEFAUL_ATTACHMENT_FIELD,
  category: DEFAUL_TEXT_FIELD,
  requireGlasses: DEFAULT_CHECK_FIELD,
  requiredHeadphones: DEFAULT_CHECK_FIELD,
};
