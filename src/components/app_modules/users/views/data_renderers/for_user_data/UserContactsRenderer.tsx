import Envelope from "@/icons/Envelope";
import Whatsapp from "@/icons/Whatsapp";
import {
    contactUserByEmail,
    contactUserByWhatsapp,
} from "../../../utils/UserContactService";

interface Props {
    email?: string;
    phoneNumber?: string;
    alternativePhoneNumber?: string;
}

const UserContactsRenderer: React.FC<Props> = ({
    email,
    phoneNumber,
    alternativePhoneNumber,
}) => {
    if (!email && !phoneNumber) {
        return;
    }

    return (
        <div className="use-circle-rcontacts row-wrapper margin-top-25">
            {phoneNumber && (
                <button
                    type="button"
                    onClick={() => contactUserByWhatsapp(phoneNumber)}
                    className="icon-wrapper text circle-button | green white-icon lb touchable"
                >
                    <div className="triangle green"></div>
                    <Whatsapp />
                </button>
            )}
            {alternativePhoneNumber && (
                <button
                    type="button"
                    onClick={() =>
                        contactUserByWhatsapp(alternativePhoneNumber)
                    }
                    className="icon-wrapper text circle-button | green white-icon lb touchable"
                >
                    <div className="triangle green"></div>
                    <Whatsapp />
                </button>
            )}
            {email && (
                <button
                    type="button"
                    onClick={() => contactUserByEmail(email)}
                    className="icon-wrapper text circle-button | red white-icon bold lb touchable"
                >
                    <div className="triangle red"></div>
                    <Envelope />
                </button>
            )}
        </div>
    );
};

export default UserContactsRenderer;
