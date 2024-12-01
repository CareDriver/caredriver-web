import { PhoneNumber } from "@/interfaces/UserInterface";

export function createRemoveCountryCodeFunction(countryCode: string) {
    if (!countryCode || typeof countryCode !== "string") {
        throw new Error("Invalid country code");
    }

    const standardizedCode = countryCode.replace(/^(\+|00)/, "");
    const formattedCode = `\\+?${standardizedCode}`;

    return function (phoneNumber: string): string {
        const regex = new RegExp(`^(${formattedCode}|00${standardizedCode})`);
        return phoneNumber.replace(regex, "").trim();
    };
}

export function createParsePhoneNumberFunction(countryCode: string) {
    if (!countryCode || typeof countryCode !== "string") {
        throw new Error("Invalid country code");
    }

    const standardizedCode = countryCode.replace(/^(\+|00)/, "");
    const formattedCode = `\\+?${standardizedCode}`;

    return function (phoneNumber: string): PhoneNumber {
        const regex = new RegExp(`^(${formattedCode}|00${standardizedCode})`);
        if (regex.test(phoneNumber)) {
            const number = phoneNumber.replace(regex, "").trim();
            return {
                countryCode: `+${standardizedCode}`,
                number: number,
            };
        }

        throw new Error(
            "Phone number does not start with the specified country code",
        );
    };
}

export function parseBoliviaPhone(phone: string): PhoneNumber {
    const regex = createParsePhoneNumberFunction("+591");
    return regex(phone);
}
