import { useState } from "react";
import PhoneField from "@/components/form/view/fields/PhoneField";
import { TextField as TextFieldForm } from "@/components/form/models/FormFields";
import PrivacyTermsSection from "@/components/form/view/sections/PrivacyTermsSection";
import { isPhoneValid } from "@/components/app_modules/users/validators/for_data/CredentialsValidator";

interface PhoneConfirmationModalProps {
  phoneNumber?: string;
  isOpen: boolean;
  onConfirm: (phone?: string) => void;
  onEdit: () => void;
  isLoading?: boolean;
  editable?: boolean;
  editableValues?: TextFieldForm;
  editableSetter?: (val: TextFieldForm) => void;
}

const PhoneConfirmationModal = ({
  phoneNumber = "",
  isOpen,
  onConfirm,
  onEdit,
  isLoading = false,
  editable = false,
  editableValues,
  editableSetter,
}: PhoneConfirmationModalProps) => {
  const [internalPhone, setInternalPhone] = useState<TextFieldForm | null>(
    editableValues ?? null,
  );
  const [acceptTerms, setAcceptTerms] = useState(false);

  if (!isOpen) return null;

  const phoneToShow = editable
    ? editableValues
      ? editableValues.value
      : internalPhone
        ? internalPhone.value
        : ""
    : phoneNumber;

  const handleConfirm = () => {
    const finalPhone = editable
      ? editableValues
        ? editableValues.value
        : internalPhone
          ? internalPhone.value
          : phoneToShow
      : phoneToShow;

    onConfirm(finalPhone);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="text | bold">Confirma tu número de teléfono</h2>
          <p className="text | light">
            Este número será tu punto de contacto principal con CareDriver
          </p>
        </div>

        <div className="modal-content">
          {editable ? (
            <div style={{ marginBottom: "1rem" }}>
              <PhoneField
                values={editableValues ?? (internalPhone as any)}
                setter={
                  editableSetter
                    ? editableSetter
                    : (val: TextFieldForm) => setInternalPhone(val)
                }
              />

              <br />
              <br />
              <PrivacyTermsSection
                isCheck={acceptTerms}
                setCheck={setAcceptTerms}
              />
            </div>
          ) : (
            <div className="phone-display">
              <p className="text | light">Tu número de teléfono:</p>
              <p className="phone-number text | bold">
                {phoneToShow || "(no ingresado)"}
              </p>
            </div>
          )}

          <div className="modal-text-section">
            <p className="text | light">Utilizaremos este número para:</p>
            <ul className="phone-usage-list">
              <li className="text | light">
                ✓ Enviarte códigos de verificación de seguridad
              </li>
              <li className="text | light">
                ✓ Notificarte sobre tus solicitudes de servicio
              </li>
              <li className="text | light">
                ✓ Coordinación con el personal de CareDriver
              </li>
              <li className="text | light">✓ Soporte y atención al cliente</li>
              <li className="text | light">
                ✓ Comunicaciones operativas importantes
              </li>
            </ul>
          </div>

          <div className="modal-disclaimer">
            <p className="text | light">
              Al confirmar, aceptas que CareDriver se comunique contigo a través
              de este número. Puedes cambiar esta preferencia en tu perfil
              después del registro.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          {!editable && (
            <button
              onClick={onEdit}
              disabled={isLoading}
              className="general-button gray | modal-button-secondary"
            >
              Editar número
            </button>
          )}
          <button
            onClick={handleConfirm}
            disabled={
              isLoading ||
              !isPhoneValid(phoneNumber).isValid ||
              (editable && !acceptTerms)
            }
            className="general-button | modal-button-primary"
          >
            {isLoading ? "Creando cuenta..." : "Confirmar y crear"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneConfirmationModal;
