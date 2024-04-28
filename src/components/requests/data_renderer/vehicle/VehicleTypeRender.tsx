import Car from "@/icons/Car";
import InputData from "../form/InputData";
import { VehicleType } from "@/interfaces/VehicleInterface";

const VehicleTypeRender = ({ type }: { type: VehicleType }) => {
    return (
        <>
            <h2 className="text icon-wrapper | medium-big bold">
                <Car /> Tipo de Vehiculo
            </h2>
            <InputData content={type} placeholder={undefined} />
        </>
    );
};

export default VehicleTypeRender;
