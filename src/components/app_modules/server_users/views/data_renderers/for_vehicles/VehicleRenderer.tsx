import {
  TRANSMITION_TO_SPANISH_V2,
  VEHICLE_CATEGORY_TO_SPANISH_WITH_ARTICLE,
} from "@/components/app_modules/server_users/models/VehicleFields";
import FieldDeleted from "@/components/form/view/field_renderers/FieldDeleted";
import TextFieldRenderer from "@/components/form/view/field_renderers/TextFieldRenderer";
import Car from "@/icons/Car";
import { Vehicle } from "@/interfaces/UserRequest";
import LicenseReviewForm from "../for_licenses/LicenseReviewForm";

interface Props {
  vehicle: Vehicle | undefined;
  type: "car" | "motorcycle" | "tow";
}

const VehicleRenderer: React.FC<Props> = ({ vehicle, type }) => {
  if (!vehicle) {
    return (
      <FieldDeleted
        description={`El usuario no tiene registrado información ${VEHICLE_CATEGORY_TO_SPANISH_WITH_ARTICLE[type]}`}
      />
    );
  }

  return (
    <div className="form-sub-container">
      <h2 className="text icon-wrapper | lb medium-big bold margin-top-25">
        <Car /> Transmisión
      </h2>
      {vehicle.type.mode.map((mode, i) => (
        <TextFieldRenderer
          key={`vehicle-mode-${i}`}
          content={`Transmisión ${TRANSMITION_TO_SPANISH_V2[mode]}`}
          legend={"Transmisión"}
        />
      ))}

      <LicenseReviewForm license={vehicle.license} />
    </div>
  );
};

export default VehicleRenderer;
