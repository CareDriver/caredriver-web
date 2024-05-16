"use client";
import { locationList, Locations } from "@/interfaces/Locations";
import { ChangeEvent, FormEvent } from "react";
import PhoneForm from "../form/PhoneForm";
import ChevronDown from "@/icons/ChevronDown";

interface Field {
    value: string;
    message: string | null;
}

interface StringField extends Field {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface PhoneField extends Field {
    onChange: (phone: string) => void;
}

interface ChooseField {
    value: Locations;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const SignUpForm = ({
    email,
    password,
    fullName,
    phone,
    location,
    formState,
    formInfo,
    handleSummit,
}: {
    email: StringField;
    password: StringField;
    fullName: StringField;
    phone: PhoneField;
    location: ChooseField;
    formState: {
        isValid: boolean;
        loading: boolean;
    };
    formInfo: {
        message: string;
    };
    handleSummit: (e: FormEvent) => Promise<void>;
}) => {
    return (
        <form onSubmit={handleSummit} className="form-container">
            <fieldset className="form-section">
                <input
                    type="email"
                    name="email"
                    placeholder=""
                    value={email.value}
                    onChange={email.onChange}
                    className="form-section-input"
                />
                <legend className="form-section-legend">Correo electrónico</legend>
                {email.message && <small>{email.message}</small>}
            </fieldset>
            <fieldset className="form-section">
                <input
                    type="text"
                    name="password"
                    placeholder=""
                    value={password.value}
                    onChange={password.onChange}
                    className="form-section-input"
                />
                <legend className="form-section-legend">Contraseña</legend>
                {password.message && <small>{password.message}</small>}
            </fieldset>
            <fieldset className="form-section">
                <input
                    type="text"
                    name="fullName"
                    placeholder=""
                    value={fullName.value}
                    onChange={fullName.onChange}
                    className="form-section-input"
                />
                <legend className="form-section-legend">Nombre completo</legend>
                {fullName.message && <small>{fullName.message}</small>}
            </fieldset>
            <fieldset className="form-section">
                <PhoneForm phone={phone.value} validatePhone={phone.onChange} />
                {phone.message && <small>{phone.message}</small>}
            </fieldset>
            <fieldset className="form-section | select-item">
                <ChevronDown />
                <select
                    className="form-section-input"
                    onChange={location.onChange}
                    value={location.value}
                >
                    {locationList.map((location, i) => (
                        <option key={`location-option-${i}`} value={location}>
                            {location}
                        </option>
                    ))}
                </select>
                <legend className="form-section-legend">Ubicacion</legend>
            </fieldset>

            <button
                className="general-button | touchable margin-top-25 touchable"
                data-theme="dark"
                disabled={!formState.isValid}
            >
                {formState.loading ? (
                    <i className="loader"></i>
                ) : (
                    <span>{formInfo.message}</span>
                )}
            </button>
        </form>
    );
};

export default SignUpForm;
