import Car from "@/icons/Car";
import { Vehicle } from "@/interfaces/UserRequest";
import InputData from "../form/InputData";
import LicenseRenderer from "./LicenseRenderer";
import VehicleTypeRender from "./VehicleTypeRender";
import { vehicleModeRender } from "@/interfaces/VehicleInterface";

const VehicleRenderer = ({ vehicle }: { vehicle: Vehicle }) => {
    return (
        <div className="form-sub-container">
            <VehicleTypeRender type={vehicle.type.type} />
            {vehicle.type.mode.map((mode, i) => (
                <fieldset className="form-section" key={`vehicle-mode-${i}`}>
                    <InputData
                        content={vehicleModeRender[mode]}
                        placeholder={undefined}
                    />
                    <legend className="form-section-legend">
                        Transmisión {vehicle.type.mode.length > 1 && i + 1}
                    </legend>
                </fieldset>
            ))}
            <LicenseRenderer license={vehicle.license} />
        </div>
    );
};

export default VehicleRenderer;
