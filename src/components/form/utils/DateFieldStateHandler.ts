import { ChangeEvent } from "react";
import { DateFieldSetter } from "../models/FieldSetters";
import { InputValidator } from "@/utils/validator/InputValidator";

export class DateFieldStateHandler {
    setter: DateFieldSetter;
    validator: InputValidator;

    constructor(setter: DateFieldSetter, validator: InputValidator) {
        this.setter = setter;
        this.validator = validator;
    }

    changeValue = (e: ChangeEvent<HTMLInputElement>): void => {
        const dateString = e.target.value;
        const [year, month, day] = dateString.split("-").map(Number);
        const selectedDate = new Date(year, month - 1, day);
        this.changeValueAsDate(selectedDate);
    };

    changeValueAsDate = (value: Date): void => {
        const { isValid, message } = this.validator(value);
        this.setter({
            value: value,
            message: isValid ? null : message,
        });
    };
}
