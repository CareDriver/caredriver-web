"use client";

import PageLoader from "@/components/PageLoader";
import AngleLeft from "@/icons/AngleLeft";
import AngleRight from "@/icons/AngleRight";
import { DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import "@/styles/components/pagination.css";
import { EnterpriseTypeRender, ReqEditEnterprise } from "@/interfaces/Enterprise";
import {
    getEditEnterpriseReqs,
    getEditEnterpriseReqsNumPages,
} from "@/utils/requests/enterprise/EditEnterpriseReq";
import EnterpriseUpItemReq from "./EnterpriseUpItemReq";

const EnterpriseUpReqsRender = ({ type }: { type: "mechanical" | "tow" }) => {
    const numPerPage = 10;
    const [data, setData] = useState<ReqEditEnterprise[] | null>(null);
    const [firstDoc, setFirstDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [pages, setPages] = useState<number | null>(null);
    const [page, setPage] = useState<number>(1);
    const [direction, setDirection] = useState<"prev" | "next" | undefined>(undefined);

    useEffect(() => {
        getEditEnterpriseReqsNumPages(numPerPage, type).then((pages) => setPages(pages));
    }, []);

    useEffect(() => {
        const startAfterDoc = direction === "next" ? lastDoc : undefined;
        const endBeforeDoc = direction === "prev" ? firstDoc : undefined;
        getEditEnterpriseReqs(
            type,
            direction,
            startAfterDoc,
            endBeforeDoc,
            numPerPage,
        ).then((data) => {
            setData(data.result);
            setFirstDoc(data.firstDoc);
            setLastDoc(data.lastDoc);
        });
    }, [page]);

    const handlePreviousClick = () => {
        if (page === 1) return;
        setDirection("prev");
        setPage((prev) => prev - 1);
    };

    const handleNextClick = () => {
        if (page === pages) return;
        setDirection("next");
        setPage((prev) => prev + 1);
    };

    return data ? (
        data.length > 0 ? (
            <div>
                <div className="enterprise-list">
                    {data.map((req, i) => (
                        <EnterpriseUpItemReq
                            enterprise={req}
                            type={type}
                            key={`service-req-up-item-${i}`}
                        />
                    ))}
                </div>

                {pages && pages > 1 && (
                    <div className="pagination-wrapper">
                        <button
                            className="icon-wrapper circle-button touchable green-icon"
                            disabled={page === 1}
                            onClick={handlePreviousClick}
                        >
                            <AngleLeft />
                        </button>

                        <span className="pagination-indicator">
                            Pagina {page} de {pages}
                        </span>

                        <button
                            className="icon-wrapper circle-button touchable green-icon"
                            disabled={page === pages}
                            onClick={handleNextClick}
                        >
                            <AngleRight />
                        </button>
                    </div>
                )}
            </div>
        ) : (
            <div className="empty-wrapper | auto-height">
                <h2>
                    No hay peticiones para actualizar {type === "tow" ? "una" : "un"}{" "}
                    {EnterpriseTypeRender[type]}
                </h2>
            </div>
        )
    ) : (
        <PageLoader />
    );
};

export default EnterpriseUpReqsRender;
