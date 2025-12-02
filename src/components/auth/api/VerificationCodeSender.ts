import { generateVerificationCode } from "generate-verification-code/dist";
// import { toast } from "react-toastify";

export async function sendVerificationCode(phone: string) {
  let codeSent: string = String(
    generateVerificationCode({
      length: 6,
      type: "string",
    })
  );

  // const message: string = `✉️ Tu código de verificación es ${codeSent}`;
  /* 
  await toast.promise(
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
      pending: "Enviando código de verificación a tu celular",
      success: "Código enviado",
      error: "Error al enviar el código, inténtalo de nuevo por favor",
    },
  ); */

  return codeSent;
}
