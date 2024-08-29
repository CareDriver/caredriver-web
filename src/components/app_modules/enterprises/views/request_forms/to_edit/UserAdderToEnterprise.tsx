"use client";

import { Enterprise } from "@/interfaces/Enterprise";
import { UserInterface, UserRole } from "@/interfaces/UserInterface";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import "@/styles/components/users.css";
import NewUserSupportForm from "./NewUserSupportForm";
import UserSelector from "../../../../users/views/selectors/UserSelector";
import NewVehicleForm from "../../../../server_users/views/request_forms/requests_to_be_servers/for_driver/NewVehicleForm";
import NewDriverForm from "../../../../server_users/views/request_forms/requests_to_be_servers/for_driver/NewDriverForm";
import NewMechanicForm from "../../../../server_users/views/request_forms/requests_to_be_servers/for_mechanic/NewMechanicForm";
import NewCraneOperatorForm from "../../../../server_users/views/request_forms/requests_to_be_servers/for_crane_operator/NewCraneOperatorForm";
import NewLaundererForm from "../../../../server_users/views/request_forms/requests_to_be_servers/for_launderer/NewLaundererForm";
import {
    checkRegistrationForSingleVehicule,
    hasTheSameLocationOfEnterprise,
    userBelongsToEnterprise,
} from "../../../validators/validators_of_user_aggregators_to_enterprise/as_members/UserAggregatorValidatorToEnterpriseHelper";
import { PageStateContext } from "@/context/PageStateContext";
import Users from "@/icons/Users";
import UserTie from "@/icons/UserTie";
import { IUserAggregatorValidatorToEnterpriseAsMember } from "../../../validators/validators_of_user_aggregators_to_enterprise/as_members/IUserAggregatorValidatorToEnterpriseAsMember";
import { ValidatorToAddUserToDriverEnterpriseAsMember } from "../../../validators/validators_of_user_aggregators_to_enterprise/as_members/concrete/ValidatorToAddUserToDriverEnterpriseAsMember";
import { ValidatorToAddUserToWorkshopEnterpriseAsMember } from "../../../validators/validators_of_user_aggregators_to_enterprise/as_members/concrete/ValidatorToAddUserToWorkshopEnterpriseAsMember";
import { ValidatorToAddUserToLaundryEnterpriseAsMember } from "../../../validators/validators_of_user_aggregators_to_enterprise/as_members/concrete/ValidatorToAddUserToLaundryEnterpriseAsMember";
import { ValidatorToAddUserToCraneEnterpriseAsMember } from "../../../validators/validators_of_user_aggregators_to_enterprise/as_members/concrete/ValidatorToAddUserToCraneEnterpriseAsMember";
import UserGear from "@/icons/UserGear";
import HelmetSafety from "@/icons/HelmetSafety";

interface UserToAdd {
    data: UserInterface | undefined;
    role: "ServerUser" | "SupportUser" | undefined;
}

const DEAFULT_USER_TO_ADD: UserToAdd = {
    data: undefined,
    role: undefined,
};

interface Props {
    userLogged: UserInterface;
    enterprise: Enterprise;
}

