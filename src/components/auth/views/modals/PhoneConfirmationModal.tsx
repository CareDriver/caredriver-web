interface PhoneConfirmationModalProps {
  phoneNumber: string;
  isOpen: boolean;
  onConfirm: () => void;
  onEdit: () => void;
  isLoading?: boolean;
}

const PhoneConfirmationModal = ({
  phoneNumber,
  isOpen,
  onConfirm,
  onEdit,
  isLoading = false,
}: PhoneConfirmationModalProps) => {
  if (!isOpen) return null;

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
          <div className="phone-display">
            <p className="text | light">Tu número de teléfono:</p>
            <p className="phone-number text | bold">
              {phoneNumber ? phoneNumber.replace("+591", "") : "(no ingresado)"}
            </p>
          </div>

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
          <button
            onClick={onEdit}
            disabled={isLoading}
            className="general-button gray | modal-button-secondary"
          >
            Editar número
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
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
