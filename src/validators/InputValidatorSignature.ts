export type InputValidator = (input: any) => InputState;

export interface InputState {
  isValid: boolean;
  message: string;
}
