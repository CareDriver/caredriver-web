import { RefAttachment } from "../components/form/models/RefAttachment";

export interface ChangePhotoReqInterface {
  id: string;
  userId: string;
  newPhoto: RefAttachment;
  userName: string;
  active: boolean;
}
