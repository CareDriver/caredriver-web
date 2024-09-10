import { Vehicle } from "@/interfaces/UserRequest";
import { MissingTransmissionAdder } from "../../../api/MissingTransmissionAdder";
import {
    getColorButtonLicense,
    getTransmissionsAsSpanish,
    getVehicleIconByType,
} from "../../../utils/ServicePanelHelper";
import { timestampDateInSpanish } from "@/utils/helpers/DateHelper";
import Plus from "@/icons/Plus";
import { TRANSMITION_TO_SPANISH_V2 } from "../../../models/VehicleFields";
import Link from "next/link";
import { routeToRenewLicenseAsUser } from "@/utils/route_builders/as_user/RouteBuilderForUserServerAsUser";

interface Props {
    legend: string;
    vehicle: Vehicle;
    vehicleType: "car" | "motorcycle" | "tow";
    transmisionAdder: MissingTransmissionAdder;
}

const RegisteredVehicleRenderer: React.FC<Props> = ({
    legend,
    vehicle,
    vehicleType,
    transmisionAdder,
}) => {
    const VehicleIcon = getVehicleIconByType(vehicleType);

    return (
        <div className="margin-top-50">
            <h2 className="text icon-wrapper | medium-big bold lb">
                <VehicleIcon />
                {legend}
            </h2>
            <h3 className="text | gray gray-dark bold margin-top-5">
                Valido hasta el{" "}
                {timestampDateInSpanish(vehicle.license.expiredDateLicense)}
            </h3>
            <h3 className="text | gray gray-dark bold margin-top-5">
                Transmisión{" "}
                {getTransmissionsAsSpanish(vehicle.type.mode)
                    .toString()
                    .replaceAll(",", " | ")}
            </h3>
            <div
                className="row-wrapper | gap-20"
                data-state={transmisionAdder.loading && "loading"}
            >
                {vehicle.type.mode.length === 1 && (
                    <button
                        className="icon-wrapper small-general-button text | gray gray-icon medium bolder lb margin-top-25 touchable"
                        onClick={() =>
                            transmisionAdder.addMissingTransmission(vehicleType)
                        }
                    >
                        <Plus />
                        Agregar transmisión{" "}
                        {
                            TRANSMITION_TO_SPANISH_V2[
                                transmisionAdder.getMissTransmission(
                                    vehicle.type.mode,
                                )
                            ]
                        }
                    </button>
                )}
                <Link
                    className={`small-general-button | margin-top-25 touchable 
                        ${getColorButtonLicense(
                            vehicle.license.expiredDateLicense.toDate(),
                        )}`}
                    href={routeToRenewLicenseAsUser(vehicleType)}
                >
                    <span className="text | medium bolder">
                        Actualizar Licencia
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default RegisteredVehicleRenderer;
