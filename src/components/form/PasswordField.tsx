"use client";

import Eye from "@/icons/Eye";
import EyeSlash from "@/icons/EyeSlash";
import { ChangeEvent, useState } from "react";

const PasswordField = ({
    password,
    errorMessage,
    onChange,
}: {
    password: string;
    errorMessage: string | null;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
    const [isHide, setHide] = useState(true);

    const togglePass = () => {
        setHide(!isHide);
    };
    return (
        <fieldset className="form-section">
            <input
                type={isHide ? "password" : "text"}
                name="password"
                placeholder=""
                value={password}
                onChange={onChange}
                className="form-section-input"
            />
            <legend className="form-section-legend">Contraseña</legend>
            {errorMessage && (
                <small className="form-section-message">{errorMessage}</small>
            )}
            <button
                type="button"
                onClick={togglePass}
                className="form-hide-password-button icon-wrapper | gray-icon lb"
            >
                {isHide ? <EyeSlash /> : <Eye />}
            </button>
        </fieldset>
    );
};

export default PasswordField;
