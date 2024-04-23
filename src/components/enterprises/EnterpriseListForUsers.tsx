"use client";

import React, { useContext, useEffect, useState } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import { Enterprise } from "@/interfaces/Enterprise";
import {
    getNumPages,
    getPaginatedData,
} from "@/utils/requests/enterprise/EnterpriseRequester";
import { AuthContext } from "@/context/AuthContext";
import EnterpriseItem from "./EnterpriseItem";
import AngleLeft from "@/icons/AngleLeft";
import AngleRight from "@/icons/AngleRight";
import "@/styles/components/pagination.css";

const EnterpriseListForUsers = ({ type }: { type: string }) => {
    const { loadingUser, user } = useContext(AuthContext);
    const numPerPage = 12;
    const [data, setData] = useState<Enterprise[] | null>(null);
    const [firstDoc, setFirstDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [pages, setPages] = useState<number | null>(null);
    const [page, setPage] = useState<number>(1);
    const [direction, setDirection] = useState<"prev" | "next" | undefined>(undefined);

    useEffect(() => {
        if (!loadingUser && user.data && user.data.id) {
            getNumPages(numPerPage, type, user.data.id).then((pages) => setPages(pages));
        }
    }, [loadingUser]);

    useEffect(() => {
        if (!loadingUser && user.data && user.data.id) {
            const startAfterDoc = direction === "next" ? lastDoc : undefined;
            const endBeforeDoc = direction === "prev" ? firstDoc : undefined;
            getPaginatedData(
                type,
                user.data.id,
                direction,
                startAfterDoc,
                endBeforeDoc,
                numPerPage,
            ).then((data) => {
                setData(data.result);
                setFirstDoc(data.firstDoc);
                setLastDoc(data.lastDoc);
            });
        }
    }, [page, loadingUser]);

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
                    {data.map((product, i) => (
                        <EnterpriseItem
                            key={`enterprise-item-${i}`}
                            type={type}
                            enterprise={product}
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
                    No tienes{" "}
                    {type === "tow"
                        ? "ninguna empresa de grua creada"
                        : "ningun taller mecanico creado"}
                </h2>
            </div>
        )
    ) : (
        <div className="empty-wrapper | auto-height">
            <span className="loader-green | big-loader"></span>
        </div>
    );
};

export default EnterpriseListForUsers;
