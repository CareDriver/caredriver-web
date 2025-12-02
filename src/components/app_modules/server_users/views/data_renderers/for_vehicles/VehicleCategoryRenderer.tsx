import TextFieldRenderer from "@/components/form/view/field_renderers/TextFieldRenderer";
import Car from "@/icons/Car";
import { VEHICLE_CATEGORY_TO_SPANISH } from "../../../models/VehicleFields";
import { VehicleType } from "@/interfaces/VehicleInterface";

const VehicleCategoryRenderer = ({ category }: { category: VehicleType }) => {
  return (
    <div className="form-sub-container | margin-top-25">
      <h2 className="text icon-wrapper | medium-big bold">
        <Car /> Categoría del vehículo
      </h2>
      <TextFieldRenderer
        content={VEHICLE_CATEGORY_TO_SPANISH[category] ?? category}
        legend="Categoría"
      />
    </div>
  );
};

export default VehicleCategoryRenderer;
