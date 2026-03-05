"use client";

import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import { TextField as TextFieldForm } from "@/components/form/models/FormFields";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import TextField from "@/components/form/view/fields/TextField";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { UserInterface } from "@/interfaces/UserInterface";
import { ExpirationBalance } from "@/interfaces/Payment";
import { updateUser } from "@/components/app_modules/users/api/UserRequester";
import { InputState } from "@/validators/InputValidatorSignature";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import SackDollar from "@/icons/SackDollar";
import { Timestamp } from "firebase/firestore";

interface Form {
  amount: TextFieldForm;
  expirationDate: TextFieldForm;
}

const DEFAULT_FORM: Form = {
  amount: DEFAUL_TEXT_FIELD,
  expirationDate: DEFAUL_TEXT_FIELD,
};

const FormToChangeBalanceWithExpirationByAdmin = ({
  user,
}: {
  user: UserInterface;
}) => {
  const [form, setForm] = useState<Form>(DEFAULT_FORM);
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);

  const validateAmount = (value: string): InputState => {
    if (value.trim() === "") {
      return {
        isValid: false,
        message: "Ingresa el monto",
      };
    }

    const amount = Number(value);
    if (isNaN(amount) || amount < 0) {
      return {
        isValid: false,
        message: "Monto inválido",
      };
    }

    return {
      isValid: true,
      message: "",
    };
  };

  const validateDate = (value: string): InputState => {
    if (value.trim() === "") {
      return {
        isValid: false,
        message: "Ingresa la fecha de expiración",
      };
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return {
        isValid: false,
        message: "Fecha inválida",
      };
    }

    return {
      isValid: true,
      message: "",
    };
  };

  const perform = async () => {
    if (!user.id) {
      return;
    }

    try {
      const expirationTimestamp = Timestamp.fromDate(
        new Date(form.expirationDate.value),
      );

      const balanceWithExpiration: ExpirationBalance = {
        balance: {
          currency: "Bs. (BOB)",
          amount: parseFloat(form.amount.value),
        },
        expirationDate: expirationTimestamp,
      };

      await toast.promise(
        updateUser(user.id, {
          balanceWithExpiration: balanceWithExpiration,
        }),
        {
          pending: "Guardando balance con expiración...",
          success: "Balance con expiración actualizado correctamente",
          error: "Error al actualizar el balance con expiración",
        },
      );

      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Error al procesar la fecha");
    }
  };

  const onSummit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formState.loading) {
      return;
    }

    setFormState((prev) => ({
      ...prev,
      loading: true,
    }));

    if (!formState.isValid) {
      toast.warning("Formulario inválido");
      setFormState((prev) => ({
        ...prev,
        loading: false,
      }));
      return;
    }

    await perform();
    setFormState((prev) => ({
      ...prev,
      loading: false,
    }));
  };

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      isValid:
        validateAmount(form.amount.value).isValid &&
        validateDate(form.expirationDate.value).isValid,
    }));
  }, [form.amount.value, form.expirationDate.value]);

  return (
    <section className="profile-info-wrapper | margin-top-50 max-width-60">
      <h2 className="text medium-big bold | icon-wrapper lb">
        <SackDollar />
        Bonificación con expiración
      </h2>
      <p className="text | gray-dark">
        Define un saldo de bonificación y su fecha de expiración para el
        usuario.
      </p>

      {user.balanceWithExpiration && (
        <p className="text | gray-dark">
          Actual: {user.balanceWithExpiration.balance.amount} Bs. (BOB), expira
          el{" "}
          {new Date(
            user.balanceWithExpiration.expirationDate.seconds * 1000,
          ).toLocaleDateString("es-BO")}
        </p>
      )}

      <BaseForm
        content={{
          button: {
            content: {
              legend: "Guardar bonificación",
              buttonClassStyle: "small-general-button | text bold",
            },
            behavior: {
              loading: formState.loading,
              isValid: formState.isValid,
            },
          },
          styleClasses: "small-form max-width-40",
        }}
        behavior={{
          loading: formState.loading,
          onSummit: onSummit,
        }}
      >
        <TextField
          field={{
            values: form.amount,
            setter: (newField) =>
              setForm((prev) => ({
                ...prev,
                amount: newField,
              })),
            validator: validateAmount,
          }}
          legend="Monto en Bs. (BOB)"
          placeholder="Ej: 10"
        />

        <fieldset className="form-section">
          <input
            type="date"
            autoComplete="off"
            value={form.expirationDate.value}
            onChange={(e) => {
              const dateValue = e.target.value;
              const validation = validateDate(dateValue);
              setForm((prev) => ({
                ...prev,
                expirationDate: {
                  value: dateValue,
                  message: validation.isValid ? null : validation.message,
                },
              }));
            }}
            className="form-section-input"
          />
          <legend className="form-section-legend">Fecha de expiración</legend>
          {form.expirationDate.message && (
            <small>* {form.expirationDate.message}</small>
          )}
        </fieldset>
      </BaseForm>
    </section>
  );
};

export default FormToChangeBalanceWithExpirationByAdmin;
