import {
    DEFAUL_ATTACHMENT_FIELD,
    DEFAUL_TEXT_FIELD,
    DEFAUL_VERIFICATION_CODE_FIELD,
} from "@/components/form/models/DefaultFields";
import { SignUp, SignUpWithRoleAndPhoto } from "./SignUpSignatures";
import { Locations } from "@/interfaces/Locations";
import { UserRole } from "@/interfaces/UserInterface";

export const DEFAULT_SIGN_UP: SignUp = {
    fullName: DEFAUL_TEXT_FIELD,
    phone: DEFAUL_TEXT_FIELD,
    email: DEFAUL_TEXT_FIELD,
    password: DEFAUL_TEXT_FIELD,
    code: DEFAUL_VERIFICATION_CODE_FIELD,
    location: Locations.CochabambaBolivia,
};

export const DEFAULT_SING_UP_WITH_ROLE_AND_PHOTO: SignUpWithRoleAndPhoto = {
    ...DEFAULT_SIGN_UP,
    role: UserRole.Support,
    photo: DEFAUL_ATTACHMENT_FIELD,
};
