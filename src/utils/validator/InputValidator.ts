export type InputValidator = (input: string) => InputState;

export interface InputState {
    isValid: boolean;
    message: string;
}
