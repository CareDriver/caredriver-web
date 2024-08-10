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
import MiddleMessage from "@/components/MiddleMessage";
import "@/styles/components/service-req.css";
import DataLoaderIndicator from "@/components/DataLoaderIndicator";

const ServiceReqsRenderer = ({
    type,
}: {
    type: "driver" | "mechanic" | "tow" | "laundry";
}) => {
    const numPerPage = 14;
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
            .catch((e) => {
                console.log(e);
            });
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
            .catch((e) => {
                console.log(e);
            });
    }, [page]);

    return data ? (
        data.length > 0 ? (
            <div className="render-data-wrapper">
                <h1 className={`text | big bolder margin-bottom-25`}>
                    Solicitudes para ser {userReqTypes[type]}
                </h1>

                <InfiniteScroll
                    dataLength={data.length}
                    next={handleNextClick}
                    hasMore={page !== pages}
                    loader={<DataLoaderIndicator />}
                >
                    <div className="service-req-wrapper">
                        {data.map((req, i) => (
                            <ServiceItemReq
                                req={req}
                                key={`service-req-item-${i}`}
                                type={type}
                            />
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        ) : (
            <MiddleMessage message={`No hay peticiones para ser ${userReqTypes[type]}`} />
        )
    ) : (
        <PageLoader />
    );
};

export default ServiceReqsRenderer;
