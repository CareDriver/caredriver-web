import { ImgWithRef } from "./ImageInterface";

export interface ChangePhotoReqInterface {
    id: string;
    userId: string;
    newPhoto: ImgWithRef;
    userName: string;
    active: boolean
}
