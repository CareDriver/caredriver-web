import { PhoneInput } from "react-international-phone";

const PhoneForm = ({
    phone,
    validatePhone,
}: {
    phone: string;
    validatePhone: (phone: string) => void;
}) => {
    return (
        <PhoneInput
            defaultCountry="bo"
            value={phone}
            onChange={validatePhone}
            inputStyle={{
                width: "100%",
                padding: "30px 20px",
                fontSize: "20px",
                borderTopRightRadius: "15px",
                borderBottomRightRadius: "15px",
            }}
            countrySelectorStyleProps={{
                buttonStyle: {
                    height: "100%",
                    padding: "0 10px",
                    borderTopLeftRadius: "15px",
                    borderBottomLeftRadius: "15px",
                },
                flagStyle: {
                    width: "45px",
                    height: "45px",
                },
                dropdownStyleProps: {
                    style: {
                        minWidth: "400px",
                        borderRadius: "15px",
                    },
                    listItemFlagStyle: {
                        width: "40px",
                        height: "40px",
                    },
                    listItemCountryNameStyle: {
                        fontSize: "16px",
                    },
                    listItemDialCodeStyle: {
                        fontSize: "16px",
                    },
                },
            }}
        />
    );
};

export default PhoneForm;
