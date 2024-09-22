import { UserInterface } from "@/interfaces/UserInterface";
import { HandleableServiceStatus } from "./HandleableServiceStatus";
import { ServiceReqState } from "@/interfaces/Services";
import { updateUser } from "@/components/app_modules/users/api/UserRequester";
import { DRIVER } from "@/models/Business";

export class DriverStatusHandler implements HandleableServiceStatus {
    user: UserInterface | undefined;

    constructor(user: UserInterface | undefined) {
        this.user = user;
    }

    hasSomeRefusedRequest = (): boolean => {
        if (this.user && this.user.serviceRequests) {
            let carRefused: boolean =
                this.user.serviceRequests.driveCar !== undefined &&
                this.user.serviceRequests.driveCar.state ===
                    ServiceReqState.Refused;
            let motoRefused: boolean =
                this.user.serviceRequests.driveMotorcycle !== undefined &&
                this.user.serviceRequests.driveMotorcycle.state ===
                    ServiceReqState.Refused;
            return carRefused || motoRefused;
        }

        return false;
    };

    getStatusFeedback = (): { title: string; description: string } => {
        if (this.user && this.user.serviceRequests) {
            if (this.hasSomeRefusedRequest()) {
            }
            if (
                this.user.serviceRequests.driveCar &&
                this.user.serviceRequests.driveCar.state ===
                    ServiceReqState.Refused
            ) {
                return {
                    title: "La solicitud fue Rechazada!",
                    description:
                        "Puede que alguno de los datos enviados no hayan sido validos, intenta mandar una nueva solicitud.",
                };
            }
        }

        return {
            title: `Solicitud para trabajar como ${DRIVER}`,
            description:
                "Necesitamos verificar que todos los datos que se llenen sean validos antes registrar al nuevo usuario servidor.",
        };
    };

    updateRefuseState = async (): Promise<void> => {
        if (!this.user) {
            return;
        }

        var changed = false;
        var toUpdate = {
            ...this.user.serviceRequests,
        };
        if (
            this.user.serviceRequests &&
            this.user.serviceRequests.driveCar &&
            this.user.serviceRequests.driveCar.state === ServiceReqState.Refused
        ) {
            toUpdate = {
                ...toUpdate,
                driveCar: {
                    id: "",
                    state: ServiceReqState.NotSent,
                },
            };
            changed = true;
        }
        if (
            this.user.serviceRequests &&
            this.user.serviceRequests.driveMotorcycle &&
            this.user.serviceRequests.driveMotorcycle.state ===
                ServiceReqState.Refused
        ) {
            toUpdate = {
                ...toUpdate,
                driveMotorcycle: {
                    id: "",
                    state: ServiceReqState.NotSent,
                },
            };
            changed = true;
        }

        if (changed && this.user.id) {
            var toUpdateDoc: Partial<UserInterface> = {
                serviceRequests: toUpdate,
            };
            try {
                await updateUser(this.user.id, toUpdateDoc);
            } catch (e) {
                throw e;
            }
        }
    };
}
