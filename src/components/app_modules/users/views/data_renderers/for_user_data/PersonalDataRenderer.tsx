import UserIcon from "@/icons/UserIcon";
import ImageRenderer from "../../../../../form/view/field_renderers/ImageRenderer";
import { RefAttachment } from "@/components/form/models/RefAttachment";
import TextFieldRenderer from "@/components/form/view/field_renderers/TextFieldRenderer";
import { DEFAULT_PHOTO } from "../../../models/MissingUserData";

interface Props {
  name: string;
  photo: string | RefAttachment;
  location: string | undefined;
  children?: React.ReactNode;
}

const PersonalDataRenderer: React.FC<Props> = ({
  name,
  photo,
  location,
  children,
}) => {
  return (
    <div className="form-sub-container | margin-top-25">
      <h2 className="text icon-wrapper | medium-big bold">
        <UserIcon />
        Datos Personales
      </h2>

      <div className="form-sub-container">
        <TextFieldRenderer content={name} legend="Nombre completo" />
        <TextFieldRenderer content={location} legend="Localización" />

        <ImageRenderer
          content={{
            image: photo,
            legend: "Foto de perfil",
            noFoundReason: "El usuario no tiene foto de perfil",
            defaultImage: DEFAULT_PHOTO,
          }}
          imageInCircle={true}
        />
        {children && <>{children}</>}
      </div>
    </div>
  );
};

export default PersonalDataRenderer;
