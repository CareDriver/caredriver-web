import {
    TRANSMITION_TO_SPANISH,
    VEHICLE_CATEGORY_TO_SPANISH,
} from "@/components/app_modules/server_users/models/VehicleFields";
import Car from "@/icons/Car";
import {
    getVehicleSizeLabel,
    VehicleInterface,
} from "@/interfaces/VehicleInterface";
import { isNullOrEmptyText } from "@/validators/TextValidator";

interface Props {
    vehicle: VehicleInterface | undefined | null;
    titleSection: string;
}

const VehicleDetailRenderer: React.FC<Props> = ({ vehicle, titleSection }) => {
    return (
        vehicle && (
            <div className="margin-bottom-25">
                <h2 className="text icon-wrapper |  medium-big bolder margin-bottom-15">
                    <Car />
                    {titleSection}
                </h2>
                <div className="column-wrapper margin-bottom-50">
                    {vehicle.type && (
                        <span className="text">
                            <b>Categoria: </b>{" "}
                            {VEHICLE_CATEGORY_TO_SPANISH[vehicle.type]}
                        </span>
                    )}
                    <span className="text">
                        <b>Nombre: </b>
                        {vehicle?.name}
                    </span>

                    {!isNullOrEmptyText(vehicle.description) && (
                        <span className="text">
                            <b>Descripcion: </b> {vehicle?.description}
                        </span>
                    )}
                    {vehicle?.transmission && (
                        <span className="text">
                            <b>Transmisión: </b>{" "}
                            {TRANSMITION_TO_SPANISH[vehicle?.transmission]}
                        </span>
                    )}
                    {vehicle?.usedTimes && (
                        <span className="text">
                            <b>Veces usadas: </b> {vehicle?.usedTimes}
                        </span>
                    )}
                    {vehicle?.size && (
                        <span className="text">
                            <b>Tamaño: </b> {getVehicleSizeLabel[vehicle.size]}
                        </span>
                    )}
                </div>
                <div className="max-width-50">
                    <div className="separator-horizontal"></div>
                </div>
            </div>
        )
    );
};

export default VehicleDetailRenderer;
