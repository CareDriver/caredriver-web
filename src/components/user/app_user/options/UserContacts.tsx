import Envelope from "@/icons/Envelope";
import Whatsapp from "@/icons/Whatsapp";
import { UserInterface } from "@/interfaces/UserInterface";
import { getGreeting } from "@/utils/contact/Content";
import { sendEmail, sendWhatsapp } from "@/utils/contact/Sender";
import { toast } from "react-toastify";

const UserContacts = ({
    reviewUserName,
    user,
}: {
    reviewUserName: string;
    user: UserInterface;
}) => {
    const contactByEmail = () => {
        if (user.email) {
            const subject = "CAReDriver - Revision de su solicitud";
            const message = `${getGreeting()}\n\n soy el administrador ${reviewUserName} de la aplicacion CAReDriver, me comunico con usted para `;
            sendEmail(user.email, subject, message);
        } else {
            toast.error("El usuario no tiene registrado su correo electronico");
        }
    };

    const contactByWhatsapp = () => {
        const message = `${getGreeting()}\n\n soy el administrador ${reviewUserName} de la aplicacion CAReDriver, me comunico con usted para `;
        sendWhatsapp(user.phoneNumber, message);
    };

    return (
        <div className="column-wrapper">
            <button
                type="button"
                onClick={contactByWhatsapp}
                className="icon-wrapper text circle-button | green white-icon lb"
            >
                <Whatsapp />
            </button>
            <button
                type="button"
                onClick={contactByEmail}
                className="icon-wrapper text circle-button | red white-icon bolder lb"
            >
                <Envelope />
            </button>
        </div>
    );
};

export default UserContacts;
