import { InputState } from "./InputValidatorSignature";

export const isValidChangeReason = (reason: string): InputState => {
  const reasonRegex: RegExp = /^[A-Za-z0-9áéíóúÁÉÍÓÚñÑ.,;:!?()\'\"\s-]+$/;
  const MAX_LENGTH = 250;

  if (reason.trim() === "") {
    return {
      isValid: false,
      message: "Tienes que ingresar tu justificativo por favor",
    };
  } else if (!reasonRegex.test(reason)) {
    return {
      isValid: false,
      message: "Justificación invalida",
    };
  } else if (reason.length > MAX_LENGTH) {
    return {
      isValid: false,
      message: `No puedes ingresar mas de ${MAX_LENGTH} caracteres para tu justificativo`,
    };
  } else {
    return {
      isValid: true,
      message: "Justificación valido",
    };
  }
};
