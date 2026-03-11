import { ChangeEvent } from "react";
import { TextFieldSetter } from "../models/FieldSetters";
import { InputValidator } from "@/validators/InputValidatorSignature";

export class TextFieldStateHandler {
  setter: TextFieldSetter;
  validator: InputValidator;

  constructor(setter: TextFieldSetter, validator: InputValidator) {
    this.setter = setter;
    this.validator = validator;
  }

  changeValue = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = e.target.value;
    this.changeValueAsText(value);
  };

  changeValueAsText = (value: string): void => {
    let { isValid, message } = this.validator(value);
    this.setter({
      value: value,
      message: isValid ? null : message,
    });
  };
}
