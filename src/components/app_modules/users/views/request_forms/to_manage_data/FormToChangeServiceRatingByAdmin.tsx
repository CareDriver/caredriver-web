"use client";

import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import { TextField as TextFieldForm } from "@/components/form/models/FormFields";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import TextField from "@/components/form/view/fields/TextField";
import SelectionField from "@/components/form/view/fields/SelectionField";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { UserInterface } from "@/interfaces/UserInterface";
import { Services } from "@/interfaces/Services";
import { ServicesData } from "@/interfaces/ServicesDataInterface";
import { updateUser } from "@/components/app_modules/users/api/UserRequester";
import { InputState } from "@/validators/InputValidatorSignature";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import MoneyBillWave from "@/icons/MoneyBillWave";

const serviceList = [
  Services.Normal,
  Services.Driver,
  Services.Mechanic,
  Services.Tow,
  Services.Laundry,
];

interface Form {
  selectedService: Services;
  newRating: TextFieldForm;
}

const DEFAULT_FORM: Form = {
  selectedService: Services.Normal,
  newRating: DEFAUL_TEXT_FIELD,
};

const FormToChangeServiceRatingByAdmin = ({
  user,
}: {
  user: UserInterface;
}) => {
  const [form, setForm] = useState<Form>(DEFAULT_FORM);
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);

  const validateRating = (value: string): InputState => {
    if (value.trim() === "") {
      return {
        isValid: false,
        message: "Ingresa un rating",
      };
    }

    const rating = Number(value);
    if (isNaN(rating)) {
      return {
        isValid: false,
        message: "El rating debe ser numérico",
      };
    }

    if (rating < 0 || rating > 5) {
      return {
        isValid: false,
        message: "El rating debe estar entre 0 y 5",
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
      const newServicesData = {
        ...user.servicesData,
      };

      if (!newServicesData[form.selectedService]) {
        newServicesData[form.selectedService] = {
          averageRating: 5,
          servicesQuantity: 0,
          comments: [],
        };
      }

      newServicesData[form.selectedService]!.averageRating = parseFloat(
        form.newRating.value,
      );

      await toast.promise(
        updateUser(user.id, {
          servicesData: newServicesData as ServicesData,
        }),
        {
          pending: "Guardando rating...",
          success: "Rating actualizado correctamente",
          error: "Error al actualizar el rating",
        },
      );

      window.location.reload();
    } catch (error) {
      console.error(error);
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
      isValid: validateRating(form.newRating.value).isValid,
    }));
  }, [form.newRating.value]);

  return (
    <section className="profile-info-wrapper | margin-top-50 max-width-60">
      <h2 className="text medium-big bold | icon-wrapper lb">
        <MoneyBillWave /> Cambiar rating por servicio
      </h2>
      <BaseForm
        content={{
          button: {
            content: {
              legend: "Guardar rating",
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
        <SelectionField
          field={{
            value: form.selectedService,
            setter: (option) =>
              setForm((prev) => ({
                ...prev,
                selectedService: option as Services,
              })),
          }}
          options={serviceList}
          legend="Servicio"
        />

        <TextField
          field={{
            values: form.newRating,
            setter: (newField) =>
              setForm((prev) => ({
                ...prev,
                newRating: newField,
              })),
            validator: validateRating,
          }}
          legend="Nuevo rating (0-5)"
          placeholder="Ej: 4.5"
        />
      </BaseForm>
    </section>
  );
};

export default FormToChangeServiceRatingByAdmin;
