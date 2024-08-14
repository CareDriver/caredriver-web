"use client";
import UserSelector from "@/components/app_modules/users/views/selectors/UserSelector";
import { EntityField } from "@/components/form/models/FormFields";
import { Locations } from "@/interfaces/Locations";
import { UserInterface } from "@/interfaces/UserInterface";
import { useContext } from "react";
import { isValidToBeTheEnterpriseOwner } from "../../../validators/EnterpriseOwnerValidator";
import { toast } from "react-toastify";
import { hasTheSameLocation } from "../../../utils/UserValidatorInEnterpriseHelper";
import { PageStateContext } from "@/context/PageStateContext";

interface Props {
    owner: {
        values: EntityField;
        setter: (e: EntityField) => void;
    };
    enterprise: {
        type: "mechanical" | "tow" | "laundry" | "driver";
        localization: Locations;
    };
}

const EnterpriseOwnerAdder: React.FC<Props> = ({ owner, enterprise }) => {
    const { isValid, setValid } = useContext(PageStateContext);
    const processTheUserFound = async (
        userFound: UserInterface | undefined,
    ) => {
        if (!userFound || !userFound.id) {
            owner.setter({
                value: undefined,
                message: null,
            });
            return;
        }

        if (owner.values.value && userFound.id === owner.values.value) {
            return;
        }

        if (!hasTheSameLocation(userFound, enterprise.localization)) {
            toast.error(
                "El usuario no esta en la misma localizacion que el servicio",
            );
            owner.setter({
                value: undefined,
                message: null,
            });
            return;
        }

        let isValidToBeOwner = await isValidToBeTheEnterpriseOwner(
            userFound.id,
            enterprise.type,
        );

        if (isValidToBeOwner) {
            toast.success("El usuario es valido para ser dueño de la empresa");
            owner.setter({
                value: userFound.id,
                message: null,
            });
        }
    };

    return (
        <div className="service-form-wrapper">
            <div>
                <h1 className="text | big bolder">Dueño de la empresa</h1>
                <p className="text | light">
                    Busca al usuario que quieres que sea dueño de la empresa,
                    <b>
                        el usuario debe estar en la misma localizacion que la
                        empresa.
                    </b>
                </p>
                <UserSelector
                    form={{
                        isValid: isValid,
                        setValid: setValid,
                    }}
                    processTheUserFound={processTheUserFound}
                />
                {/* TODO: add class to render as error */}
                {owner.values.message && (
                    <small>* {owner.values.message}</small>
                )}
            </div>
        </div>
    );
};

export default EnterpriseOwnerAdder;
