interface BaseField {
    message: null | string;
}

export interface TextField extends BaseField {
    value: string;
}

export interface AttachmentField extends BaseField {
    value: string | null;
}

export interface VerificationCodeField extends BaseField {
    codeSent: string;
    currentCode: string;
}
