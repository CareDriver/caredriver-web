import Envelope from "@/icons/Envelope";
import Phone from "@/icons/Phone";
import Whatsapp from "@/icons/Whatsapp";
import {
    contactUserByEmail,
    contactUserByWhatsapp,
} from "../../../utils/UserContactService";

interface Props {
    email?: string;
    phoneNumber?: string;
}

const UserContactsRendererForForm: React.FC<Props> = ({ email, phoneNumber }) => {
    return (
        <div className="form-sub-container | margin-top-25 margin-bottom-25">
            <h2 className="text icon-wrapper | medium-big bold">
                <Phone />
                Formas de contacto con el usuario
            </h2>
            <div className="column-wrapper">
                {email && (
                    <button
                        type="button"
                        onClick={() => contactUserByEmail(email)}
                        className="icon-wrapper text general-button | red white-icon bolder mb"
                    >
                        <Envelope /> Contactar por Correo
                    </button>
                )}
                {phoneNumber && (
                    <button
                        type="button"
                        onClick={() => contactUserByWhatsapp(phoneNumber)}
                        className="icon-wrapper text general-button | white-icon bolder mb"
                    >
                        <Whatsapp /> Contactar por WhatsApp
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserContactsRendererForForm;
