"use client";

import PageLoader from "@/components/PageLoader";
import { userReqTypes, UserRequest } from "@/interfaces/UserRequest";
import {
    getNumPages,
    getPaginatedData,
    getServiceCollection,
} from "@/utils/requests/services/ServicesRequester";
import { CollectionReference, DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import "@/styles/components/pagination.css";
import ServiceItemReq from "./ServiceItemReq";
import PageChanger from "../data_renderer/form/PageChanger";

const ServiceReqsRenderer = ({ type }: { type: "driver" | "mechanic" | "tow" }) => {
    const numPerPage = 10;
    const [data, setData] = useState<UserRequest[] | null>(null);
    const [firstDoc, setFirstDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [pages, setPages] = useState<number | null>(null);
    const [page, setPage] = useState<number>(1);
    const [direction, setDirection] = useState<"prev" | "next" | undefined>(undefined);
    const collection: CollectionReference = getServiceCollection(type);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);

        getNumPages(numPerPage, collection)
            .then((pages) => {
                setPages(pages);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        setLoading(true);

        const startAfterDoc = direction === "next" ? lastDoc : undefined;
        const endBeforeDoc = direction === "prev" ? firstDoc : undefined;
        getPaginatedData(direction, collection, startAfterDoc, endBeforeDoc, numPerPage)
            .then((data) => {
                setData(data.result);
                setFirstDoc(data.firstDoc);
                setLastDoc(data.lastDoc);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [page]);

    return data ? (
        data.length > 0 ? (
            <div>
                {loading ? (
                    <span className="loader-green | big-loader"></span>
                ) : (
                    <div className="enterprise-list">
                        {data.map((req, i) => (
                            <ServiceItemReq
                                req={req}
                                key={`service-req-item-${i}`}
                                type={type}
                            />
                        ))}
                    </div>
                )}

                <PageChanger
                    page={page}
                    pages={pages}
                    loading={loading}
                    setPage={setPage}
                    setDirection={setDirection}
                />
            </div>
        ) : (
            <div className="empty-wrapper | auto-height">
                <h2>No hay peticiones para ser {userReqTypes[type]}</h2>
            </div>
        )
    ) : (
        <PageLoader />
    );
};

export default ServiceReqsRenderer;
