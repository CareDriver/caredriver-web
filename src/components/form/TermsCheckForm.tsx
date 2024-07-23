import { Dispatch, SetStateAction } from "react";

const TermsCheckForm = ({
    isAcceptedTerms,
    setAcceptedTerms,
}: {
    isAcceptedTerms: boolean;
    setAcceptedTerms: Dispatch<SetStateAction<boolean>>;
}) => {
    return (
        <div
            onClick={() => setAcceptedTerms(!isAcceptedTerms)}
            className="form-sub-container | row | margin-top-25 max-width-60 pointer-option"
        >
            <input type="checkbox" checked={isAcceptedTerms} onChange={() => {}} />
            <p>
                Acepto las políticas de privacidad, términos y condiciones de uso, recibir
                comunicaciones de CaReDriver y chatear con nosotros por WhatsApp.
            </p>
        </div>
    );
};

export default TermsCheckForm;
