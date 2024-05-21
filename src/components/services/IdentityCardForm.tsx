import { IdCardForm, PhotoField } from "./FormModels";
import { isValidLocationName } from "@/utils/validator/service_requests/IdentityCardValidator";
import ImageUploader from "../form/ImageUploader";
import IdCard from "@/icons/IdCard";

const IdentityCardForm = ({
    idCardForm,
    setIdCardForm,
}: {
    idCardForm: IdCardForm;
    setIdCardForm: (idCardForm: IdCardForm) => void;
}) => {
    return (
        <div className="form-sub-container | max-width-60">
            <div>
                <h2 className="text icon-wrapper | medium-big bold lb">
                    <IdCard /> Carnet de identidad
                </h2>
                <p className="text | light">
                    Estos datos se guardaran en tu perfil, si los cambias a los que ya existen
                    <b> afectara a las solicitudes que ya fueron enviadas</b>.
                </p>
            </div>
            <fieldset className="form-section">
                <input
                    type="text"
                    placeholder=""
                    value={idCardForm.location.value}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        const { isValid, message } = isValidLocationName(newValue);
                        setIdCardForm({
                            ...idCardForm,
                            location: {
                                value: newValue,
                                message: isValid ? null : message,
                            },
                        });
                    }}
                    className="form-section-input"
                />
                <legend className="form-section-legend">Localizacion</legend>
                {idCardForm.location.message && (
                    <small>{idCardForm.location.message}</small>
                )}
            </fieldset>
            <ImageUploader
                uploader={{
                    image: idCardForm.frontCard,
                    setImage: (image: PhotoField) => {
                        setIdCardForm({
                            ...idCardForm,
                            frontCard: image,
                        });
                    },
                }}
                content={{
                    indicator: "Parte Frontal de tu carnet de Identidad",
                    isCircle: false,
                    id: `identify-card-front-image-1`,
                }}
            />
            <ImageUploader
                uploader={{
                    image: idCardForm.backCard,
                    setImage: (image: PhotoField) => {
                        setIdCardForm({
                            ...idCardForm,
                            backCard: image,
                        });
                    },
                }}
                content={{
                    indicator: "Parte de Atras de tu carnet de Identidad",
                    isCircle: false,
                    id: `identify-card-back-image-2`,
                }}
            />
        </div>
    );
};

export default IdentityCardForm;
