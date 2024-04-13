"use client";
import Warehouse from "@/icons/Warehouse";
import { Enterprise, EnterpriseType } from "@/interfaces/Enterprise";
import {
    getAllNumPages,
    getAllPaginatedData,
} from "@/utils/requests/EnterpriseRequester";
import { DocumentSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

const WorkshopSelector = () => {
    const numPerPage = 1;
    const [data, setData] = useState<Enterprise[] | null>(null);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [pages, setPages] = useState<number | null>(null);
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        getAllNumPages(numPerPage, EnterpriseType.Mechanical).then((pages) =>
            setPages(pages),
        );
    }, []);

    useEffect(() => {
        const startAfterDoc = lastDoc;
        const endBeforeDoc = undefined;
        getAllPaginatedData(
            EnterpriseType.Mechanical,
            "next",
            startAfterDoc,
            endBeforeDoc,
            numPerPage,
        ).then((result) => {
            if (data) {
                setData([...data, ...result.result]);
            } else {
                setData(result.result);
            }
            setLastDoc(result.lastDoc);
        });
    }, [page]);

    const handleNextClick = () => {
        if (page === pages) return;
        setPage((prev) => prev + 1);
    };

    return (
        <div className="form-sub-container | margin-top-25">
            <h2 className="text icon-wrapper | medium-big bold">
                <Warehouse />
                Taller mecanico {"(Opcional)"}
            </h2>
            {data ? (
                data.length > 0 ? (
                    <div>
                        <div className="enterprise-list">
                            {data.map((enterprise, i) => (
                                <div className="enterprise-item" key={i}>
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

                        {/* Tu botón para cargar más datos */}
                        <div className="pagination-wrapper">
                            <span className="pagination-indicator">
                                Pagina {page} de {pages}
                            </span>

                            <button
                                className="icon-wrapper circle-button touchable green-icon"
                                disabled={page === pages}
                                onClick={handleNextClick}
                            >
                                Cargar mas
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="empty-wrapper | auto-height">
                        <h2>ningun taller mecanico fue creado</h2>
                    </div>
                )
            ) : (
                <div className="empty-wrapper | auto-height">
                    <span className="loader-green | big-loader"></span>
                </div>
            )}
        </div>
    );
};

export default WorkshopSelector;

/* import Warehouse from "@/icons/Warehouse";
import { Enterprise, EnterpriseType } from "@/interfaces/Enterprise";
import {
    getAllNumPages,
    getAllPaginatedData,
} from "@/utils/requests/EnterpriseRequester";
import { DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const WorkshopSelector = () => {
    const numPerPage = 1;
    const [data, setData] = useState<Enterprise[] | null>(null);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [pages, setPages] = useState<number | null>(null);
    const [page, setPage] = useState<number>(0);

    useEffect(() => {
        if (!data) {
            loadData();
        }
        if (!pages) {
            getAllNumPages(numPerPage, EnterpriseType.Mechanical).then((pages) =>
                setPages(pages),
            );
        }
    }, []);

    const loadData = () => {
        getAllPaginatedData(
            EnterpriseType.Mechanical,
            undefined,
            lastDoc,
            undefined,
            numPerPage,
        ).then((result) => {
            if (data) {
                setData([...data, ...result.result]);
            } else {
                setData(result.result);
            }
            setPage(page + 1);
            setLastDoc(result.lastDoc);
        });
    };

    return (
        <div className="form-sub-container | margin-top-25">
            <h2 className="text icon-wrapper | medium-big bold">
                <Warehouse />
                Taller mecanico {"(Opcional)"}
            </h2>

            {data ? (
                data.length > 0 ? (
                    <div>
                        <div className="enterprise-list">
                            {data.map((enterprise, i) => (
                                <div className="enterprise-item" key={i}>
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
                        {pages && page <= pages && (
                            <div className="pagination-wrapper">
                                <button className="" onClick={loadData}>
                                    Cargar más datos
                                </button>
                            </div>
                        )}
                        {page + " - " + pages}
                    </div>
                ) : (
                    <div className="empty-wrapper | auto-height">
                        <h2>ningun taller mecanico fue creado</h2>
                    </div>
                )
            ) : (
                <div className="empty-wrapper | auto-height">
                    <span className="loader-green | big-loader"></span>
                </div>
            )}
        </div>
    );
};
export default WorkshopSelector; */
