import {
    AttachmentField,
    TextField,
    VerificationCodeField,
} from "./FormFields";

export const DEFAUL_TEXT_FIELD: TextField = {
    value: "",
    message: null,
};

export const DEFAUL_ATTACHMENT_FIELD: AttachmentField = {
    value: null,
    message: null,
};

export const DEFAUL_VERIFICATION_CODE_FIELD: VerificationCodeField = {
    codeSent: "",
    currentCode: "",
    message: null,
};