"use client";

import { Enterprise } from "@/interfaces/Enterprise";
import { UserInterface } from "@/interfaces/UserInterface";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import "@/styles/components/users.css";
import NewUserSupportForm from "./NewUserSupportForm";
import UserSelector from "../../../../users/views/selectors/UserSelector";
import NewVehicleForm from "../../../../server_users/views/form_requests/requests_to_be_servers/for_driver/NewVehicleForm";
import NewDriverForm from "../../../../server_users/views/form_requests/requests_to_be_servers/for_driver/NewDriverForm";
import NewMechanicForm from "../../../../server_users/views/form_requests/requests_to_be_servers/for_mechanic/NewMechanicForm";
import NewCraneOperatorForm from "../../../../server_users/views/form_requests/requests_to_be_servers/for_crane_operator/NewCraneOperatorForm";
import NewLaundererForm from "../../../../server_users/views/form_requests/requests_to_be_servers/for_launderer/NewLaundererForm";
import {
    checkRegistrationForSingleVehicule,
    hasTheSameLocationOfEnterprise,
} from "../../../utils/UserValidatorInEnterpriseHelper";
import { userBelongsToEnterprise } from "../../../validators/EnterpriseValidator";
import { IUserValidatableInEnterprise } from "../../../validators/user_validators_with_enterprises/IUserValidatableInEnterprise";
import { UserValidatorInDriverEnterprise } from "../../../validators/user_validators_with_enterprises/UserValidatorInDriverEnterprise";
import { UserValidatorInWorkshop } from "../../../validators/user_validators_with_enterprises/UserValidatorInWorkshop";
import { UserValidatorInLaundry } from "../../../validators/user_validators_with_enterprises/UserValidatorInLaundry";
import { UserValidatorInTow } from "../../../validators/user_validators_with_enterprises/UserValidatorInTow";
import { PageStateContext } from "@/context/PageStateContext";

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
    const [isValid, setValid] = useState(false);
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
        if (validator.isAbleToBeUserServer(user)) {
            setUserToAdd((prev) => ({
                ...prev,
                role: "ServerUser",
            }));
        }
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
        if (validator.isAbleToBeSupportUser(user)) {
            setUserToAdd((prev) => ({
                ...prev,
                role: "SupportUser",
            }));
        }
    };

    const checkUserAvailability = (userFound: UserInterface | undefined) => {
        if (!userFound) {
            return;
        }

        if (hasTheSameLocationOfEnterprise(userFound, enterprise)) {
            toast.error(
                "El usuario no esta en la misma localizacion que el servicio",
            );
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
        <div data-state={loading ? "loading" : "loaded"}>
            {!userToAdd.role && (
                <div className="service-form-wrapper">
                    <div>
                        <h1 className="text | big bolder">
                            Agregar usuario al servicio
                        </h1>
                        <p className="text | light">
                            Primero busca al usuario que quieres agregar por su
                            correo,{" "}
                            <b>el correo debe estar completo y bien escrito</b>
                        </p>
                    </div>

                    <UserSelector
                        form={{
                            isValid: isValid,
                            setValid: setValid,
                        }}
                        processTheUserFound={checkUserAvailability}
                    />
                    {userToAdd.data !== undefined &&
                        userToAdd.role !== undefined && (
                            <div className="margin-top-25 row-wrapper">
                                <h3 className="text">Agregar usuario como</h3>
                                <div className="separator-horizontal"></div>
                                <button
                                    type="button"
                                    className="small-general-button text | bold green touchable"
                                    onClick={() =>
                                        registerAsUserServer(userToAdd.data)
                                    }
                                >
                                    Usuario Servidor
                                </button>
                                <button
                                    type="button"
                                    className="small-general-button text | bold green touchable"
                                    onClick={() =>
                                        registerAsSupportUser(userToAdd.data)
                                    }
                                >
                                    Usuario Soporte
                                </button>
                            </div>
                        )}
                    {userLogged.id &&
                        userLogged.id === enterprise.userId &&
                        !userBelongsToEnterprise(userLogged, enterprise) &&
                        !validator.hasActiveRequests(userLogged) && (
                            <div className="margin-top-25">
                                <div className="separator-horizontal"></div>
                                <div className="margin-top-25">
                                    <h1 className="text | big bolder">
                                        ¿Quieres registrarte en este servicio?
                                    </h1>
                                    <p className="text | light margin-top-15">
                                        Como dueño o administrador de este
                                        servicio, tambien puedes hacer una
                                        solicitud para trabajar como usuario
                                        servicio con este servicio.
                                    </p>
                                    <button
                                        type="button"
                                        className="small-general-button text | bold green touchable margin-top-25"
                                        onClick={() =>
                                            registerAsUserServer(userLogged)
                                        }
                                    >
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
        </div>
    );
};

export default UserAdderToEnterprise;

function getValidator(enterprise: Enterprise): IUserValidatableInEnterprise {
    switch (enterprise.type) {
        case "driver":
            return new UserValidatorInDriverEnterprise(enterprise);
        case "mechanical":
            return new UserValidatorInWorkshop(enterprise);
        case "laundry":
            return new UserValidatorInLaundry(enterprise);
        default:
            return new UserValidatorInTow(enterprise);
    }
}
