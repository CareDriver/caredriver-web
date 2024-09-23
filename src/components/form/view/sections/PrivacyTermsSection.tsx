import { NAME_BUSINESS } from "@/models/Business";
import CheckField from "../fields/CheckField";

interface Props {
    isCheck: boolean;
    setCheck: (state: boolean) => void;
}

const PrivacyTermsSection: React.FC<Props> = ({ isCheck, setCheck }) => {
    const PRIVACY_TEMS = `Acepto las políticas de privacidad, términos y condiciones de uso, recibir comunicaciones de ${NAME_BUSINESS} y chatear con nosotros por WhatsApp.`;

    return (
        <CheckField
            marker={{
                isCheck: isCheck,
                setCheck: setCheck,
            }}
            content={{
                checkDescription: PRIVACY_TEMS,
            }}
        />
    );
};

export default PrivacyTermsSection;
