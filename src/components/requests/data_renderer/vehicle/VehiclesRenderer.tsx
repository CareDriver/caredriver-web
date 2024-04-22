import { Vehicle } from "@/interfaces/UserRequest";
import VehicleRenderer from "./VehicleRenderer";

const VehiclesRenderer = ({ vehicles }: { vehicles: Vehicle[] }) => {
    return (
        <>
            {vehicles.map((vehicle, i) => (
                <VehicleRenderer vehicle={vehicle} key={`vehicle-render-${i}`} />
            ))}
        </>
    );
};

export default VehiclesRenderer;
