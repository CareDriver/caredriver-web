"use client";

import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import { TextField } from "@/components/form/models/FormFields";
import { isValidTextField } from "@/components/form/validators/FieldValidators";
import { UserInterface } from "@/interfaces/UserInterface";
import { getUserByEmail } from "@/utils/requests/UserRequester";
import { FormEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import SimpleUserCard from "../cards/SimpleUserCard";
import BaseForm from "@/components/form/view/forms/BaseForm";
import EmailField from "@/components/form/view/fields/EmailField";
import { PageStateContext } from "@/context/PageStateContext";

interface Props {
    form: {
        isValid: boolean;
        setValid: (d: boolean) => void;
    };
    processTheUserFound: (userFound: UserInterface | undefined) => void;
}

const UserSelector: React.FC<Props> = ({ form, processTheUserFound }) => {
    const { loading, setLoading } = useContext(PageStateContext);
    const [userFound, setUserFound] = useState<UserInterface | undefined>(
        undefined,
    );
    const [userEmail, setUserEmail] = useState<TextField>(DEFAUL_TEXT_FIELD);

    const sameSearchAsBefore = (emailToSearch: string): boolean => {
        if (!userFound) {
            return false;
        }

        return userFound.email === emailToSearch;
    };

    const lookForTheUser = async (e: FormEvent) => {
        e.preventDefault();
        if (!loading) {
            setLoading(true);
            if (!isValidTextField(userEmail)) {
                setUserEmail((prev) => ({
                    ...prev,
                    message: "Por favor introduce un correo",
                }));
                setLoading(false);
                return;
            }
            if (sameSearchAsBefore(userEmail.value)) {
                return;
            }

            let userFound;
            try {
                userFound = await toast.promise(
                    getUserByEmail(userEmail.value),
                    {
                        pending: "Buscando al usuario",
                        error: "Error al buscar al usuario, intentalo de nuevo",
                    },
                );

                if (!userFound) {
                    setUserEmail((prev) => ({
                        ...prev,
                        message: "Usuario no encontrado",
                    }));
                }

                setUserFound(userFound);
            } catch (e) {
                console.log(e);
            }
        }
    };

    useEffect(() => {
        processTheUserFound(userFound);
        setLoading(false);
    }, [userFound]);

    return (
        <div>
            {userFound && <SimpleUserCard user={userFound} />}
            <BaseForm
                content={{
                    button: {
                        content: {
                            legend: "Buscar usuario",
                            buttonClassStyle: "small-general-button",
                        },
                        behavior: {
                            loading: loading,
                            isValid: form.isValid,
                        },
                    },
                }}
                behavior={{
                    loading: loading,
                    onSummit: lookForTheUser,
                }}
            >
                <EmailField values={userEmail} setter={setUserEmail} />
            </BaseForm>
        </div>
    );
};

export default UserSelector;
