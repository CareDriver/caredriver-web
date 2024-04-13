export const isImageBase64 = (str: string): boolean => {
    const regex = /^data:image\/(png|jpg|jpeg|gif);base64,([A-Za-z0-9+/]+={0,2})$/;
    return regex.test(str);
};
