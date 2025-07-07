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
  const { checkingUserAuth, user, userProps } = useContext(AuthContext);
  const [newLocation, setNewLocation] = useState<Locations>(
    user?.location ?? Locations.CochabambaBolivia,
  );
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);

  const changeOfLocation = (): boolean => {
    return (
      !userProps.hasLocation ||
      (user !== undefined && newLocation !== user.location)
    );
  };

  const sendMessage = (newLocation: Locations, oldLocation?: Locations) => {
    let message: string;
    if (!userProps.hasLocation || !oldLocation) {
      message = greeting()
        .concat(`Soy ${user?.fullName}, `)
        .concat(
          `, quisiera que me agreguen al grupo de Whatsaap de ${newLocation} 🌎`,
        );
    } else {
      message = greeting()
        .concat(`Soy ${user?.fullName}, `)
        .concat(
          `quisiera cambiarme de grupo de Whatsaap, 🔁🌎 porque ahora estoy en ${newLocation}.`,
        )
        .concat(`\nMi antigua ubicación era ${oldLocation} 👀`);
    }

    sendWhatsapp(PHONE_BUSINESS, message);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState.loading) {
      setFormState((prev) => ({
        ...prev,
        loading: true,
      }));
      if (!user || !user.id || !changeOfLocation()) {
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
            location: newLocation,
          }),
          {
            pending: "Actualizando localización, por favor espera",
            success: "Localización actualizada",
            error:
              "Error al actualizar tu localización, inténtalo de nuevo por favor",
          },
        );

        sendMessage(newLocation, user.location);
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
      isValid: newLocation !== undefined,
    }));
  }, [newLocation]);

  if (checkingUserAuth || !newLocation) {
    return <PageLoading />;
  }

  return (
    user && (
      <section className="service-form-wrapper | max-height-100">
        <h1 className="text | big bold">Cambia tu Localización</h1>
        <p className="text | light">
          Podrás mandar un mensaje de solicitud por WhatsApp para cambiar el
          grupo donde perteneces.
        </p>

        <BaseForm
          content={{
            button: {
              content: {
                legend: userProps.hasLocation
                  ? "Cambiar localización"
                  : "Agregar localización",
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
          <LocationField location={newLocation} setter={setNewLocation} />
        </BaseForm>

        <span className="circles-right-bottomv2 green"></span>
      </section>
    )
  );
};

export default FormToChangeUserLocation;
