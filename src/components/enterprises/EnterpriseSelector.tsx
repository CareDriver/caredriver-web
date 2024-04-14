"use client";
import { Enterprise, EnterpriseType, SoftEnterprise } from "@/interfaces/Enterprise";
import {
    getAllNumPages,
    getAllPaginatedData,
} from "@/utils/requests/EnterpriseRequester";
import { DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import "@/styles/components/enterprise.css";
import Plus from "@/icons/Plus";
import { EnterpriseField } from "../services/FormModels";

const EnterpriseSelector = ({
    type,
    enterpriseFiled,
    setEnterprise,
}: {
    type: EnterpriseType;
    enterpriseFiled: EnterpriseField;
    setEnterprise: (enterprise: EnterpriseField) => void;
}) => {
    const numPerPage = 1;
    const [data, setData] = useState<Enterprise[] | null>(null);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [pages, setPages] = useState<number | null>(null);
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        getAllNumPages(numPerPage, type).then((pages) => setPages(pages));
    }, []);

    useEffect(() => {
        const startAfterDoc = lastDoc;
        const endBeforeDoc = undefined;
        getAllPaginatedData(type, "next", startAfterDoc, endBeforeDoc, numPerPage).then(
            (result) => {
                if (data) {
                    setData([...data, ...result.result]);
                } else {
                    setData(result.result);
                }
                setLastDoc(result.lastDoc);
            },
        );
    }, [page]);

    const handleNextClick = () => {
        if (page === pages) return;
        setPage((prev) => prev + 1);
    };

    const selectEnterprise = (enterprise: Enterprise) => {
        if (data) {
            if (enterpriseFiled.value && enterpriseFiled.value.id === enterprise.id) {
                setEnterprise({
                    value: null,
                    message:
                        type === EnterpriseType.Mechanical
                            ? null
                            : "Necesitas indicar la empresa operadora de grua",
                });
            } else {
                if (enterprise.id) {
                    var softEnterprise: SoftEnterprise = {
                        id: enterprise.id,
                        logoImgUrl: enterprise.logoImgUrl.url,
                        name: enterprise.name,
                        type: enterprise.type,
                        coordinates: enterprise.coordinates,
                        phone: enterprise.phone,
                    };

                    setEnterprise({
                        value: softEnterprise,
                        message: null,
                    });
                }
            }
        }
    };

    return data ? (
        data.length > 0 ? (
            <div>
                <div className="enterprise-list">
                    {data.map((enterprise, i) => (
                        <div
                            className="enterprise-item"
                            data-state={
                                enterpriseFiled.value &&
                                enterpriseFiled.value.id === enterprise.id &&
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

                {enterpriseFiled.message && (
                    <small className="form-section-message | margin-top-15">
                        {enterpriseFiled.message}
                    </small>
                )}

                <button
                    className="icon-wrapper general-button | no-full gray | margin-top-25"
                    disabled={page === pages}
                    onClick={handleNextClick}
                >
                    <Plus />
                    Mostrar mas
                </button>
            </div>
        ) : (
            <div className="empty-wrapper | auto-height">
                <h2>
                    {type === EnterpriseType.Mechanical
                        ? "Ningun taller mecanico fue creado"
                        : "Ninguna empresa operadora de grua fue creado"}
                </h2>
            </div>
        )
    ) : (
        <div className="empty-wrapper | auto-height">
            <span className="loader-green | big-loader"></span>
        </div>
    );
};

export default EnterpriseSelector;
