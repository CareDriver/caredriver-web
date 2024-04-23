import { ImgWithRef } from "@/interfaces/ImageInterface";

export const isImageBase64 = (str: string): boolean => {
    const regex = /^data:image\/(png|jpg|jpeg|gif);base64,([A-Za-z0-9+/]+={0,2})$/;
    return regex.test(str);
};

export const getUrl = (image: string | ImgWithRef) : string => {
    return typeof image === "string" ? image : image.url;
};

export const isUrl = (image: string | ImgWithRef) => {
    return typeof image === "string";
};
