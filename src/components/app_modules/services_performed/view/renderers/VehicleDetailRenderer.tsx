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
        <h2 className="text icon-wrapper |  medium-big bold margin-bottom-15">
          <Car />
          {titleSection}
        </h2>
        <div className="column-wrapper margin-bottom-50">
          {vehicle.type && (
            <span className="text | wrap">
              <b>Categoria: </b> {VEHICLE_CATEGORY_TO_SPANISH[vehicle.type]}
            </span>
          )}
          <span className="text | wrap">
            <b>Nombre: </b>
            {vehicle?.name}
          </span>

          {!isNullOrEmptyText(vehicle.description) && (
            <span className="text | wrap">
              <b>Descripcion: </b> {vehicle?.description}
            </span>
          )}
          {vehicle?.transmission && (
            <span className="text | wrap">
              <b>Transmisión: </b>{" "}
              {TRANSMITION_TO_SPANISH[vehicle?.transmission]}
            </span>
          )}
          {vehicle?.usedTimes && (
            <span className="text | wrap">
              <b>Veces usadas: </b> {vehicle?.usedTimes}
            </span>
          )}
          {vehicle?.size && (
            <span className="text | wrap">
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
