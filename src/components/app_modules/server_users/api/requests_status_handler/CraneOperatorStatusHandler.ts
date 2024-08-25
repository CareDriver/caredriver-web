import { UserInterface } from "@/interfaces/UserInterface";
import { HandleableServiceStatus } from "./HandleableServiceStatus";
import { ServiceReqState } from "@/interfaces/Services";
import { updateUser } from "@/components/app_modules/users/api/UserRequester";

export class CraneOperatorStatusHandler implements HandleableServiceStatus {
    user: UserInterface | undefined;

    constructor(user: UserInterface | undefined) {
        this.user = user;
    }

    hasSomeRefusedRequest = (): boolean => {
        return (
            this.user !== undefined &&
            this.user.serviceRequests !== undefined &&
            this.user.serviceRequests.tow !== undefined &&
            this.user.serviceRequests.tow.state === ServiceReqState.Refused
        );
    };
    getStatusFeedback = (): { title: string; description: string } => {
        if (this.hasSomeRefusedRequest()) {
            return {
                title: "La solicitud fue Rechazada!",
                description:
                    "Puede que alguno de los datos enviados no hayan sido validos, intenta mandar una nueva solicitud.",
            };
        }

        return {
            title: "Solicitud para trabajar como Operador de Grúa con nosotros!",
            description:
                "Necesitamos verificar que todos los datos que se llenen sean validos antes registrar al nuevo usuario servidor.",
        };
    };
    updateRefuseState = async (): Promise<void> => {
        if (this.user) {
            var changed = false;
            var toUpdate = {
                ...this.user.serviceRequests,
            };
            if (this.hasSomeRefusedRequest()) {
                toUpdate = {
                    ...toUpdate,
                    tow: {
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
        }
    };
}
