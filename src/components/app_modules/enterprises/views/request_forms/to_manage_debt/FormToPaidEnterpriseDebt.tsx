"use client";
import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import { TextField as TextFieldForm } from "@/components/form/models/FormFields";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import { isValidTextField } from "@/components/form/validators/FieldValidators";
import TextField from "@/components/form/view/fields/TextField";
import BaseForm from "@/components/form/view/forms/BaseForm";
import MoneyBillTransfer from "@/icons/MoneyBillTransfer";
import { FormEvent, useEffect, useState } from "react";
import {
  isValidDebtPaid,
  isValidNote,
} from "../../../validators/debt_paid/DebtPaidValidator";
import { Enterprise } from "@/interfaces/Enterprise";
import Popup from "@/components/modules/Popup";
import { isValidBankNumber } from "@/components/app_modules/users/validators/for_data/BalanceValidator";
import { toast } from "react-toastify";
import { DebtHistory, Price } from "@/interfaces/Payment";
import { Timestamp } from "firebase/firestore";
import { genFakeId } from "@/utils/generators/IdGenerator";
import { updateEnterprise } from "../../../api/EnterpriseRequester";
import BaseFormWithTwoButtons from "@/components/form/view/forms/BaseFormWithTwoButtons";

interface Props {
  enterprise: Enterprise;
}

interface Form {
  paidDebt: TextFieldForm;
  note: TextFieldForm;
  bankTransactionNumber: TextFieldForm;
}

const FormToPaidEnterpriseDebt: React.FC<Props> = ({ enterprise }) => {
  const [form, setForm] = useState<Form>(DEFAULT_FORM);
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
  const [isOpenPopup, setOpenPopup] = useState(false);

  const CURRENT_DEBT: number = enterprise.currentDebt?.amount ?? 0;

  const paidDebt = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formState.loading || !enterprise.id) {
      return;
    }

    setFormState((prev) => ({ ...prev, loading: true }));
    if (!isValidAllNeccesaryForm(form)) {
      setFormState((prev) => ({ ...prev, loading: false }));
      toast.error("Formulario invalido", {
        toastId: "invalid-paid-debt-form",
      });
      return;
    }

    const currentEnterpriseDebt: Price = {
      amount: CURRENT_DEBT - parseFloat(form.paidDebt.value),
      currency: "Bs. (BOB)",
    };

    const note: string = isValidTextField(form.note) ? form.note.value : "";
    const debtItemHistory: DebtHistory = {
      paidDebtId: genFakeId(),
      date: Timestamp.now(),
      note: note,
      transactionNumber: form.bankTransactionNumber.value,
      amount: parseFloat(form.paidDebt.value),
      currency: "Bs. (BOB)",
      newDebt: currentEnterpriseDebt,
    };

    try {
      const enterpriseUpdated: Partial<Enterprise> = {
        paidDebtsHistory: [
          ...(enterprise?.paidDebtsHistory ?? []),
          debtItemHistory,
        ],
        currentDebt: currentEnterpriseDebt,
      };
      await toast.promise(updateEnterprise(enterprise.id, enterpriseUpdated), {
        pending: "Guardando pago en el historial",
        success: "Pago guardado en el historial",
        error:
          "Error al guardar el pago en el historial, intentalo de nuevo por favor",
      });
      window.location.reload();
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        loading: false,
        isValid: false,
      }));
    }
  };

  const setPaidAllDebt = () => {
    setForm((prev) => ({
      ...prev,
      paidDebt: {
        message: null,
        value: CURRENT_DEBT.toString(),
      },
    }));
    setOpenPopup(true);
  };

  useEffect(() => {
    if (isOpenPopup) {
      setFormState((prev) => ({
        ...prev,
        isValid: isValidAllNeccesaryForm(form),
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        isValid: isValidTextField(form.paidDebt),
      }));
    }
  }, [form, isOpenPopup]);

  if (CURRENT_DEBT === 0) {
    return;
  }

  return (
    <section className="margin-top-50">
      <h2 className="text medium-big bold | icon-wrapper lb">
        <MoneyBillTransfer />
        Pagar Deuda
      </h2>

      <BaseFormWithTwoButtons
        content={{
          firstButton: {
            content: {
              legend: "Pagar Deuda",
              buttonClassStyle: "small-general-button | text bold",
            },
            behavior: {
              isValid: isValidTextField(form.paidDebt),
              loading: formState.loading,
              action: async () => setOpenPopup(true),
              setLoading: (l) =>
                setFormState((prev) => ({
                  ...prev,
                  loading: l,
                })),
            },
          },
          secondButton: {
            content: {
              legend: "Pagar toda la Deuda",
              buttonClassStyle: "small-general-button | text bold",
            },
            behavior: {
              isValid: true,
              loading: formState.loading,
              action: async () => setPaidAllDebt(),
              setLoading: (l) =>
                setFormState((prev) => ({
                  ...prev,
                  loading: l,
                })),
            },
          },
          styleClasses: "small-form max-width-40",
        }}
        behavior={{
          loading: formState.loading,
        }}
      >
        <TextField
          field={{
            values: form.paidDebt,
            setter: (b) => setForm((prev) => ({ ...prev, paidDebt: b })),
            validator: (paidDebt) =>
              isValidDebtPaid(enterprise.currentDebt?.amount ?? 0, paidDebt),
          }}
          legend="Nuevo saldo del usuario"
        />
      </BaseFormWithTwoButtons>

      <Popup isOpen={isOpenPopup} close={() => setOpenPopup(false)}>
        <div>
          <h2 className="text | big bold">Numero de transacción</h2>
          <p className="text | light">
            Escribe el número de transacción registrada en cuenta bancaria para
            justificar el pago de la deuda.
          </p>
        </div>
        <BaseForm
          content={{
            button: {
              content: {
                legend: "Pagar Deuda",
              },
              behavior: {
                loading: formState.loading,
                isValid: formState.isValid,
              },
            },
          }}
          behavior={{
            loading: formState.loading,
            onSummit: paidDebt,
          }}
        >
          <TextField
            field={{
              values: form.bankTransactionNumber,
              setter: (t) =>
                setForm((prev) => ({
                  ...prev,
                  bankTransactionNumber: t,
                })),
              validator: isValidBankNumber,
            }}
            legend={"Número de transacción"}
          />
          <TextField
            field={{
              values: form.note,
              setter: (t) =>
                setForm((prev) => ({
                  ...prev,
                  note: t,
                })),
              validator: isValidNote,
            }}
            legend={"Nota (Opcional)"}
          />
        </BaseForm>
      </Popup>
    </section>
  );
};

function isValidAllNeccesaryForm(form: Form): boolean {
  return (
    isValidTextField(form.paidDebt) &&
    isValidTextField(form.bankTransactionNumber)
  );
}

const DEFAULT_FORM: Form = {
  paidDebt: DEFAUL_TEXT_FIELD,
  note: DEFAUL_TEXT_FIELD,
  bankTransactionNumber: DEFAUL_TEXT_FIELD,
};

export default FormToPaidEnterpriseDebt;
