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
import { getEmptyEnterprise, getRoute } from "@/utils/parser/ToSpanishEnterprise";

const EnterpriseListForUsers = ({ type }: { type: "mechanical" | "tow" | "laundry" }) => {
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
                            route={`/enterprise/${getRoute(type)}/edit/${product.id}`}
                            enterprise={product}
                        />
                    ))}
                </div>
            </InfiniteScroll>
        ) : (
            <div className="auto-height">
                <h2 className="text | medium-big">No tienes {getEmptyEnterprise(type)}</h2>
            </div>
        )
    ) : (
        <div className="auto-height">
            <span className="loader-green | big-loader"></span>
        </div>
    );
};

export default EnterpriseListForUsers;
