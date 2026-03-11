"use client";

import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import { TextField as TextFieldForm } from "@/components/form/models/FormFields";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUserByFakeId } from "../../api/UserRequester";
import { validateId } from "@/validators/IdValidator";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import { routeToManageUserAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUsersAsAdmin";
import { isValidTextField } from "@/components/form/validators/FieldValidators";
import BaseForm from "@/components/form/view/forms/BaseForm";
import TextField from "@/components/form/view/fields/TextField";

const RedirectorToUserByFakeId = () => {
  const [userFakedId, setUserFakeId] =
    useState<TextFieldForm>(DEFAUL_TEXT_FIELD);
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);

  const tryToRedirect = async (e: FormEvent) => {
    e.preventDefault();
    if (formState.loading) {
      return;
    }

    setFormState((prev) => ({
      ...prev,
      loading: true,
    }));

    if (!isValidTextField(userFakedId)) {
      toast.error("Completa los campos", {
        toastId: "no-filled-fields-error",
      });
      setFormState((prev) => ({
        ...prev,
        loading: false,
      }));
      return;
    }

    try {
      let serviceFound = await toast.promise(
        getUserByFakeId(userFakedId.value),
        {
          pending: "Buscando usuario ...",
          error: "Error al buscar al usuario, inténtalo de nuevo",
        },
      );
      if (serviceFound === undefined) {
        setUserFakeId((prev) => ({
          ...prev,
          message: "El ID no pertenece a ningún usuario, intenta con otro",
        }));
        setFormState((prev) => ({
          ...prev,
          loading: false,
        }));
        return;
      }
      let link = routeToManageUserAsAdmin(userFakedId.value);

      window.location.replace(link);
    } catch (e) {
      setFormState((prev) => ({
        ...prev,
        loading: false,
      }));
      return;
    }
  };

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      isValid: isValidTextField(userFakedId),
    }));
  }, [userFakedId]);

  return (
    <BaseForm
      content={{
        button: {
          content: {
            legend: "Buscar usuario",
          },
          behavior: {
            isValid: formState.isValid,
            loading: formState.loading,
          },
        },
      }}
      behavior={{
        loading: formState.loading,
        onSummit: tryToRedirect,
      }}
    >
      <TextField
        field={{
          values: userFakedId,
          setter: setUserFakeId,
          validator: validateId,
        }}
        legend="Id del usuario"
      />
    </BaseForm>
  );
};

export default RedirectorToUserByFakeId;
