"use client";
import CancelAndDoSomething from "@/components/form/CancelAndDoSomething";
import { UserInterface } from "@/interfaces/UserInterface";
import { updateUser } from "@/utils/requests/UserRequester";
import {
    isValidEmail,
    isValidName,
    isValidPassword,
} from "@/utils/validator/auth/CredentialsValidator";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Field {
    value: string;
    message: string | null;
}

const UserDataUpdater = ({ user }: { user: UserInterface }) => {
    const [editState, setEditState] = useState({
        loading: false,
        valid: false,
    });
    const [email, setEmail] = useState<Field>({
        value: user.email ? user.email : "",
        message: null,
    });

    const [password, setPassword] = useState<Field>({
        value: "",
        message: null,
    });

    const [fullName, setFullName] = useState<Field>({
        value: user.fullName,
        message: null,
    });

    const editCredentials = async () => {
        if (user.id && user.email) {
            try {
                const isValidPass: boolean = password.value.trim().length > 0;
                if (isValidPass) {
                    toast.loading("Actualizando contraseña");
                }
                await fetch("/api/credentials", {
                    method: "POST",
                    body: JSON.stringify({
                        userId: user.id,
                        email: user.email,
                        newEmail: email.value,
                        password: isValidPass ? password.value : "",
                    }),
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                });
                if (user.email !== email.value) {
                    await updateUser(user.id, {
                        email: email.value,
                    });
                }
            } catch (e) {
                console.log(e);
            }
        }
    };

    const editFullName = async () => {
        if (user.id) {
            try {
                await toast.promise(updateUser(user.id, { fullName: fullName.value }), {
                    pending: "Cambiando el nombre",
                    success: "Nombre cambiado",
                    error: "Error al cambiar el nombre, intentalo de nuevo por favor",
                });
            } catch (e) {
                console.log(e);
            }
        }
    };

    const editData = async () => {
        if (fullName.value === user.fullName && email.value === user.email) {
            return;
        }

        setEditState({
            ...editState,
            loading: true,
        });
        try {
            const credentialsChanged: boolean =
                (user.email && user.email !== email.value) ||
                password.value.trim().length > 0;
            console.log(password.value);
            console.log(password.value.trim().length > 0);
            const fullNameChanged: boolean = user.fullName !== fullName.value;
            if (credentialsChanged) {
                await toast.promise(editCredentials(), {
                    pending: "Cambiando credenciales",
                    success: "Credenciales cambiadas",
                    error: "Error al cambiar credenciales, intentalo de nuevo por favor",
                });
            }

            if (fullNameChanged) {
                await toast.promise(editFullName(), {
                    pending: "Cambiando el nombre",
                    success: "Nombre cambiado",
                    error: "Error al cambiar el nombre",
                });
            }
            window.location.reload();
            setEditState({
                ...editState,
                loading: false,
            });
        } catch (e) {
            console.log(e);

            setEditState({
                ...editState,
                loading: false,
            });
        }
    };

    const cancelEdit = async () => {
        setEmail({
            value: user.email ? user.email : "",
            message: null,
        });
        setFullName({
            value: user.fullName,
            message: null,
        });
        setPassword({
            value: "",
            message: null,
        });
    };

    useEffect(() => {
        setEditState({
            ...editState,
            valid: !email.message && !password.message && !fullName.message,
        });
    }, [email, password, fullName]);

    return (
        <div className="form-container | full-form margin-top-50 max-width-60">
            <div className="margin-bottom-15">
                <h2 className="text | bold medium-big">Actualizacion de datos</h2>
                <p className="text | light small">
                    Solo se actualizara los <b>datos que sean diferentes</b> a los datos
                    actuales y que sean validos.{" "}
                    <b>Tendras que volver a authenticarte si cambias tus credenciales</b>
                </p>
            </div>
            <fieldset className="form-section">
                <input
                    type="text"
                    name="fullName"
                    placeholder=""
                    value={fullName.value}
                    onChange={(e) => {
                        const value = e.target.value;
                        const { isValid, message } = isValidName(value);
                        setFullName({
                            value: value,
                            message: isValid ? null : message,
                        });
                    }}
                    className="form-section-input"
                />
                <legend className="form-section-legend">Nombre completo</legend>
                {fullName.message && <small>{fullName.message}</small>}
            </fieldset>
            <fieldset className="form-section">
                <input
                    type="email"
                    name="email"
                    placeholder=""
                    value={email.value}
                    onChange={(e) => {
                        const value = e.target.value;
                        const { isValid, message } = isValidEmail(value);
                        setEmail({
                            value: value,
                            message: isValid ? null : message,
                        });
                    }}
                    className="form-section-input"
                />
                <legend className="form-section-legend">Correo electrónico</legend>
                {email.message && <small>{email.message}</small>}
            </fieldset>

            <fieldset className="form-section">
                <input
                    type="text"
                    name="password"
                    placeholder=""
                    value={password.value}
                    onChange={(e) => {
                        const value = e.target.value;
                        const { isValid, message } = isValidPassword(value);
                        setPassword({
                            value: value,
                            message: isValid ? null : message,
                        });
                    }}
                    className="form-section-input"
                />
                <legend className="form-section-legend">Nueva contraseña</legend>
                {password.message && <small>{password.message}</small>}
            </fieldset>

            <CancelAndDoSomething
                doSomethingText="Actualizar"
                isSecondButtonAble={editState.valid}
                loading={editState.loading}
                onCancel={cancelEdit}
                onDoSomething={editData}
            />
        </div>
    );
};

export default UserDataUpdater;
