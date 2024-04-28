export interface ImgWithRef {
    ref: string;
    url: string;
}

export const emptyPhotoWithRef: ImgWithRef = {
    ref: "",
    url: "",
};

export const IMG_DELETED = {
    ref: "deleted",
    url: "",
}