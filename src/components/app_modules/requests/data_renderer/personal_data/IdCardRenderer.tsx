import IdCard from "@/icons/IdCard";
import InputData from "../form/InputData";
import { IdentityCard } from "@/interfaces/UserInterface";
import FieldDeleted from "../../../../form/view/field_renderers/FieldDeleted";
import ImageRenderer from "../form/ImageRenderer";
import InpurDate from "../form/InpurDate";

const IdCardRenderer = ({ idCard }: { idCard: IdentityCard | undefined }) => {
    return (
        <div className="form-sub-container | margin-top-25">
            <h2 className="text icon-wrapper | medium-big bold lb">
                <IdCard />
                Carnet de identidad
            </h2>

            {idCard ? (
                <div className="form-sub-container">
                    <fieldset className="form-section">
                        <InputData content={idCard.location} placeholder="Localización" />
                        <legend className="form-section-legend">Localización</legend>
                    </fieldset>
                    <fieldset className="form-section">
                        <InpurDate date={idCard.updatedDate.toDate()} />
                        <legend className="form-section-legend">
                            Ultima modificación
                        </legend>
                    </fieldset>
                    <ImageRenderer
                        url={idCard.frontCard}
                        placeholder="Parte Frontal del carnet de Identidad"
                        isCircle={false}
                        noFoundDescr={"Imagen no encontrada, probablemente fue borrada"}
                    />
                    <ImageRenderer
                        url={idCard.backCard}
                        placeholder="Parte de Atras del carnet de Identidad"
                        isCircle={false}
                        noFoundDescr={"Imagen no encontrada, probablemente fue borrada"}
                    />
                </div>
            ) : (
                <FieldDeleted description="El usuario no tiene carnet de identidad" />
            )}
        </div>
    );
};

export default IdCardRenderer;
