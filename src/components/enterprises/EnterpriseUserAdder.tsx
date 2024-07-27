"use client";

import { Enterprise } from "@/interfaces/Enterprise";
import { UserInterface } from "@/interfaces/UserInterface";
import { getUserByEmail } from "@/utils/requests/UserRequester";
import {
    isValidEmail,
    isValidEmailFrom,
} from "@/utils/validator/auth/CredentialsValidator";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import DriverEnterpriseUserAdder from "./driver/DriverEnterpriseUserAdder";
import { DEFAULT_PHOTO } from "@/utils/user/UserData";
import "@/styles/components/users.css";
import { ServiceReqState, Services } from "@/interfaces/Services";

const EnterpriseUserAdder = ({ enterprise }: { enterprise: Enterprise }) => {
    const [formState, setFormState] = useState<{
        loading: boolean;
        selectedUser: "ServerUser" | "SupportUser" | null;
        isValidUserFinder: boolean;
    }>({
        loading: false,
        selectedUser: null,
        isValidUserFinder: true,
    });
    const [userEmail, setUserEmail] = useState<{
        value: string;
        message: string | null;
    }>({
        value: "",
        message: null,
    });
    const [userToAdd, setUserToAdd] = useState<undefined | UserInterface>(undefined);

    const isAlreadyDriverUser = (userToAdd: UserInterface): boolean => {
        return (
            userToAdd.services.includes(Services.Driver) ||
            userToAdd.serviceRequests?.driveCar?.state === ServiceReqState.Approved ||
            userToAdd.serviceRequests?.driveCar?.state === ServiceReqState.Reviewing ||
            userToAdd.serviceRequests?.driveMotorcycle?.state ===
                ServiceReqState.Approved ||
            userToAdd.serviceRequests?.driveMotorcycle?.state ===
                ServiceReqState.Reviewing
        );
    };

    const isAlreadyUserServer = (userToAdd: UserInterface): boolean => {
        switch (enterprise.type) {
            case "driver":
                return isAlreadyDriverUser(userToAdd);
            default:
                return false;
        }
    };

    const registerAsUserServer = (userToAdd: UserInterface) => {
        if (isAlreadyUserServer(userToAdd)) {
            toast.error(
                "El usuario ya es chofer, no puede ser agregado a un nuevo servicio",
            );
        } else {
            setFormState({
                ...formState,
                selectedUser: "ServerUser",
            });
        }
    };

    const lookForTheUser = async (e: FormEvent) => {
        e.preventDefault();
        if (!formState.loading) {
            setFormState({
                ...formState,
                loading: true,
            });
            if (isValidEmailFrom(userEmail)) {
                let userFound;
                try {
                    userFound = await toast.promise(getUserByEmail(userEmail.value), {
                        pending: "Buscando al usuario",
                        error: "",
                    });
                } catch (e) {
                    console.log(e);
                }
                if (!userFound) {
                    setUserEmail({
                        ...userEmail,
                        message: "Usuario no encontrado",
                    });
                    setFormState({
                        ...formState,
                        loading: false,
                    });
                    setUserToAdd(undefined);
                } else if (
                    enterprise.addedUsersId &&
                    userFound.id &&
                    enterprise.addedUsersId.includes(userFound.id)
                ) {
                    setUserEmail({
                        ...userEmail,
                        message: "El usuario ya esta agregado",
                    });
                    setFormState({
                        ...formState,
                        loading: false,
                    });
                    setUserToAdd(undefined);
                } else if (userFound.location !== enterprise.location) {
                    setUserEmail({
                        ...userEmail,
                        message:
                            "El usuario no esta en la misma localizacion que la empresa",
                    });
                    setFormState({
                        ...formState,
                        loading: false,
                    });
                    setUserToAdd(undefined);
                } else if (userFound.id && userFound.id === enterprise.userId) {
                    setUserEmail({
                        ...userEmail,
                        message: "Tu eres el administrador de la empresa",
                    });
                    setFormState({
                        ...formState,
                        loading: false,
                    });
                    setUserToAdd(undefined);
                } else {
                    setUserToAdd(userFound);
                    setFormState({
                        ...formState,
                        loading: false,
                    });
                }
            } else {
                setUserEmail({
                    ...userEmail,
                    message: "Por favor introduce un correo",
                });
                setFormState({
                    ...formState,
                    loading: false,
                });
            }
        }
    };

    useEffect(() => {
        setFormState({
            ...formState,
            isValidUserFinder: isValidEmailFrom(userEmail),
        });
    }, [userEmail]);

    const getEnterpriseUserAdder = (
        typeAdder: "ServerUser" | "SupportUser",
        userToAdd: UserInterface,
    ) => {
        if (typeAdder === "ServerUser") {
            switch (enterprise.type) {
                case "driver":
                    return <DriverEnterpriseUserAdder userToAdd={userToAdd} />;
            }
        }
    };

    return (
        <div className="form-container | margin-top-25">
            {formState.selectedUser === null && (
                <>
                    <div>
                        <h1 className="text | big bolder">Agregar usuario al servicio</h1>
                        <p className="text | light">
                            Primero busca al usuario que quieres agregar por su correo,{" "}
                            <b>el correo debe estar completo y bien escrito</b>
                        </p>
                    </div>

                    {userToAdd !== undefined && formState.selectedUser === null && (
                        <div className="users-item | max-width-60">
                            <img
                                src={
                                    userToAdd.photoUrl.url === ""
                                        ? DEFAULT_PHOTO
                                        : userToAdd.photoUrl.url
                                }
                                alt=""
                                className="users-item-photo"
                            />
                            <div>
                                <h2 className="text | bolder big-medium-v2 capitalize">
                                    {userToAdd.fullName}
                                </h2>
                                <h4 className="text | light">{userToAdd.email}</h4>
                                <h4 className="text | light">{userToAdd.location}</h4>
                            </div>
                        </div>
                    )}

                    <form
                        onSubmit={lookForTheUser}
                        className="form-container | max-width-60"
                        data-state={formState.loading ? "loading" : "loaded"}
                    >
                        <fieldset className="form-section">
                            <input
                                type="email"
                                name="email"
                                placeholder=""
                                value={userEmail.value}
                                onChange={(e) => {
                                    const currentEmail = e.target.value;
                                    const { isValid, message } =
                                        isValidEmail(currentEmail);
                                    setUserEmail({
                                        value: currentEmail,
                                        message: isValid ? null : message,
                                    });
                                }}
                                className="form-section-input"
                            />
                            <legend className="form-section-legend">
                                Correo electrónico del usuario
                            </legend>
                            {userEmail.message && <small>{userEmail.message}</small>}
                        </fieldset>

                        <button
                            className={`general-button touchable ${
                                formState.loading && "loading-section"
                            }`}
                            title={
                                !formState.isValidUserFinder
                                    ? "Por favor completa los campos con datos validos"
                                    : ""
                            }
                            disabled={!formState.isValidUserFinder}
                        >
                            {formState.loading ? (
                                <span className="loader"></span>
                            ) : (
                                "Buscar usuario"
                            )}
                        </button>
                    </form>
                </>
            )}

            {userToAdd !== undefined && formState.selectedUser === null && (
                <div className="row-wrapper">
                    <button
                        type="button"
                        className="small-general-button text | bold green touchable"
                        onClick={() => registerAsUserServer(userToAdd)}
                    >
                        Registrar como Usuario Servidor
                    </button>

                    <button
                        type="button"
                        className="small-general-button text | bold green touchable"
                        onClick={() =>
                            setFormState({
                                ...formState,
                                selectedUser: "SupportUser",
                            })
                        }
                    >
                        Agregar como Usuario Soporte
                    </button>
                </div>
            )}
            {userToAdd &&
                formState.selectedUser &&
                getEnterpriseUserAdder(formState.selectedUser, userToAdd)}
        </div>
    );
};

export default EnterpriseUserAdder;
