import { defaultCountries, parseCountry, PhoneInput } from "react-international-phone";

const PhoneForm = ({
    phone,
    validatePhone,
}: {
    phone: string;
    validatePhone: (phone: string) => void;
}) => {
    const countries = defaultCountries.filter((country) => {
        const { iso2 } = parseCountry(country);
        return ["bo"].includes(iso2);
    });

    return (
        <PhoneInput
            defaultCountry="bo"
            countries={countries}
            value={phone}
            onChange={validatePhone}
            inputStyle={{
                width: "100%",
                padding: "1.666666667rem 1.111111111rem",
                fontSize: "1.111111111rem",
                borderTopRightRadius: "0.833333333rem",
                borderBottomRightRadius: "0.833333333rem",
            }}
            countrySelectorStyleProps={{
                buttonStyle: {
                    height: "100%",
                    padding: "0 0.555555556rem",
                    borderTopLeftRadius: "0.833333333rem",
                    borderBottomLeftRadius: "0.833333333rem",
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
    );
};

export default PhoneForm;
