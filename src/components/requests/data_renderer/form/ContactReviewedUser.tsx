import Envelope from "@/icons/Envelope";
import Phone from "@/icons/Phone";
import Whatsapp from "@/icons/Whatsapp";
import { UserInterface } from "@/interfaces/UserInterface";
import { getGreeting } from "@/utils/contact/Content";
import { sendEmail, sendWhatsapp } from "@/utils/contact/Sender";
import { toast } from "react-toastify";

const ContactReviewedUser = ({
    user,
    transmitter,
}: {
    user: UserInterface;
    transmitter: string;
}) => {
    const contactByEmail = () => {
        if (user.email) {
            const subject = "CAReDriver - Revision de su solicitud";
            const message = `${getGreeting()}\n\n soy el administrador ${transmitter} de la aplicación CAReDriver, me comunico con usted para `;
            sendEmail(user.email, subject, message);
        } else {
            toast.error("El usuario no tiene registrado su correo electrónico");
        }
    };

    const contactByWhatsapp = () => {
        const message = `${getGreeting()}\n\n soy el administrador ${transmitter} de la aplicación CAReDriver, me comunico con usted para `;
        sendWhatsapp(user.phoneNumber, message);
    };

    return (
        <div className="form-sub-container | margin-top-25 margin-bottom-25">
            <h2 className="text icon-wrapper | medium-big bold">
                <Phone />
                Formas de contacto con el usuario
            </h2>
            <div className="column-wrapper">
                <button
                    type="button"
                    onClick={contactByEmail}
                    className="icon-wrapper text general-button | red white-icon bolder mb"
                >
                    <Envelope /> Contactar por CORREO
                </button>
                <button
                    type="button"
                    onClick={contactByWhatsapp}
                    className="icon-wrapper text general-button | white-icon bolder mb"
                >
                    <Whatsapp /> Contactar por WhatsApp
                </button>
            </div>
        </div>
    );
};

export default ContactReviewedUser;
