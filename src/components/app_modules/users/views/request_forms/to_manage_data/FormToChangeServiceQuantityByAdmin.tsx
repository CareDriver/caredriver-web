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
import Repeat from "@/icons/Repeat";

const serviceList = [
  Services.Normal,
  Services.Driver,
  Services.Mechanic,
  Services.Tow,
  Services.Laundry,
];

interface Form {
  selectedService: Services;
  newQuantity: TextFieldForm;
}

const DEFAULT_FORM: Form = {
  selectedService: Services.Normal,
  newQuantity: DEFAUL_TEXT_FIELD,
};

const FormToChangeServiceQuantityByAdmin = ({
  user,
}: {
  user: UserInterface;
}) => {
  const [form, setForm] = useState<Form>(DEFAULT_FORM);
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);

  const validateQuantity = (value: string): InputState => {
    if (value.trim() === "") {
      return {
        isValid: false,
        message: "Ingresa la cantidad",
      };
    }

    const quantity = Number(value);
    if (isNaN(quantity)) {
      return {
        isValid: false,
        message: "La cantidad debe ser numérica",
      };
    }

    if (quantity < 0 || !Number.isInteger(quantity)) {
      return {
        isValid: false,
        message: "La cantidad debe ser un entero mayor o igual a 0",
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

      newServicesData[form.selectedService]!.servicesQuantity = parseInt(
        form.newQuantity.value,
      );

      await toast.promise(
        updateUser(user.id, {
          servicesData: newServicesData as ServicesData,
        }),
        {
          pending: "Guardando cantidad de servicios...",
          success: "Cantidad de servicios actualizada correctamente",
          error: "Error al actualizar la cantidad de servicios",
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
      isValid: validateQuantity(form.newQuantity.value).isValid,
    }));
  }, [form.newQuantity.value]);

  return (
    <section className="profile-info-wrapper | margin-top-50 max-width-60">
      <h2 className="text medium-big bold | icon-wrapper lb">
        <Repeat /> Cambiar cantidad de servicios
      </h2>

      <BaseForm
        content={{
          button: {
            content: {
              legend: "Guardar cantidad",
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
            values: form.newQuantity,
            setter: (newField) =>
              setForm((prev) => ({
                ...prev,
                newQuantity: newField,
              })),
            validator: validateQuantity,
          }}
          legend="Nueva cantidad de servicios"
          placeholder="Ej: 120"
        />
      </BaseForm>
    </section>
  );
};

export default FormToChangeServiceQuantityByAdmin;
