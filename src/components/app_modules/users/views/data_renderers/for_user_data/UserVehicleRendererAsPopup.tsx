"use client";

import { VEHICLE_CATEGORY_TO_SPANISH } from "@/components/app_modules/server_users/models/VehicleFields";
import VehicleRenderer from "@/components/app_modules/server_users/views/data_renderers/for_vehicles/VehicleRenderer";
import Popup from "@/components/modules/Popup";
import { Vehicle } from "@/interfaces/UserRequest";
import { differenceOnDays } from "@/utils/helpers/DateHelper";
import { useState } from "react";

interface Props {
    vehicle: {
        data: Vehicle | undefined;
        type: "car" | "motorcycle" | "tow";
    };
    content: { legend: string };
}

const UserVehicleRendererAsPopup: React.FC<Props> = ({ vehicle, content }) => {
    const [isViewVehicle, setViewVehicle] = useState<boolean>(false);

    return vehicle.data ? (
        <>
            <button
                className="service-user-option"
                onClick={() => setViewVehicle(true)}
            >
                Ver licencia de{" "}
                {VEHICLE_CATEGORY_TO_SPANISH[vehicle.type].toLowerCase()} -{" "}
                {differenceOnDays(
                    vehicle.data.license.expiredDateLicense.toDate(),
                ) <= 0 && <span className="text | bolder red">Expiro</span>}
            </button>
            <Popup isOpen={isViewVehicle} close={() => setViewVehicle(false)}>
                <div>
                    <h2 className="text | bolder big-medium">
                        {content.legend}
                    </h2>
                    <VehicleRenderer
                        vehicle={vehicle.data}
                        type={vehicle.type}
                    />
                </div>
            </Popup>
        </>
    ) : (
        <i className="text | red">
            {VEHICLE_CATEGORY_TO_SPANISH[vehicle.type]} no registrado
        </i>
    );
};

export default UserVehicleRendererAsPopup;
