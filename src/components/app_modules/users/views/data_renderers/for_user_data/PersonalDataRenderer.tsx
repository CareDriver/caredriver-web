import UserIcon from "@/icons/UserIcon";
import ImageRenderer from "../../../../../form/view/field_renderers/ImageRenderer";
import { RefAttachment } from "@/components/form/models/RefAttachment";
import TextFieldRenderer from "@/components/form/view/field_renderers/TextFieldRenderer";
import { DEFAULT_PHOTO } from "../../../models/MissingUserData";
import PoliceRecordsRenderer from "@/components/app_modules/server_users/views/data_renderers/for_police_records/PoliceRecordsRenderer";

interface Props {
  name: string;
  homeAddress: string;
  addressPhoto: string | RefAttachment;
  photo: string | RefAttachment;
  location: string | undefined;
  children?: React.ReactNode;
  bloodType?: string;
  alternativePhoneNumber: string;
  alternativePhoneNumberName: string;
  pdfRef?: RefAttachment;
}

const PersonalDataRenderer: React.FC<Props> = ({
  name,
  homeAddress,
  photo,
  addressPhoto,
  location,
  children,
  bloodType,
  alternativePhoneNumber,
  alternativePhoneNumberName,
  pdfRef,
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
        {bloodType && (
          <TextFieldRenderer content={bloodType} legend="Tipo de Sangre" />
        )}
        <TextFieldRenderer
          content={alternativePhoneNumberName}
          legend="Nombre del contacto de número alternativo"
        />

        <TextFieldRenderer
          content={alternativePhoneNumber}
          legend="Número alternativo"
        />

        <ImageRenderer
          content={{
            image: photo,
            legend: "Foto de perfil",
            noFoundReason: "El usuario no tiene foto de perfil",
            defaultImage: DEFAULT_PHOTO,
          }}
          imageInCircle={true}
        />

        <TextFieldRenderer
          content={homeAddress}
          legend="Dirección de Domicilio"
        />

        <ImageRenderer
          content={{
            image: addressPhoto,
            legend: "Foto de factura de luz",
            noFoundReason: "El usuario no subió una foto de factura de luz",
            defaultImage: DEFAULT_PHOTO,
          }}
          imageInCircle={false}
        />

        {pdfRef && <PoliceRecordsRenderer pdf={pdfRef} />}
        {children && <>{children}</>}
      </div>
    </div>
  );
};

export default PersonalDataRenderer;
