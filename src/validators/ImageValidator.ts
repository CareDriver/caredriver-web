import { RefAttachment } from "@/components/form/models/RefAttachment";

export const isImageBase64 = (str: string): boolean => {
  const regex =
    /^data:image\/(png|jpg|jpeg|gif);base64,([A-Za-z0-9+/]+={0,2})$/;
  return regex.test(str);
};

export const getUrl = (image: string | RefAttachment): string => {
  return typeof image === "string" ? image : image.url;
};

export const isUrl = (image: string | RefAttachment) => {
  return typeof image === "string";
};
