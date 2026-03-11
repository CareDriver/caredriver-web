"use client";

import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import { PageStateContext } from "@/context/PageStateContext";
import { Enterprise } from "@/interfaces/Enterprise";
import { useRouter } from "next/navigation";
import { FormEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteEnterprise } from "../../../api/EnterpriseRequester";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import TextField from "@/components/form/view/fields/TextField";
import Trash from "@/icons/Trash";
import { isValidTextField } from "@/components/form/validators/FieldValidators";
import { routeToAllEnterprisesAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";
import { validateConfirmationEnterpriseName } from "../../../validators/confirmations/ValidatorsForConfirmationWithEnterprises";

interface Props {
  enterprise: Enterprise;
}

const FormToDeleteEnterprise: React.FC<Props> = ({ enterprise }) => {
  const router = useRouter();
  const { loading, setLoadingAll } = useContext(PageStateContext);
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
  const [nameVerification, setNameVerification] = useState(DEFAUL_TEXT_FIELD);

  const onSummit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loading && !formState.loading) {
      if (enterprise && enterprise.id) {
        setLoadingAll(true, setFormState);
        try {
          await toast.promise(deleteEnterprise(enterprise.id), {
            pending: `Eliminando empresa`,
            success: "Empresa eliminada",
            error: `Error al eliminar la empresa, inténtalo de nuevo por favor`,
          });
          router.push(routeToAllEnterprisesAsAdmin(enterprise.type));
        } catch (e) {
          window.location.reload();
        }
      }
    }
  };

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      isValid: isValidTextField(nameVerification),
    }));
  }, [nameVerification]);

  return (
    <div
      className={`form-sub-container | margin-top-50 max-width-40 ${
        loading && "loading-section"
      }`}
      data-state={loading ? "loading" : "loaded"}
    >
      <h2 className="text icon-wrapper | red red-icon medium-big bold">
        <Trash />
        Eliminar empresa
      </h2>
      <p className="text">
        Esta acción no se puede revertir. No se afectara los datos que están
        relacionados con esta empresa. Por favor escribe el nombre de la empresa
        para confirmar su eliminacion.
      </p>

      <BaseForm
        content={{
          button: {
            content: {
              legend: "Eliminar empresa",
              buttonClassStyle: "small-general-button | red | text bold",
            },
            behavior: {
              loading: formState.loading,
              isValid: formState.isValid,
            },
          },
          styleClasses: "small-form",
        }}
        behavior={{
          loading: formState.loading,
          onSummit: onSummit,
        }}
      >
        <TextField
          field={{
            values: nameVerification,
            setter: setNameVerification,
            validator: (d) =>
              validateConfirmationEnterpriseName(d, enterprise.name),
          }}
          legend="Nombre de la empresa | Confirmación"
        />
      </BaseForm>
    </div>
  );
};

export default FormToDeleteEnterprise;
