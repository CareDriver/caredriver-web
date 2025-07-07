import { InputState } from "@/validators/InputValidatorSignature";

export const validateDisableDate = (deadline: Date): InputState => {
  const currentDate = new Date();

  if (
    deadline < currentDate ||
    deadline.toDateString() === currentDate.toDateString()
  ) {
    return {
      isValid: false,
      message: "La fecha debe ser igual o mayor a un dia",
    };
  } else {
    return {
      isValid: true,
      message: "Fecha válida",
    };
  }
};
