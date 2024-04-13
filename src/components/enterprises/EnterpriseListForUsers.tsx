"use client";

import React, { useContext, useEffect, useState } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import { Enterprise } from "@/interfaces/Enterprise";
import { getNumPages, getPaginatedData } from "@/utils/requests/EnterpriseRequester";
import { AuthContext } from "@/context/AuthContext";

const EnterpriseListForUsers = ({ type }: { type: string }) => {
    const { loadingUser, user } = useContext(AuthContext);
    const numPerPage = 12;
    const [data, setData] = useState<Enterprise[]>([]);
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

    return (
        <div>
            <div className="grid grid-cols-3 gap-4">
                {data.map((product, i) => (
                    <div key={`enterprise-item-${i}`}>
                        <h3>{product.name}</h3>
                        <img src={product.logoImgUrl} alt="" />
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-start space-x-2 p-4">
                <button
                    className="btn btn-outline"
                    disabled={page === 1}
                    onClick={handlePreviousClick}
                >
                    Previous
                </button>

                <span>
                    Page {page} of {pages}
                </span>

                <button
                    className="btn btn-outline"
                    disabled={page === pages}
                    onClick={handleNextClick}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default EnterpriseListForUsers;
