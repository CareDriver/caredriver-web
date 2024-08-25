const SECRET_KEY = "28b173e";

const xorAlgorithm = (text: string, key: string): string => {
    const textChars = text.split("").map((char) => char.charCodeAt(0));
    const keyChars = key.split("").map((char) => char.charCodeAt(0));
    const keyLength = key.length;

    const resultChars = textChars.map((char, index) => {
        return char ^ keyChars[index % keyLength];
    });

    return resultChars.map((char) => String.fromCharCode(char)).join("");
};

export const encrypt = (value: string): string => {
    return xorAlgorithm(value, SECRET_KEY);
};

export const decrypt = (encryptedValue: string): string => {
    return xorAlgorithm(encryptedValue, SECRET_KEY);
};
