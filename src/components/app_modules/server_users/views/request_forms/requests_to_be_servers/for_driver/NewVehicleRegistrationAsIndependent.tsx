"use client";

import { VehicleToAddAsDriver } from "@/components/app_modules/server_users/models/DriverRegistration";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import NewVehicleForm from "./NewVehicleForm";
import PageLoading from "@/components/loaders/PageLoading";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { routeToRequestToBeServerUserAsUser } from "@/utils/route_builders/as_user/RouteBuilderForUserServerAsUser";
import { UserInterface } from "@/interfaces/UserInterface";
import { ServiceReqState } from "@/interfaces/Services";

const NewVehicleRegistrationAsIndependent = ({
    type,
}: {
    type: VehicleToAddAsDriver;
}) => {
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const [hasPermission, setPermission] = useState(false);

    const hasActiveRequests = (user: UserInterface): boolean => {
        return (
            user.serviceRequests?.driveCar?.state ===
                ServiceReqState.Reviewing ||
            user.serviceRequests?.driveMotorcycle?.state ===
                ServiceReqState.Reviewing
        );
    };

    useEffect(() => {
        if (user) {
            const isDriverCar: boolean =
                user.serviceRequests?.driveCar?.state ===
                ServiceReqState.Approved;
            const isDriverMotorcycle: boolean =
                user.serviceRequests?.driveMotorcycle?.state ===
                ServiceReqState.Approved;
            const hasRequestsReviwing: boolean = hasActiveRequests(user);

            if (
                (isDriverCar || isDriverMotorcycle) &&
                user.driverEnterpriseId
            ) {
                toast.info(
                    "Comunicate con tu empresa asociada para registrar el nuevo vehiculo",
                    {
                        toastId: "user-with-enterprise",
                    },
                );
                router.push(routeToRequestToBeServerUserAsUser("driver"));
            } else if (
                (isDriverCar && type === "car") ||
                (isDriverMotorcycle && type === "motorcycle")
            ) {
                toast.info("Ya registraste este vehiculo", {
                    toastId: "vehicle-already-registered-info",
                });
                router.push(routeToRequestToBeServerUserAsUser("driver"));
            } else if (hasRequestsReviwing) {
                toast.info(
                    "Espera a que tus peticiones sean revisadas antes de enviar una nueva",
                    { toastId: "user-with-active-requests" },
                );
                router.push(routeToRequestToBeServerUserAsUser("driver"));
            } else {
                setPermission(true);
            }
        } else {
            router.push(routeToRequestToBeServerUserAsUser("driver"));
        }
    }, [user]);

    if (!user) {
        return <PageLoading />;
    }

    return hasPermission && <NewVehicleForm type={type} baseUser={user} />;
};

export default NewVehicleRegistrationAsIndependent;
