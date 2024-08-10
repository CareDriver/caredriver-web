export interface FormState {
    loading: boolean;
    isValid: boolean;
}

export const DEFAULT_FORM_STATE: FormState = {
    loading: false,
    isValid: true,
};
