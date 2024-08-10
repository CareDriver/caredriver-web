"use client";
import {
    Enterprise,
    EnterpriseType,
    EnterpriseTypeRenderPronoun,
} from "@/interfaces/Enterprise";
import {
    getAllNumPages,
    getAllPaginatedData,
} from "@/utils/requests/enterprise/EnterpriseRequester";
import { DocumentSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import "@/styles/components/enterprise.css";
import Plus from "@/icons/Plus";
import { EnterpriseField } from "../services/FormModels";
import { getEmptyEnterprise } from "@/utils/parser/ToSpanishEnterprise";
import { AuthContext } from "@/context/AuthContext";
import { Locations } from "@/interfaces/Locations";
import { UserInterface } from "@/interfaces/UserInterface";

const EnterpriseSelector = ({
    type,
    enterpriseFiled,
    setEnterprise,
}: {
    type: EnterpriseType;
    enterpriseFiled: EnterpriseField;
    setEnterprise: (enterprise: EnterpriseField) => void;
}) => {
    const numPerPage = 4;
    const { loadingUser, user } = useContext(AuthContext);
    const [data, setData] = useState<Enterprise[] | null>(null);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [pages, setPages] = useState<number | null>(null);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const getLocation = (user: UserInterface | null) => {
        return user && user.location ? user.location : Locations.CochabambaBolivia;
    };

    useEffect(() => {
        if (!loadingUser) {
            let location = getLocation(user.data);
            getAllNumPages(location, numPerPage, type)
                .then((pages) => setPages(pages))
                .catch((e) => {
                    console.log(e);
                });
        }
    }, [loadingUser]);

    useEffect(() => {
        if (!loadingUser) {
            const startAfterDoc = lastDoc;
            const endBeforeDoc = undefined;
            setLoading(true);
            let location = getLocation(user.data);
            getAllPaginatedData(
                location,
                type,
                "next",
                startAfterDoc,
                endBeforeDoc,
                numPerPage,
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
    }, [loadingUser, page]);

    const handleNextClick = () => {
        if (page === pages || loading) return;
        setPage((prev) => prev + 1);
    };

    const selectEnterprise = (enterprise: Enterprise) => {
        if (data) {
            if (enterpriseFiled.value && enterpriseFiled.value === enterprise.id) {
                setEnterprise({
                    value: null,
                    message:
                        type === EnterpriseType.Mechanical
                            ? null
                            : `Necesitas indicar ${EnterpriseTypeRenderPronoun[type]}`,
                });
            } else {
                if (enterprise.id) {
                    setEnterprise({
                        value: enterprise.id,
                        message: null,
                    });
                }
            }
        }
    };

    return data && !loadingUser ? (
        data.length > 0 ? (
            <div className="max-width-90">
                <div className="enterprise-list">
                    {data.map((enterprise, i) => (
                        <div
                            className="enterprise-item"
                            data-state={
                                enterpriseFiled.value &&
                                enterpriseFiled.value === enterprise.id &&
                                "selected"
                            }
                            key={i}
                            onClick={() => selectEnterprise(enterprise)}
                        >
                            <h3 className="enterprise-item-title">{enterprise.name}</h3>
                            <img
                                className="enterprise-item-logo"
                                src={enterprise.logoImgUrl.url}
                                alt=""
                            />
                        </div>
                    ))}
                </div>
                {page !== pages && (
                    <div title={page === pages ? "No hay mas resultados" : "Cargar mas"}>
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
        ) : (
            <div>
                <h2>{getEmptyEnterprise(type)}</h2>
            </div>
        )
    ) : (
        <div className="empty-wrapper | auto-height">
            <span className="loader-green | big-loader"></span>
        </div>
    );
};

export default EnterpriseSelector;
