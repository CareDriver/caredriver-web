import { Vehicle } from "@/interfaces/UserRequest";
import LicenseReviewForm from "../for_licenses/LicenseReviewForm";
import TextFieldRenderer from "@/components/form/view/field_renderers/TextFieldRenderer";
import { TRANSMITION_TO_SPANISH_V2 } from "@/components/app_modules/server_users/models/VehicleFields";
import VehicleCategoryRenderer from "./VehicleCategoryRenderer";

const VehicleRendererWithCategory = ({ vehicle }: { vehicle: Vehicle }) => {
  return (
    <div className="form-sub-container">
      <VehicleCategoryRenderer category={vehicle.type.type} />
      {vehicle.type.mode.map((mode, i) => (
        <TextFieldRenderer
          key={`vehicle-mode-${i}`}
          content={`Transmisión ${TRANSMITION_TO_SPANISH_V2[mode]}`}
          legend={"Transmisión"}
        />
      ))}
      <TextFieldRenderer
        content={vehicle.license.requireGlasses ? "Sí" : "No"}
        legend={"Requiere lentes"}
      />
      <TextFieldRenderer
        content={vehicle.license.requireHeadphones ? "Sí" : "No"}
        legend={"Requiere audífonos"}
      />
      <LicenseReviewForm license={vehicle.license} />
    </div>
  );
};

export default VehicleRendererWithCategory;
