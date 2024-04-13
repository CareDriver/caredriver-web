"use client";

import React, { useEffect, useState } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import { Enterprise } from "@/interfaces/Enterprise";
import { getNumPages, getPaginatedData } from "@/utils/requests/EnterpriseRequester";

const EnterpriseList: React.FC = () => {
    const numPerPage = 12;
    const [data, setData] = useState<Enterprise[]>([]);
    const [firstDoc, setFirstDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [pages, setPages] = useState<number | null>(null);
    const [page, setPage] = useState<number>(1);
    const [direction, setDirection] = useState<"prev" | "next" | undefined>(undefined);

    useEffect(() => {
        getNumPages(numPerPage).then((pages) => setPages(pages));
    }, []);

    useEffect(() => {
        const startAfterDoc = direction === "next" ? lastDoc : undefined;
        const endBeforeDoc = direction === "prev" ? firstDoc : undefined;

        getPaginatedData(direction, startAfterDoc, endBeforeDoc, numPerPage).then(
            (data) => {
                setData(data.result);
                setFirstDoc(data.firstDoc);
                setLastDoc(data.lastDoc);
            },
        );
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

    return (
        <div>
            {/* List products */}
            <div className="grid grid-cols-3 gap-4">
                {data.map((product) => (
                    <div key={product.name}>{product.name}</div>
                ))}
            </div>

            {/* Pagination */}
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

export default EnterpriseList;
