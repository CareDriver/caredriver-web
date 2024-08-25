import { Vehicle } from "@/interfaces/UserRequest";
import VehicleRendererWithCategory from "./VehicleRendererWithCategory";

const VehiclesWithCategoryRenderer = ({
    vehicles,
}: {
    vehicles: Vehicle[];
}) => {
    return (
        <>
            {vehicles.map((vehicle, i) => (
                <VehicleRendererWithCategory
                    vehicle={vehicle}
                    key={`vehicle-render-${i}`}
                />
            ))}
        </>
    );
};

export default VehiclesWithCategoryRenderer;
