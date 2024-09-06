"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { updateUser } from "@/components/app_modules/users/api/UserRequester";
import { toast } from "react-toastify";
import { locationList, Locations } from "@/interfaces/Locations";
import { greeting } from "@/utils/senders/Greeter";
import { sendWhatsapp } from "@/utils/senders/Sender";
import { PHONE_BUSINESS } from "@/models/Business";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import PageLoading from "@/components/loaders/PageLoading";
import LocationField from "@/components/form/view/fields/LocationField";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { routeToProfileAsUser } from "@/utils/route_builders/as_user/RouteBuilderForProfileAsUser";

const FormToChangeUserLocation = () => {
    const { checkingUserAuth, user } = useContext(AuthContext);
    const [location, setLocation] = useState<Locations | undefined>(
        user?.location,
    );
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);

    const changeOfLocation = (): boolean => {
        return (
            location !== undefined &&
            user !== undefined &&
            location !== user.location
        );
    };

    const sendMessage = (newLocation: Locations, oldLocation: Locations) => {
        let message = greeting()
            .concat(`Soy ${user?.fullName}, `)
            .concat(
                `quisiera cambiarme de grupo de Whatsaap, 🔁🌎 porque ahora estoy en ${newLocation}.`,
            )
            .concat(`\nMi antigua ubicacion era ${oldLocation} 👀`);

        sendWhatsapp(PHONE_BUSINESS, message);
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formState.loading) {
            setFormState((prev) => ({
                ...prev,
                loading: true,
            }));
            if (
                !location ||
                !user ||
                !user.id ||
                !user.location ||
                !changeOfLocation()
            ) {
                toast.info("Sin cambios...", {
                    toastId: "without-change-location",
                });
                setFormState((prev) => ({
                    ...prev,
                    loading: false,
                }));
                return;
            }

            try {
                await toast.promise(
                    updateUser(user.id, {
                        location: location,
                    }),
                    {
                        pending: "Actualizando localización, por favor espera",
                        success: "Localización actualizada",
                        error: "Error al actualizar tu localización, inténtalo de nuevo por favor",
                    },
                );

                sendMessage(location, user.location);
                window.location.replace(routeToProfileAsUser());
            } catch (e) {
                setFormState({
                    loading: false,
                    isValid: true,
                });
            }
        }
    };

    useEffect(() => {
        setFormState((prev) => ({
            ...prev,
            isValid: location !== undefined,
        }));
    }, [location]);

    const getLocation = (input: string): Locations => {
        var location = Locations.CochabambaBolivia;
        locationList.forEach((value) => {
            if (value === input) {
                location = value;
            }
        });

        return location;
    };

    if (checkingUserAuth || !location) {
        return <PageLoading />;
    }

    return (
        user && (
            <section className="service-form-wrapper | max-height-100">
                <h1 className="text | big bolder">Cambia tu Localización</h1>
                <p className="text | light">
                    Podras mandar un mensaje de solicitud por Whatsapp para
                    cambiar el grupo donde pertences.
                </p>

                <BaseForm
                    content={{
                        button: {
                            content: {
                                legend: "Cambiar localizacion",
                            },
                            behavior: {
                                loading: formState.loading,
                                isValid: formState.isValid,
                            },
                        },
                        styleClasses: "max-width-60",
                    }}
                    behavior={{
                        loading: formState.loading,
                        onSummit: submit,
                    }}
                >
                    <LocationField location={location} setter={setLocation} />
                </BaseForm>

                <span className="circles-right-bottomv2 green"></span>
            </section>
        )
    );
};

export default FormToChangeUserLocation;
