import IdCard from "@/icons/IdCard";
import { IdentityCard } from "@/interfaces/UserInterface";
import FieldDeleted from "../../../../../form/view/field_renderers/FieldDeleted";
import ImageRenderer from "../../../../../form/view/field_renderers/ImageRenderer";
import DateFieldRenderer from "../../../../../form/view/field_renderers/DateFieldRenderer";
import TextFieldRenderer from "@/components/form/view/field_renderers/TextFieldRenderer";

const IdCardRenderer = ({ idCard }: { idCard: IdentityCard | undefined }) => {
  console.log(idCard);
  return (
    <div className="form-sub-container | margin-top-25">
      <h2 className="text icon-wrapper | medium-big bold lb">
        <IdCard />
        Carnet de identidad
      </h2>

      {idCard ? (
        <div className="form-sub-container">
          <TextFieldRenderer content={idCard.location} legend="Localización" />

          <DateFieldRenderer
            date={idCard.updatedDate}
            legend="Ultima modificación"
          />

          <ImageRenderer
            content={{
              image: idCard.frontCard,
              legend: "Parte Frontal del carnet de Identidad",
            }}
            imageInCircle={false}
          />
          <ImageRenderer
            content={{
              image: idCard.backCard,
              legend: "Parte de Atrás del carnet de Identidad",
            }}
            imageInCircle={false}
          />
        </div>
      ) : (
        <FieldDeleted description="El usuario no tiene carnet de identidad" />
      )}
    </div>
  );
};

export default IdCardRenderer;
