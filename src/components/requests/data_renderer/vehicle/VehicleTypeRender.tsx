import Car from "@/icons/Car";
import InputData from "../form/InputData";
import { VehicleType, vehicleTypeRender } from "@/interfaces/VehicleInterface";

const VehicleTypeRender = ({ type }: { type: VehicleType }) => {
    return (
        <div className="form-sub-container | margin-top-50">
            <h2 className="text icon-wrapper | medium-big bold">
                <Car /> Tipo de Vehiculo
            </h2>
            <fieldset className="form-section">
                <InputData content={vehicleTypeRender[type]} placeholder={undefined} />
                <legend className="form-section-legend">Categoria</legend>
            </fieldset>
        </div>
    );
};

export default VehicleTypeRender;
