"use client";
import { Enterprise } from "@/interfaces/Enterprise";
import {
    getAllNumPages,
    getAllPaginatedData,
} from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import { DocumentSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import "@/styles/components/enterprise.css";
import Plus from "@/icons/Plus";
import { AuthContext } from "@/context/AuthContext";
import { Locations } from "@/interfaces/Locations";
import { UserInterface } from "@/interfaces/UserInterface";
import { EntityField } from "@/components/form/models/FormFields";
import { EntityFieldSetter } from "@/components/form/models/FieldSetters";
import { ServiceType } from "@/interfaces/Services";

interface Props {
    typeOfEnterprise: ServiceType;
    field: {
        values: EntityField;
        setter: EntityFieldSetter;
    };
}

const EnterpriseSelector: React.FC<Props> = ({ typeOfEnterprise, field }) => {
    const PAGE_SIZE = 4;
    const { checkingUserAuth, user } = useContext(AuthContext);
    const [data, setData] = useState<Enterprise[] | null>(null);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(
        undefined,
    );
    const [pages, setPages] = useState<number | null>(null);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const getLocation = (user: UserInterface | null) => {
        return user && user.location
            ? user.location
            : Locations.CochabambaBolivia;
    };

    useEffect(() => {
        if (!checkingUserAuth && user) {
            let location = getLocation(user);
            getAllNumPages(location, PAGE_SIZE, typeOfEnterprise)
                .then((pages) => setPages(pages))
                .catch((e) => {
                    console.log(e);
                });
        }
    }, [checkingUserAuth]);

    useEffect(() => {
        if (!checkingUserAuth && user) {
            const startAfterDoc = lastDoc;
            const endBeforeDoc = undefined;
            setLoading(true);
            let location = getLocation(user);
            getAllPaginatedData(
                location,
                typeOfEnterprise,
                "next",
                startAfterDoc,
                endBeforeDoc,
                PAGE_SIZE,
            )
                .then((result) => {
                    if (data) {
                        setData([...data, ...result.result]);
                    } else {
                        setData(result.result);
                    }
                    setLastDoc(result.lastDoc);
                    setLoading(false);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }, [checkingUserAuth, page]);

    const handleNextClick = () => {
        if (page === pages || loading) return;
        setPage((prev) => prev + 1);
    };

    const selectEnterprise = (enterprise: Enterprise) => {
        if (data) {
            if (field.values.value && field.values.value === enterprise.id) {
                field.setter({
                    value: undefined,
                    message:
                        typeOfEnterprise === "mechanical"
                            ? null
                            : `La empresa fue seleccionada, elije otra`,
                });
            } else {
                if (enterprise.id) {
                    field.setter({
                        value: enterprise.id,
                        message: null,
                    });
                }
            }
        }
    };

    if (checkingUserAuth || !data) {
        return (
            <div className="empty-wrapper | auto-height">
                <span className="loader-green | big-loader"></span>
            </div>
        );
    }

    return (
        <div className="max-width-90">
            <div className="enterprise-list">
                {data.map((enterprise, i) => (
                    <div
                        className="enterprise-item"
                        data-state={
                            field.values.value &&
                            field.values.value === enterprise.id &&
                            "selected"
                        }
                        key={i}
                        onClick={() => selectEnterprise(enterprise)}
                    >
                        <h3 className="enterprise-item-title">
                            {enterprise.name}
                        </h3>
                        <img
                            className="enterprise-item-logo"
                            src={enterprise.logoImgUrl.url}
                            alt=""
                        />
                    </div>
                ))}
            </div>
            {page !== pages && (
                <div
                    title={
                        page === pages ? "No hay mas resultados" : "Cargar mas"
                    }
                >
                    <button
                        className="icon-wrapper small-general-button text | bold gray-icon gray | margin-top-25 touchable"
                        disabled={page === pages || loading}
                        type="button"
                        onClick={handleNextClick}
                    >
                        <Plus />
                        Mostrar mas
                    </button>
                </div>
            )}
        </div>
    );
};

export default EnterpriseSelector;
