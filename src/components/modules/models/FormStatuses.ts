interface BaseInputState {
    message: null | string;
}

export interface InputTextState extends BaseInputState {
    value: string;
}
