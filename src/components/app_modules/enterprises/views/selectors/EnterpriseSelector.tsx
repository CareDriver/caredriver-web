"use client";
import { Enterprise } from "@/interfaces/Enterprise";
import "@/styles/components/enterprise.css";
import { EntityDataField } from "@/components/form/models/FormFields";
import { EntityDataFieldSetter } from "@/components/form/models/FieldSetters";
import { ServiceType } from "@/interfaces/Services";
import { InputValidator } from "@/validators/InputValidatorSignature";
import BaseEnterpriseSelector from "./BaseEnterpriseSelector";

interface Props {
  typeOfEnterprise: ServiceType;
  field: {
    values: EntityDataField<Enterprise>;
    setter: EntityDataFieldSetter<Enterprise>;
    validator?: InputValidator;
  };
}

const EnterpriseSelector: React.FC<Props> = ({ typeOfEnterprise, field }) => {
  const selectEnterprise = (enterprise: Enterprise | undefined): void => {
    if (!enterprise) {
      field.setter({
        value: undefined,
        message:
          typeOfEnterprise === "mechanical"
            ? null
            : `Por favor selecciona una empresa`,
      });
    } else {
      if (field.validator) {
        const { isValid, message } = field.validator(enterprise);
        field.setter({
          value: enterprise,
          message: isValid ? null : message,
        });
      } else {
        field.setter({
          value: enterprise,
          message: null,
        });
      }
    }
  };

  return (
    <BaseEnterpriseSelector
      typeOfEnterprise={typeOfEnterprise}
      behavior={{
        selectEnterprise: selectEnterprise,
      }}
    />
  );
};

export default EnterpriseSelector;
