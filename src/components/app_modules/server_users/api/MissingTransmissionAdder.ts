import { ServiceVehicles, UserInterface } from "@/interfaces/UserInterface";
import { VehicleTransmission } from "@/interfaces/VehicleInterface";
import { updateUser } from "@/utils/requests/UserRequester";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

export class MissingTransmissionAdder {
    user: UserInterface | undefined;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;

    constructor(
        user: UserInterface | undefined,
        loading: boolean,
        setLoading: Dispatch<SetStateAction<boolean>>,
    ) {
        this.user = user;
        this.loading = loading;
        this.setLoading = setLoading;
    }

    saveTransmissionAdded = async (serviceVehicles: ServiceVehicles) => {
        if (!this.loading && this.user && this.user.id) {
            this.setLoading(true);
            var userToUpdate: Partial<UserInterface> = {
                serviceVehicles,
            };
            try {
                await toast.promise(updateUser(this.user?.id, userToUpdate), {
                    pending: "Agregando nueva transmisión, por favor espera",
                    success: "Transmisión agregada",
                    error: "Error al agregar la nueva transmisión, inténtalo de nuevo por favor",
                });
                this.setLoading(false);
                window.location.reload();
            } catch (e) {
                this.setLoading(false);
                window.location.reload();
            }
        }
    };

    addMissingTransmission = async (type: "car" | "motorcycle" | "tow") => {
        if (this.loading) {
            return;
        }

        if (this.user?.serviceVehicles && this.user?.serviceVehicles[type]) {
            this.saveTransmissionAdded({
                ...this.user.serviceVehicles,
                [type]: {
                    ...this.user.serviceVehicles[type],
                    type: {
                        ...this.user.serviceVehicles[type].type,
                        mode: [
                            ...this.user.serviceVehicles[type].type.mode,
                            this.getMissTransmission(
                                this.user.serviceVehicles[type].type.mode,
                            ),
                        ],
                    },
                },
            });
        }
    };
    getMissTransmission = (
        modes: VehicleTransmission[],
    ): VehicleTransmission => {
        return modes[0] === VehicleTransmission.AUTOMATIC
            ? VehicleTransmission.MECHANICAL
            : VehicleTransmission.AUTOMATIC;
    };
}
