import {
  MAX_LENGTH_FOR_DESCRIPTION,
  MAX_LENGTH_FOR_NAMES,
} from "@/utils/text_helpers/TextCutter";
import { InputState } from "../../../../validators/InputValidatorSignature";

export const validateEnterpriseName = (name: string): InputState => {
  const nameRegex: RegExp = /^\S[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

  if (name.trim() === "") {
    return {
      isValid: false,
      message: "Ingresa el nombre de la Empresa",
    };
  } else if (!nameRegex.test(name)) {
    return {
      isValid: false,
      message: "El nombre solo puede contener letras del alfabeto y números",
    };
  } else if (name.length > MAX_LENGTH_FOR_NAMES) {
    return {
      isValid: false,
      message: `No puedes ingresar mas de ${MAX_LENGTH_FOR_NAMES} caracteres para el nombre de la Empresa`,
    };
  } else {
    return {
      isValid: true,
      message: "Nombre valido",
    };
  }
};

export const validateEnterpriseDescription = (
  description: string,
): InputState => {
  const descriptionRegex: RegExp = /^[\S\s]+$/;

  if (description.trim() === "") {
    return {
      isValid: false,
      message: "Ingresa una descripción para la Empresa",
    };
  } else if (!descriptionRegex.test(description)) {
    return {
      isValid: false,
      message: "La descripción no debe empezar con un espacio",
    };
  } else if (description.length > MAX_LENGTH_FOR_DESCRIPTION) {
    return {
      isValid: false,
      message: `No puedes ingresar más de ${MAX_LENGTH_FOR_DESCRIPTION} caracteres para la descripción de la Empresa`,
    };
  } else {
    return {
      isValid: true,
      message: "Descripción válida",
    };
  }
};
