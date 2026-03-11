import {
  NAME_BUSINESS,
  POLICY_AND_PRIVACY,
  SECURITY_TERMS,
} from "@/models/Business";
import CheckField from "../fields/CheckField";

interface Props {
  isCheck: boolean;
  setCheck: (state: boolean) => void;
}

const PrivacyTermsSection: React.FC<Props> = ({ isCheck, setCheck }) => {
  const PRIVACY_TEMS = (
    <p className="text | light">
      Acepto las{" "}
      <a
        className="text | bold underline"
        href={POLICY_AND_PRIVACY}
        target="_blank"
      >
        políticas de privacidad
      </a>
      ,{" "}
      <a
        className="text | bold underline"
        href={SECURITY_TERMS}
        target="_blank"
      >
        términos y condiciones
      </a>
      , recibir comunicaciones de {NAME_BUSINESS} y chatear con nosotros por
      WhatsApp.
    </p>
  );

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
