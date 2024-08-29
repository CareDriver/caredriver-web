"use client";

import Eye from "@/icons/Eye";
import EyeSlash from "@/icons/EyeSlash";
import { useState } from "react";
import { TextFieldSetter } from "@/components/form/models/FieldSetters";
import { TextField } from "@/components/form/models/FormFields";
import { TextFieldStateHandler } from "../../utils/TextFieldStateHandler";
import { isValidPassword } from "@/components/app_modules/users/validators/for_data/CredentialsValidator";

interface Props {
    values: TextField;
    setter: TextFieldSetter;
}

const PasswordField: React.FC<Props> = ({ values, setter }) => {
    const [isHide, setHide] = useState(true);
    const stateHandler = new TextFieldStateHandler(setter, isValidPassword);

    const toggleVisibility = () => {
        setHide(!isHide);
    };

    return (
        <fieldset className="form-section">
            <input
                type={isHide ? "password" : "text"}
                placeholder=""
                value={values.value}
                onChange={stateHandler.changeValue}
                className="form-section-input | extra-padding-right"
            />
            <legend className="form-section-legend">Contraseña</legend>
            {values.message && (
                <small className="form-section-message">
                    * {values.message}
                </small>
            )}
            <button
                type="button"
                onClick={toggleVisibility}
                className="form-hide-password-button icon-wrapper | gray-icon lb"
            >
                {isHide ? <EyeSlash /> : <Eye />}
            </button>
        </fieldset>
    );
};

export default PasswordField;
