import { Locations } from "@/interfaces/Locations";
import { UserRole } from "@/interfaces/UserInterface";
import {
    AttachmentField,
    TextField,
    VerificationCodeField,
} from "@/components/form/models/FormFields";

export interface SignUp {
    fullName: TextField;
    phone: TextField;
    email: TextField;
    password: TextField;
    location: Locations;
    code: VerificationCodeField;
}

export interface SignUpWithRoleAndPhoto extends SignUp {
    role: UserRole;
    photo: AttachmentField;
}
