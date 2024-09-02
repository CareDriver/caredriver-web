"use client";
import { Enterprise } from "@/interfaces/Enterprise";
import "@/styles/components/enterprise.css";
import { EntityField } from "@/components/form/models/FormFields";
import { EntityFieldSetter } from "@/components/form/models/FieldSetters";
import { ServiceType } from "@/interfaces/Services";
import { InputValidator } from "@/validators/InputValidatorSignature";
import BaseEnterpriseSelector from "./BaseEnterpriseSelector";

interface Props {
    typeOfEnterprise: ServiceType;
    field: {
        values: EntityField;
        setter: EntityFieldSetter;
        validator?: InputValidator;
    };
}

const EnterpriseSelectorById: React.FC<Props> = ({
    typeOfEnterprise,
    field,
}) => {
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
                const { isValid, message } = field.validator(enterprise.id);
                field.setter({
                    value: enterprise.id,
                    message: isValid ? null : message,
                });
            } else {
                field.setter({
                    value: enterprise.id,
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

export default EnterpriseSelectorById;
