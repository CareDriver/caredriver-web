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
import { DEFAULT_PHOTO } from "@/utils/user/UserData";
import "@/styles/components/users.css";
import { ServiceReqState, Services } from "@/interfaces/Services";
import DriverRegistration from "../services/drive/registration/DriverRegistration";
import MechanicRegistration from "../services/mechanic/registration/MechanicRegistration";
import TowRegistration from "../services/tow/registration/TowRegistration";
import LaundryRegistration from "../services/laundry/registration/LaundryRegistration";
import AddNewVehicle from "../services/drive/registration/AddNewVehicle";

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

    const belongsToTheService = (
        user: UserInterface,
        enterprise: Enterprise,
    ): boolean => {
        return (
            user.id !== undefined &&
            enterprise.addedUsersId !== undefined &&
            enterprise.addedUsersId.includes(user.id)
        );
    };

    const checkRegistrationForSingleVehicule = (
        user: UserInterface,
    ): {
        isAbleToRegisterASingleVehicule: boolean;
        type: "car" | "motorcycle" | undefined;
    } => {
        let type: "car" | "motorcycle" | undefined = undefined;
        let isCarNotRegistered: boolean =
            user.serviceRequests !== undefined &&
            user.serviceRequests.driveMotorcycle !== undefined &&
            user.serviceRequests.driveMotorcycle.state === ServiceReqState.Approved &&
            (user.serviceRequests.driveCar === undefined ||
                user.serviceRequests.driveCar.state === ServiceReqState.NotSent ||
                user.serviceRequests.driveCar.state === ServiceReqState.Refused);

        let isMotorcycleNotRegistered: boolean =
            user.serviceRequests !== undefined &&
            user.serviceRequests.driveCar !== undefined &&
            user.serviceRequests.driveCar.state === ServiceReqState.Approved &&
            (user.serviceRequests.driveMotorcycle === undefined ||
                user.serviceRequests.driveMotorcycle.state === ServiceReqState.NotSent ||
                user.serviceRequests.driveMotorcycle.state === ServiceReqState.Refused);

        if (isCarNotRegistered) {
            type = "car";
        } else if (isMotorcycleNotRegistered) {
            type = "motorcycle";
        }

        return {
            isAbleToRegisterASingleVehicule:
                isCarNotRegistered || isMotorcycleNotRegistered,
            type,
        };
    };

    const isAbleToBeDriver = (user: UserInterface): boolean => {
        let isAble = true;

        let isDriver: boolean =
            user.serviceRequests?.driveCar?.state === ServiceReqState.Approved ||
            user.serviceRequests?.driveMotorcycle?.state === ServiceReqState.Approved;

        let hasRequestsReviwing: boolean =
            user.serviceRequests?.driveCar?.state === ServiceReqState.Reviewing ||
            user.serviceRequests?.driveMotorcycle?.state === ServiceReqState.Reviewing;

        let belongsToDriverService: boolean = belongsToTheService(user, enterprise);
        let { isAbleToRegisterASingleVehicule } =
            checkRegistrationForSingleVehicule(user);

        if (isAble && hasRequestsReviwing) {
            isAble = false;
            toast.error(
                "El usuario ya tiene una peticion en progreso, espera a que sea revisada",
            );
        }

        if (isAble && isDriver && !belongsToDriverService) {
            isAble = false;
            toast.error("El usuario ya fue agregado a otro servicio");
        }

        if (isAble && belongsToDriverService && isAbleToRegisterASingleVehicule) {
            toast.info("El usuario solo puede registrar el vehiculo faltante");
        }

        return isAble;
    };

    const isAbleToBeUserServer = (user: UserInterface): boolean => {
        switch (enterprise.type) {
            case "driver":
                return isAbleToBeDriver(user);
            default:
                return false;
        }
    };

    const registerAsUserServer = (user: UserInterface) => {
        if (isAbleToBeUserServer(user)) {
            setFormState({
                ...formState,
                selectedUser: "ServerUser",
            });
        }
    };

    const checkUserAvailability = (userFound: UserInterface | undefined) => {
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
        } else if (userFound.location !== enterprise.location) {
            setUserEmail({
                ...userEmail,
                message: "El usuario no esta en la misma localizacion que la empresa",
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
                    checkUserAvailability(userFound);
                } catch (e) {
                    console.log(e);
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
        if (typeAdder === "ServerUser" && enterprise.id) {
            switch (enterprise.type) {
                case "driver":
                    let { isAbleToRegisterASingleVehicule, type } =
                        checkRegistrationForSingleVehicule(userToAdd);
                    return isAbleToRegisterASingleVehicule && type ? (
                        <AddNewVehicle
                            type={type}
                            baseUser={userToAdd}
                            defaultTowEnterprise={enterprise.id}
                        />
                    ) : (
                        <DriverRegistration
                            baseUser={userToAdd}
                            defaultTowEnterprise={enterprise.id}
                        />
                    );
                case "mechanical":
                    return (
                        <MechanicRegistration
                            baseUser={userToAdd}
                            defaultTowEnterprise={enterprise.id}
                        />
                    );
                case "tow":
                    return (
                        <TowRegistration
                            baseUser={userToAdd}
                            defaultTowEnterprise={enterprise.id}
                        />
                    );
                default:
                    return (
                        <LaundryRegistration
                            baseUser={userToAdd}
                            defaultTowEnterprise={enterprise.id}
                        />
                    );
            }
        }
    };

    return (
        <div>
            {formState.selectedUser === null && (
                <div className="service-form-wrapper">
                    <div>
                        <h1 className="text | big bolder">Agregar usuario al servicio</h1>
                        <p className="text | light">
                            Primero busca al usuario que quieres agregar por su correo,{" "}
                            <b>el correo debe estar completo y bien escrito</b>
                        </p>
                    </div>

                    {userToAdd !== undefined && formState.selectedUser === null && (
                        <div className="users-item | margin-top-25">
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
                        className="margin-top-25"
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
                            className={`general-button margin-top-25 touchable ${
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
                    {userToAdd !== undefined && formState.selectedUser === null && (
                        <div className="margin-top-25 row-wrapper">
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
                </div>
            )}

            {userToAdd &&
                formState.selectedUser &&
                getEnterpriseUserAdder(formState.selectedUser, userToAdd)}
        </div>
    );
};

export default EnterpriseUserAdder;
