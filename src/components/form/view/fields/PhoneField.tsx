'use client'
import {
    defaultCountries,
    parseCountry,
    PhoneInput,
} from "react-international-phone";
import { TextField } from "../../models/FormFields";
import { TextFieldSetter } from "../../models/FieldSetters";
import { TextFieldStateHandler } from "../../utils/TextFieldStateHandler";
import { isPhoneValid } from "@/components/app_modules/users/validators/for_data/CredentialsValidator";
import { useState } from "react";

interface Props {
    values: TextField;
    setter: TextFieldSetter;
}

const PhoneField: React.FC<Props> = ({ values, setter }) => {
    const [isFocused, setIsFocused] = useState(false);
    const stateValidator = new TextFieldStateHandler(setter, isPhoneValid);

    const countries = defaultCountries.filter((country) => {
        const { iso2 } = parseCountry(country);
        return ["bo"].includes(iso2);
    });

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    return (
        <fieldset className="form-section">
            <PhoneInput
                defaultCountry="bo"
                countries={countries}
                value={values.value}
                onChange={stateValidator.changeValueAsText}
                inputStyle={{
                    width: "100%",
                    padding: "1.666666667rem 1.111111111rem",
                    fontSize: "1.111111111rem",
                    fontWeight: "600",
                    borderTopRightRadius: "0.833333333rem",
                    borderBottomRightRadius: "0.833333333rem",
                    backgroundColor: !isFocused ? "white" : "var(--main-lighter)",
                    border: !isFocused ? "0.0625rem solid var(--gray-medium)" : "0.15rem solid var(--second-dark)",
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                countrySelectorStyleProps={{
                    buttonStyle: {
                        height: "100%",
                        padding: "0 0.555555556rem",
                        borderTopLeftRadius: "0.833333333rem",
                        borderBottomLeftRadius: "0.833333333rem",
                        backgroundColor: !isFocused ? "white" : "var(--main-lighter)",
                        border: !isFocused ? "0.0625rem solid var(--gray-medium)" : "0.15rem solid var(--second-dark)",
                        borderRight: !isFocused ? "0.0625rem solid var(--gray-medium)" : "0.05rem solid var(--second-dark)"
                    },
                    flagStyle: {
                        width: "2.5rem",
                        height: "2.5rem",
                    },
                    dropdownStyleProps: {
                        style: {
                            minWidth: "22.222222222rem",
                            borderRadius: "0.833333333rem",
                            zIndex: "2000",
                        },
                        listItemFlagStyle: {
                            width: "2.5rem",
                            height: "2.5rem",
                        },
                        listItemCountryNameStyle: {
                            fontSize: "0.888888889rem",
                        },
                        listItemDialCodeStyle: {
                            fontSize: "0.888888889rem",
                        },
                    },
                }}
            />
            {values.message && <small>* {values.message}</small>}
        </fieldset>
    );
};

export default PhoneField;
