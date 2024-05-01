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
import InfiniteScroll from "react-infinite-scroll-component";

const ServiceReqsRenderer = ({ type }: { type: "driver" | "mechanic" | "tow" }) => {
    const numPerPage = 10;
    const [data, setData] = useState<UserRequest[] | null>(null);
    const [page, setPage] = useState<number>(1);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [pages, setPages] = useState<number | null>(null);

    const collection: CollectionReference = getServiceCollection(type);

    const handleNextClick = () => {
        if (page === pages) return;
        setPage((prev) => prev + 1);
    };

    useEffect(() => {
        getNumPages(numPerPage, collection)
            .then((pages) => {
                setPages(pages);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        const startAfterDoc = lastDoc;
        const endBeforeDoc = undefined;
        getPaginatedData("next", collection, startAfterDoc, endBeforeDoc, numPerPage)
            .then((result) => {
                if (data) {
                    setData([...data, ...result.result]);
                } else {
                    setData(result.result);
                }
                setLastDoc(result.lastDoc);
            })
            .catch(() => {});
    }, [page]);

    return data ? (
        data.length > 0 ? (
            <InfiniteScroll
                dataLength={data.length}
                next={handleNextClick}
                hasMore={page !== pages}
                loader={<span className="loader-gray"></span>}
            >
                {data.map((req, i) => (
                    <ServiceItemReq req={req} key={`service-req-item-${i}`} type={type} />
                ))}
            </InfiniteScroll>
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
