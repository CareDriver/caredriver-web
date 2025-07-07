"use client";
import UserSelector from "@/components/app_modules/users/views/selectors/UserSelector";
import { EntityField } from "@/components/form/models/FormFields";
import { Locations } from "@/interfaces/Locations";
import { UserInterface } from "@/interfaces/UserInterface";
import { useContext, useEffect, useState } from "react";
import { verifyUserAvailabilityToBeEnterpriseOwner } from "../../../validators/validators_of_user_aggregators_to_enterprise/as_owners/EnterpriseOwnerValidator";
import { toast } from "react-toastify";
import { PageStateContext } from "@/context/PageStateContext";
import { ServiceType } from "@/interfaces/Services";
import { isValidEntityField } from "@/components/form/validators/FieldValidators";

interface Props {
  owner: {
    values: EntityField;
    setter: (e: EntityField) => void;
  };
  enterprise: {
    type: ServiceType;
    localization: Locations;
  };
}

const EnterpriseOwnerAdder: React.FC<Props> = ({ owner, enterprise }) => {
  const { isValid, setLoading, setValid } = useContext(PageStateContext);
  const [userToBeOwner, setUserToBeOwner] = useState<UserInterface | undefined>(
    undefined,
  );
  const SUCCESS_USER_FOUND_MESSAGE =
    "Usuario valido para ser dueño de la empresa";

  const processTheUserFound = async (userFound: UserInterface | undefined) => {
    setUserToBeOwner(userFound);
  };

  useEffect(() => {
    if (userToBeOwner) {
      setLoading(true);
      verifyUserAvailabilityToBeEnterpriseOwner(
        userToBeOwner,
        enterprise.type,
        enterprise.localization,
      )
        .then((res) => {
          if (userToBeOwner.id) {
            owner.setter({
              value: userToBeOwner.id,
              message: res.isValid ? null : res.message,
            });
          }
        })
        .catch(() => {
          toast.error(
            "Error al verificar al usuario, intentanlo de nuevo por favor",
          );
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      owner.setter({
        value: undefined,
        message: null,
      });
    }
  }, [
    enterprise.localization,
    userToBeOwner,
    enterprise.type,
    owner,
    setLoading,
  ]);

  return (
    <div>
      <div>
        <h1 className="text | bold">Dueño de la empresa</h1>
        <p className="text | light">
          Busca al usuario que quieres que sea dueño de la empresa,
          <b>el usuario debe estar en la misma localización que la empresa.</b>
        </p>

        <UserSelector
          form={{
            isValid: isValid,
            setValid: setValid,
            stateFeedback: {
              type: isValidEntityField(owner.values) ? "success" : "fail",
              message:
                isValidEntityField(owner.values) && userToBeOwner
                  ? SUCCESS_USER_FOUND_MESSAGE
                  : owner.values.message,
            },
          }}
          processTheUserFound={processTheUserFound}
        />
      </div>
    </div>
  );
};

export default EnterpriseOwnerAdder;