const UserAdderToEnterprise: React.FC<Props> = ({ userLogged, enterprise }) => {
    const { loading } = useContext(PageStateContext);
    const [formState, setFormState] = useState<{
        isValid: boolean;
        message: string | null;
    }>({
        isValid: false,
        message: null,
    });
    const [userToAdd, setUserToAdd] = useState<UserToAdd>(DEAFULT_USER_TO_ADD);
    const validator = getValidator(enterprise);

    const registerAsUserServer = (user: UserInterface | undefined): void => {
        if (!user) {
            toast.error("Usuario no encontrado");
            return;
        }

        setUserToAdd((prev) => ({
            ...prev,
            data: user,
        }));

        const { isValid, message } = validator.isAbleToBeUserServer(user);
        if (isValid) {
            setUserToAdd((prev) => ({
                ...prev,
                role: "ServerUser",
            }));
        }
        setFormState((prev) => ({ ...prev, isValid, message }));
    };

    const registerAsSupportUser = (user: UserInterface | undefined): void => {
        if (!user) {
            toast.error("Usuario no encontrado");
            return;
        }

        setUserToAdd((prev) => ({
            ...prev,
            data: user,
        }));
        const { isValid, message } = validator.isAbleToBeSupportUser(user);
        if (isValid) {
            setUserToAdd((prev) => ({
                ...prev,
                role: "SupportUser",
            }));
        }
        setFormState((prev) => ({ ...prev, isValid, message }));
    };

    const checkUserAvailability = (userFound: UserInterface | undefined) => {
        /**
         * no processing due to this validation already exits
         * on the user selector
         */
        if (!userFound) {
            return;
        }

        if (!hasTheSameLocationOfEnterprise(userFound, enterprise)) {
            setFormState((prev) => ({
                ...prev,
                isValid: false,
                message:
                    "El usuario no esta en la misma localizacion que el servicio",
            }));
        } else if (userFound.role !== UserRole.User) {
            setFormState((prev) => ({
                ...prev,
                isValid: false,

                message: "El usuario no puede ser miembro de la empresa",
            }));
        } else {
            setFormState((prev) => ({
                ...prev,
                isValid: true,
                message: null,
            }));
        }

        setUserToAdd((prev) => ({
            ...prev,
            data: userFound,
        }));
    };

    const getEnterpriseUserAdder = (
        typeAdder: "ServerUser" | "SupportUser",
        userToAdd: UserInterface,
    ) => {
        if (typeAdder === "ServerUser" && enterprise.id) {
            switch (enterprise.type) {
                case "driver":
                    let { isAbleToRegisterASingleVehicule, type } =
                        checkRegistrationForSingleVehicule(userToAdd);
                    return isAbleToRegisterASingleVehicule && type ? (
                        <NewVehicleForm
                            type={type}
                            baseUser={userToAdd}
                            defaultTowEnterprise={enterprise.id}
                        />
                    ) : (
                        <NewDriverForm
                            baseUser={userToAdd}
                            defaultTowEnterprise={enterprise.id}
                        />
                    );
                case "mechanical":
                    return (
                        <NewMechanicForm
                            baseUser={userToAdd}
                            baseEnterprise={enterprise.id}
                        />
                    );
                case "tow":
                    return (
                        <NewCraneOperatorForm
                            baseUser={userToAdd}
                            baseEnterprise={enterprise.id}
                        />
                    );
                default:
                    return (
                        <NewLaundererForm
                            baseUser={userToAdd}
                            baseEnterprise={enterprise.id}
                        />
                    );
            }
        } else {
            return (
                <NewUserSupportForm
                    userToAdd={userToAdd}
                    enterprise={enterprise}
                />
            );
        }
    };

    return (
        <>
            {!userToAdd.role && (
                <div className="service-form-wrapper">
                    <h1 className="text | big bolder">Agregar usuarios</h1>
                    <div className="margin-top-25">
                        <h2 className="text | medium-big bolder | icon-wrapper lb">
                            <Users />
                            Registrar usuarios servidores | Agregar usuarios
                            soporte
                        </h2>
                        <p className="text | light">
                            Primero busca al usuario que quieres agregar por su
                            correo,{" "}
                            <b>el correo debe estar completo y bien escrito</b>
                        </p>
                    </div>

                    <UserSelector
                        form={{
                            isValid: formState.isValid,
                            setValid: (d) =>
                                setFormState((prev) => ({
                                    ...prev,
                                    isValid: d,
                                })),
                            stateFeedback: {
                                type: formState.isValid ? "success" : "fail",
                                message: formState.message,
                            },
                        }}
                        processTheUserFound={checkUserAvailability}
                    />
                    {userToAdd.data !== undefined && (
                        <div className="margin-top-25">
                            <h3 className="text | bold">
                                Agregar usuario como:
                            </h3>
                            <div className="margin-top-15 row-wrapper">
                                <button
                                    type="button"
                                    className="small-general-button text | bold green touchable | icon-wrapper white-icon"
                                    onClick={() =>
                                        registerAsUserServer(userToAdd.data)
                                    }
                                >
                                    <HelmetSafety />
                                    Usuario Servidor
                                </button>
                                <button
                                    type="button"
                                    className="small-general-button text | bold green touchable | icon-wrapper white-icon lb"
                                    onClick={() =>
                                        registerAsSupportUser(userToAdd.data)
                                    }
                                >
                                    <UserGear />
                                    Usuario Soporte
                                </button>
                            </div>
                        </div>
                    )}
                    {userLogged.id &&
                        userLogged.id === enterprise.userId &&
                        !userBelongsToEnterprise(userLogged, enterprise) &&
                        !validator.hasActiveRequests(userLogged) && (
                            <div className="margin-top-25">
                                <div className="separator-horizontal"></div>
                                <div className="margin-top-25">
                                    <h1 className="text | medium-big bolder | icon-wrapper">
                                        <UserTie />
                                        Registrate como usuario servidor
                                    </h1>
                                    <p className="text | light margin-top-15">
                                        Como dueño o administrador de esta
                                        empresa, tambien puedes hacer una
                                        solicitud para trabajar como usuario
                                        servidor asociada a esta empresa.
                                    </p>
                                    <button
                                        type="button"
                                        className="small-general-button text | bold green touchable margin-top-25  | icon-wrapper white-icon"
                                        onClick={() =>
                                            registerAsUserServer(userLogged)
                                        }
                                    >
                                        <HelmetSafety />
                                        Registrarme como Usuario Servidor
                                    </button>
                                </div>
                            </div>
                        )}
                </div>
            )}

            {userToAdd.data &&
                userToAdd.role &&
                getEnterpriseUserAdder(userToAdd.role, userToAdd.data)}
        </>
    );
};

export default UserAdderToEnterprise;

function getValidator(
    enterprise: Enterprise,
): IUserAggregatorValidatorToEnterpriseAsMember {
    switch (enterprise.type) {
        case "driver":
            return new ValidatorToAddUserToDriverEnterpriseAsMember(enterprise);
        case "mechanical":
            return new ValidatorToAddUserToWorkshopEnterpriseAsMember(
                enterprise,
            );
        case "laundry":
            return new ValidatorToAddUserToLaundryEnterpriseAsMember(
                enterprise,
            );
        default:
            return new ValidatorToAddUserToCraneEnterpriseAsMember(enterprise);
    }
}
