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
            className="form-sub-container | row | margin-top-25"
        >
            <input type="checkbox" checked={isAcceptedTerms} onChange={() => {}} />
            <p>
                Acepto las Politicas de Privacidad, Terminos y Condiciones de Uso, recibir
                comunicaciones de CaReDriver y chatear con nosotros por WhatsApp
            </p>
        </div>
    );
};

export default TermsCheckForm;
