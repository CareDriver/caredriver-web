import Car from "@/icons/Car";
import { Vehicle } from "@/interfaces/UserRequest";
import InputData from "../form/InputData";
import LicenseRenderer from "./LicenseRenderer";

const VehicleRenderer = ({ vehicle }: { vehicle: Vehicle }) => {
    return (
        <div className="form-sub-container">
            <h2 className="text icon-wrapper | medium-big bold">
                <Car /> Tipo de Vehiculo
            </h2>
            <InputData content={vehicle.type.type} placeholder={undefined} />
            {vehicle.type.mode.map((mode, i) => (
                <InputData
                    content={mode}
                    key={`vehicle-mode-${i}`}
                    placeholder={undefined}
                />
            ))}
            <LicenseRenderer license={vehicle.license} />
        </div>
    );
};

export default VehicleRenderer;
