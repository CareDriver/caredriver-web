import Popup from "@/components/modules/Popup";
import FieldDeleted from "@/components/requests/data_renderer/form/FieldDeleted";
import ImageRenderer from "@/components/requests/data_renderer/form/ImageRenderer";
import InpurDate from "@/components/requests/data_renderer/form/InpurDate";
import InputData from "@/components/requests/data_renderer/form/InputData";
import AddressCar from "@/icons/AddressCar";
import Car from "@/icons/Car";
import { Vehicle } from "@/interfaces/UserRequest";
import { vehicleModeRenderV2, vehicleTypeRenderV2 } from "@/interfaces/VehicleInterface";

const UserVehicleDetails = ({
    vehicle,
    type,
}: {
    vehicle: Vehicle | undefined;
    type: "car" | "motorcycle" | "tow";
}) => {
    return (
        <>
            {vehicle ? (
                <div className="form-sub-container">
                    <h2 className="text icon-wrapper | lb medium-big bold margin-top-25">
                        <Car /> Transmisión
                    </h2>
                    {vehicle.type.mode.map((mode, i) => (
                        <fieldset className="form-section" key={`vehicle-mode-${i}`}>
                            <InputData
                                content={`Transmisión ${vehicleModeRenderV2[mode]}`}
                                placeholder={undefined}
                            />
                            <legend className="form-section-legend">
                                Transmisión
                            </legend>
                        </fieldset>
                    ))}

                    <h2 className="text icon-wrapper | lb medium-big bold margin-top-5">
                        <AddressCar /> Licencia
                    </h2>
                    <fieldset className="form-section">
                        <InputData
                            content={vehicle.license.licenseNumber}
                            placeholder="Localización"
                        />
                        <legend className="form-section-legend">
                            número de licencia
                        </legend>
                    </fieldset>
                    <fieldset className="form-section">
                        <InpurDate date={vehicle.license.expiredDateLicense.toDate()} />
                        <legend className="form-section-legend">
                            Fecha de expiración de la licencia
                        </legend>
                    </fieldset>
                    {vehicle.license.frontImgUrl ? (
                        <ImageRenderer
                            url={vehicle.license.frontImgUrl.url}
                            placeholder="Licencia parte frontal"
                            isCircle={false}
                            noFoundDescr={undefined}
                        />
                    ) : (
                        <FieldDeleted description="El usuario no tiene guardado la foto de su licencia de la parte frontal." />
                    )}
                    {vehicle.license.backImgUrl ? (
                        <ImageRenderer
                            url={vehicle.license.backImgUrl.url}
                            placeholder="Licencia parte trasera"
                            isCircle={false}
                            noFoundDescr={undefined}
                        />
                    ) : (
                        <FieldDeleted description="El usuario no tiene guardado la foto de su licencia de la parte trasera." />
                    )}
                </div>
            ) : (
                <FieldDeleted
                    description={`El usuario no tiene registrado información ${vehicleTypeRenderV2[type]}`}
                />
            )}
        </>
    );
};

export default UserVehicleDetails;
