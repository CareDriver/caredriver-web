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
            const message = `${getGreeting()}\n\n soy el administrador ${transmitter} de la aplicacion CAReDriver, me comunico con usted para `;
            sendEmail(user.email, subject, message);
        } else {
            toast.error("El usuario no tiene registrado su correo electronico");
        }
    };

    const contactByWhatsapp = () => {
        const message = `${getGreeting()}\n\n soy el administrador ${transmitter} de la aplicacion CAReDriver, me comunico con usted para `;
        sendWhatsapp(user.phoneNumber, message);
    };

    return (
        <div className="form-sub-container | margin-top-25">
            <h2 className="text icon-wrapper | medium-big bold">
                <Phone />
                Datos Personales
            </h2>
            <div>
                <button
                    type="button"
                    onClick={contactByEmail}
                    className="icon-wrapper text | bolder lb"
                >
                    <Envelope /> Contactar por Email
                </button>
                <button
                    type="button"
                    onClick={contactByWhatsapp}
                    className="icon-wrapper text | bolder lb"
                >
                    <Whatsapp /> Contactar por Whatsapp
                </button>
            </div>
        </div>
    );
};

export default ContactReviewedUser;
