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
import "@/styles/components/pagination.css";
import InfiniteScroll from "react-infinite-scroll-component";
import DataLoaderIndicator from "../DataLoaderIndicator";

const EnterpriseListForUsers = ({ type }: { type: string }) => {
    const { loadingUser, user } = useContext(AuthContext);
    const numPerPage = 12;
    const [data, setData] = useState<Enterprise[] | null>(null);
    const [page, setPage] = useState<number>(1);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [pages, setPages] = useState<number | null>(null);

    useEffect(() => {
        if (!loadingUser && user.data && user.data.id) {
            getNumPages(numPerPage, type, user.data.id).then((pages) => setPages(pages));
        }
    }, [loadingUser]);

    useEffect(() => {
        if (!loadingUser && user.data && user.data.id) {
            const startAfterDoc = lastDoc;
            const endBeforeDoc = undefined;
            getPaginatedData(
                type,
                user.data.id,
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
        }
    }, [page, loadingUser]);

    const handleNextClick = () => {
        if (page === pages) return;
        setPage((prev) => prev + 1);
    };

    return data ? (
        data.length > 0 ? (
            <InfiniteScroll
                dataLength={data.length}
                next={handleNextClick}
                hasMore={page !== pages}
                loader={<DataLoaderIndicator />}
            >
                <div className="enterprise-list">
                    {data.map((product, i) => (
                        <EnterpriseItem
                            key={`enterprise-item-${i}`}
                            route={`/enterprise/${
                                type === "tow" ? "cranes" : "workshops"
                            }/edit/${product.id}`}
                            enterprise={product}
                        />
                    ))}
                </div>
            </InfiniteScroll>
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
