import { DEFAUL_TEXT_FIELD, DEFAUL_ATTACHMENT_FIELD } from "@/components/form/models/DefaultFields";
import {
    AttachmentField,
    TextField,
} from "@/components/form/models/FormFields";

export interface IdCard {
    frontCard: AttachmentField;
    backCard: AttachmentField;
    location: TextField;
}

export interface PersonalData {
    fullname: TextField;
    photo: AttachmentField;
    idCard: IdCard;
}

export const DEFAULT_ID_CARD: IdCard = {
    frontCard: DEFAUL_ATTACHMENT_FIELD,
    backCard: DEFAUL_ATTACHMENT_FIELD,
    location: DEFAUL_TEXT_FIELD
}

export const DEFAULT_PERSONAL_DATA: PersonalData = {
    fullname: DEFAUL_TEXT_FIELD,
    photo: DEFAUL_ATTACHMENT_FIELD,
    idCard: DEFAULT_ID_CARD
}