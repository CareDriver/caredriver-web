import Car from "@/icons/Car";
import { Vehicle } from "@/interfaces/UserRequest";
import InputData from "../form/InputData";
import LicenseRenderer from "./LicenseRenderer";
import VehicleTypeRender from "./VehicleTypeRender";

const VehicleRenderer = ({ vehicle }: { vehicle: Vehicle }) => {
    return (
        <div className="form-sub-container">
            <VehicleTypeRender type={vehicle.type.type} />
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
