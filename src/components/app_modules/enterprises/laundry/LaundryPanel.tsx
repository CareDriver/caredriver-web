"use client";

import Plus from "@/icons/Plus";
import Link from "next/link";
import EnterpriseListForUsers from "../EnterpriseListForUsers";
import "@/styles/components/enterprise.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import {
    countEnterprisesActives,
    MAX_NUMBER_ENTERPRISES,
} from "@/utils/requests/enterprise/EnterpriseRequester";
import { toast } from "react-toastify";

const LaundryPanel = () => {
    const { user, loadingUser } = useContext(AuthContext);
    const [isValidToRegister, setValidToRegister] = useState<undefined | boolean>(
        undefined,
    );

    useEffect(() => {
        if (!loadingUser) {
            if (user.data && user.data.id) {
                countEnterprisesActives(user.data.id, "laundry")
                    .then((r) => {
                        if (r < MAX_NUMBER_ENTERPRISES) {
                            setValidToRegister(true);
                        } else {
                            setValidToRegister(false);
                            toast.info("Alcanzaste el limite para agregar mas servicios");
                        }
                    })
                    .catch((e) => {
                        toast.error(
                            "Error al verificar disponibilidad para agregar un nuevo servicio, intentalo de nuevo",
                        );
                        setValidToRegister(false);
                    });
            } else {
                setValidToRegister(false);
            }
        }
    }, [loadingUser]);

    return (
        <section className="enterprise-main-wrapper">
            <div>
                <h1 className="text | big bolder">Lavaderos</h1>
                <p className="text | light">Estas son los lavaderos que registraste.</p>
            </div>
            {isValidToRegister === undefined ? (
                <button className="small-general-button icon-wrapper | max-20 less-padding no-full center white-icon touchable">
                    <span className="loader"></span>
                </button>
            ) : (
                isValidToRegister === true && (
                    <Link
                        className="small-general-button icon-wrapper | max-20 less-padding no-full center white-icon touchable"
                        href={"/enterprise/laundry/register"}
                    >
                        <Plus />
                        <span className="text | white bold">Nuevo lavadero</span>
                    </Link>
                )
            )}
            <EnterpriseListForUsers type="laundry" />
        </section>
    );
};

export default LaundryPanel;
