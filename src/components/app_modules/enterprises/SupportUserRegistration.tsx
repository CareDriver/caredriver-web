import { Enterprise, EnterpriseUser } from "@/interfaces/Enterprise";
import { UserInterface } from "@/interfaces/UserInterface";
import { updateEnterprise } from "@/utils/requests/enterprise/EnterpriseRequester";
import { DEFAULT_PHOTO } from "@/utils/user/UserData";
import { isValidEmail } from "@/utils/validator/auth/CredentialsValidator";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

const SupportUserRegistration = ({
    userToAdd,
    enterprise,
}: {
    userToAdd: UserInterface;
    enterprise: Enterprise;
}) => {
    const [formState, setFormState] = useState({
        loading: false,
        isValid: true,
    });

    const [userVerification, setUserVerification] = useState<{
        email: {
            value: string;
            message: string | null;
        };
    }>({
        email: {
            value: "",
            message: null,
        },
    });

    const registerAsSupport = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        if (!formState.loading) {
            setFormState({
                ...formState,
                loading: true,
            });
            if (isValidUserVerification() && enterprise.id && userToAdd.id) {
                let newSupportUser: EnterpriseUser = {
                    userId: userToAdd.id,
                    role: "support",
                };
                await toast.promise(
                    updateEnterprise(enterprise.id, {
                        addedUsersId: enterprise.addedUsersId
                            ? [...enterprise.addedUsersId, newSupportUser.userId]
                            : [newSupportUser.userId],
                        addedUsers: enterprise.addedUsers
                            ? [...enterprise.addedUsers, newSupportUser]
                            : [newSupportUser],
                    }),
                    {
                        pending: "Registrando al usuario como soporte",
                        success: "Nuevo usuario soporte agregado",
                        error: "Error al registrar al usuario como soporte, intentalo de nuevo por favor",
                    },
                );
                window.location.reload();
                setFormState({
                    ...formState,
                    loading: false,
                });
            } else {
                toast.error("Completa el formulario con datos validos");
                setFormState({
                    ...formState,
                    loading: false,
                });
            }
        }
    };

    const isValidUserVerification = (): boolean => {
        let isValidEmail: boolean =
            userVerification.email.value.trim().length > 0 &&
            !userVerification.email.message;
        return isValidEmail;
    };

    useEffect(() => {
        setFormState({
            ...formState,
            isValid: isValidUserVerification(),
        });
    }, [userVerification]);

    return (
        <div className="service-form-wrapper">
            <div>
                <h1 className="text | big bolder">Agregar usuario soporte</h1>
                <p className="text | light">
                    El usuario podra ayudarte a administrar los usuarios del servicio.
                </p>
            </div>

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

            <form
                onSubmit={registerAsSupport}
                className="margin-top-25"
                data-state={formState.loading ? "loading" : "loaded"}
            >
                <fieldset className="form-section">
                    <input
                        type="email"
                        name="email"
                        placeholder=""
                        value={userVerification.email.value}
                        autoComplete="off"
                        onChange={(e) => {
                            const currentEmail = e.target.value;
                            let { isValid, message } = isValidEmail(currentEmail);
                            let areEmailEquals = currentEmail === userToAdd.email;
                            if (isValid && !areEmailEquals) {
                                isValid = false;
                                message = "El correo no es el mismo que el del usuario";
                            }
                            setUserVerification({
                                ...userVerification,
                                email: {
                                    value: currentEmail,
                                    message: isValid ? null : message,
                                },
                            });
                        }}
                        className="form-section-input"
                    />
                    <legend className="form-section-legend">
                        Correo electrónico del usuario
                    </legend>
                    {userVerification.email.message && (
                        <small>{userVerification.email.message}</small>
                    )}
                </fieldset>

                <button
                    className={`general-button margin-top-25 touchable ${
                        formState.loading && "loading-section"
                    }`}
                    title={
                        !formState.isValid
                            ? "Por favor completa los campos con datos validos"
                            : ""
                    }
                    disabled={!formState.isValid}
                >
                    {formState.loading ? (
                        <span className="loader"></span>
                    ) : (
                        "Agregar usuario soporte"
                    )}
                </button>
            </form>
        </div>
    );
};

export default SupportUserRegistration;
