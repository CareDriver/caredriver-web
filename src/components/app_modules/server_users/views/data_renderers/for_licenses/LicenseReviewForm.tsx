import AddressCar from "@/icons/AddressCar";
import {
  LicenseInterface,
  LicenseUpdateReq,
} from "@/interfaces/PersonalDocumentsInterface";
import DateFieldRenderer from "../../../../../form/view/field_renderers/DateFieldRenderer";
import ImageRenderer from "../../../../../form/view/field_renderers/ImageRenderer";
import TextFieldRenderer from "@/components/form/view/field_renderers/TextFieldRenderer";
import { getLicenseCategoryLabel } from "@/interfaces/LicenseCategories";

const LicenseReviewForm = ({
  license,
}: {
  license: LicenseInterface | LicenseUpdateReq;
}) => {
  return (
    <div className="form-sub-container">
      <h2 className="text icon-wrapper | lb medium-big bold margin-top-25">
        <AddressCar /> Licencia
      </h2>
      <TextFieldRenderer
        content={getLicenseCategoryLabel(license.category)}
        legend="Categoría"
      />
      <TextFieldRenderer
        content={license.licenseNumber}
        legend="Número de la licencia"
      />
      <DateFieldRenderer
        date={license.expiredDateLicense}
        legend="Fecha de expiración"
      />
      <TextFieldRenderer
        content={license.requireGlasses ? "Sí" : "No"}
        legend="Requiere lentes"
      />
      <TextFieldRenderer
        content={license.requireHeadphones ? "Sí" : "No"}
        legend="Requiere audífonos"
      />
      <ImageRenderer
        content={{
          image: license.frontImgUrl,
          legend: "Parte frontal de la licencia",
        }}
        imageInCircle={false}
      />
      <ImageRenderer
        content={{
          image: license.backImgUrl,
          legend: "Parte posterior de la licencia",
        }}
        imageInCircle={false}
      />
    </div>
  );
};

export default LicenseReviewForm;
