import {
  createEntityDataFieldMandatory,
  DEFAUL_ATTACHMENT_FIELD,
  DEFAUL_DATE_FIELD,
  DEFAUL_TEXT_FIELD,
  DEFAULT_CHECK_FIELD,
} from "@/components/form/models/DefaultFields";
import {
  AttachmentField,
  CheckField,
  DateField,
  EntityDataFieldMandatory,
  TextField,
} from "@/components/form/models/FormFields";
import { LicenseCategories } from "@/interfaces/LicenseCategories";

export interface License {
  number: TextField;
  expirationDate: DateField;
  frontPhoto: AttachmentField;
  behindPhoto: AttachmentField;
  category: EntityDataFieldMandatory<LicenseCategories>;
  requireGlasses: CheckField;
  requiredHeadphones: CheckField;
}

export const DEFAULT_LICENSE: License = {
  number: DEFAUL_TEXT_FIELD,
  expirationDate: DEFAUL_DATE_FIELD,
  frontPhoto: DEFAUL_ATTACHMENT_FIELD,
  behindPhoto: DEFAUL_ATTACHMENT_FIELD,
  category: createEntityDataFieldMandatory(LicenseCategories.CategoryP),
  requireGlasses: DEFAULT_CHECK_FIELD,
  requiredHeadphones: DEFAULT_CHECK_FIELD,
};
