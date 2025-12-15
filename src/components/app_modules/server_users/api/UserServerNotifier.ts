import { ServiceType } from "@/interfaces/Services";
import {
  flatPhone,
  PhoneNumber,
  UserInterface,
} from "@/interfaces/UserInterface";
import { userReqTypes } from "@/interfaces/UserRequest";
import { routeToLandingPageServiceDetails } from "@/models/Business";
import { greeting } from "@/utils/senders/Greeter";
// import { toast } from "react-toastify";

export async function notifyByPhoneApprovalServerUser(
  phone: string,
  serviceType: ServiceType,
) {
  const message = greeting()
    .concat(" 🎉 Tu Solicitud fue aprobada para ser ")
    .concat(userReqTypes[serviceType])
    .concat(", ahora puedes ofrecer tu servicio en nuestra aplicacion. ")
    .concat("Ve al siguiente link para mas informacion")
    .concat(routeToLandingPageServiceDetails(serviceType));

  /*   await toast.promise(
    fetch("/api/sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: phone,
        message: message,
      }),
    }),
    {
      pending: "Notificando la aprobacion al usuario",
      success: "Usuario notificado",
      error: "Error al notificar al usuario, inténtalo de nuevo por favor",
    },
  ); */
}

export async function notifyRequestApprovalUser(
  requesterUser: UserInterface,
  serviceType: ServiceType,
) {
  const phoneNumber: PhoneNumber | undefined =
    requesterUser.phoneNumber ?? requesterUser.alternativePhoneNumber;

  if (phoneNumber) {
    await notifyByPhoneApprovalServerUser(
      flatPhone(phoneNumber).replace("+", ""),
      serviceType,
    );
  }
}
