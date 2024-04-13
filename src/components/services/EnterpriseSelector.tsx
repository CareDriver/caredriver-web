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

const EnterpriseSelector = ({
    type,
    selected,
    setEnterprise,
}: {
    type: EnterpriseType;
    selected: SoftEnterprise | null;
    setEnterprise: (enterprise: SoftEnterprise | null) => void;
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
            if (selected && selected.id === enterprise.id) {
                setEnterprise(null);
            } else {
                var softEnterprise: SoftEnterprise = {
                    id: enterprise.id,
                    logoImgUrl: enterprise.logoImgUrl,
                    name: enterprise.name,
                    type: enterprise.type,
                    coordinates: enterprise.coordinates,
                    phone: enterprise.phone,
                };

                setEnterprise(softEnterprise);
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
                                selected && selected.id === enterprise.id && "selected"
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
