import { isValidLocationName } from "@/components/app_modules/server_users/validators/for_data/IdentityCardValidator";
import CardIcon from "@/icons/IdCard";
import TextField from "@/components/form/view/fields/TextField";
import ImageUploader from "@/components/form/view/attachment_fields/ImageUploader";
import { IdCard } from "../../../../server_users/models/PersonalDataFields";

interface Props {
    idCardForm: IdCard;
    setIdCardForm: (i: IdCard) => void;
}

const IdentityCardForm: React.FC<Props> = ({ idCardForm, setIdCardForm }) => {
    return (
        <div className="form-sub-container | max-width-60">
            <div>
                <h2 className="text icon-wrapper | medium-big bold lb">
                    <CardIcon /> Carnet de identidad
                </h2>
                <p className="text | light">
                    Estos datos se guardarán en tu perfil. Si los cambias,
                    también{" "}
                    <b>
                        se cambiarán en las solicitudes que ya fueron enviadas.
                    </b>
                </p>
            </div>
            <TextField
                field={{
                    values: idCardForm.location,
                    setter: (e) =>
                        setIdCardForm({ ...idCardForm, location: e }),
                    validator: isValidLocationName,
                }}
                legend="Localización"
            />
            <ImageUploader
                uploader={{
                    image: idCardForm.frontCard,
                    setImage: (i) =>
                        setIdCardForm({ ...idCardForm, frontCard: i }),
                }}
                content={{
                    id: `identify-card-front-image-1`,
                    legend: "Parte frontal de tu carnet de identidad",
                    imageInCircle: false,
                }}
            />
            <ImageUploader
                uploader={{
                    image: idCardForm.backCard,
                    setImage: (i) =>
                        setIdCardForm({ ...idCardForm, backCard: i }),
                }}
                content={{
                    id: `identify-card-back-image-2`,
                    legend: "Parte de atrás de tu carnet de identidad",
                    imageInCircle: false,
                }}
            />
        </div>
    );
};

export default IdentityCardForm;
