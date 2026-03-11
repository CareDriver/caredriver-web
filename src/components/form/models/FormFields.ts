import { GeoPoint } from "firebase/firestore";

interface BaseField {
  message: null | string;
}

export interface TextField extends BaseField {
  value: string;
}

export interface TextArrayField extends BaseField {
  value: string[];
}

export interface CheckField extends BaseField {
  value: boolean;
}

export interface DateField extends BaseField {
  value: Date | undefined;
}

export interface EntityField extends BaseField {
  value: string | undefined;
}

export interface EntityDataField<T> extends BaseField {
  value: T | undefined;
}

export interface EntityDataFieldMandatory<T> extends BaseField {
  value: T;
}

export interface AttachmentField extends BaseField {
  value: string | undefined;
}

export interface GeoPointField extends BaseField {
  value: GeoPoint | undefined;
}

export interface VerificationCodeField extends BaseField {
  codeSent: string;
  currentCode: string;
}
