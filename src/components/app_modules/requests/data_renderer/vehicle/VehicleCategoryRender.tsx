import Car from "@/icons/Car";
import InputData from "../form/InputData";

const VehicleCategoryRender = ({ category }: { category: string }) => {
    return (
        <div className="form-sub-container | margin-top-25">
            <h2 className="text icon-wrapper | medium-big bold">
                <Car /> Categoria del vehículo
            </h2>
            <fieldset className="form-section">
                <InputData content={category} placeholder={undefined} />
                <legend className="form-section-legend">Categoria</legend>
            </fieldset>
        </div>
    );
};

export default VehicleCategoryRender;
