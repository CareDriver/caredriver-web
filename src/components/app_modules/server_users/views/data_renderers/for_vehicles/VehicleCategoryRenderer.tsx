import TextFieldRenderer from "@/components/form/view/field_renderers/TextFieldRenderer";
import Car from "@/icons/Car";

const VehicleCategoryRenderer = ({ category }: { category: string }) => {
    return (
        <div className="form-sub-container | margin-top-25">
            <h2 className="text icon-wrapper | medium-big bold">
                <Car /> Categoria del vehículo
            </h2>
            <TextFieldRenderer content={category} legend="Categoria" />
        </div>
    );
};

export default VehicleCategoryRenderer;
