"use client";

import { userReqTypes, UserRequest } from "@/interfaces/UserRequest";
import {
    getNumPages,
    getPaginatedData,
    getServiceCollection,
} from "@/components/app_modules/server_users/api/ServicesRequester";
import { CollectionReference, DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import "@/styles/components/pagination.css";
import CardToRequesterToBeServerUser from "../cards/CardToRequesterToBeServerUser";
import InfiniteScroll from "react-infinite-scroll-component";
import "@/styles/components/service-req.css";
import DataLoading from "@/components/loaders/DataLoading";
import WholeScreenText from "@/components/modules/WholeScreenText";
import PageLoading from "@/components/loaders/PageLoading";
import { ServiceType } from "@/interfaces/Services";

const ListOfRequestsToBeServerUser = ({ type }: { type: ServiceType }) => {
    const PAGE_SIZE = 14;
    const [data, setData] = useState<UserRequest[] | null>(null);
    const [page, setPage] = useState<number>(1);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(
        undefined,
    );
    const [pages, setPages] = useState<number | null>(null);

    const collection: CollectionReference = getServiceCollection(type);

    const handleNextClick = () => {
        if (page === pages) return;
        setPage((prev) => prev + 1);
    };

    useEffect(() => {
        getNumPages(PAGE_SIZE, collection)
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
        getPaginatedData(
            "next",
            collection,
            startAfterDoc,
            endBeforeDoc,
            PAGE_SIZE,
        )
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
                <h1 className={`text | big bold margin-bottom-25`}>
                    Solicitudes para ser {userReqTypes[type]}
                </h1>

                <InfiniteScroll
                    dataLength={data.length}
                    next={handleNextClick}
                    hasMore={page !== pages}
                    loader={<DataLoading />}
                >
                    <div className="service-req-wrapper">
                        {data.map((req, i) => (
                            <CardToRequesterToBeServerUser
                                req={req}
                                key={`service-req-item-${i}`}
                                type={type}
                            />
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        ) : (
            <WholeScreenText
                text={`No hay peticiones para ser ${userReqTypes[type]}`}
            />
        )
    ) : (
        <PageLoading />
    );
};

export default ListOfRequestsToBeServerUser;
