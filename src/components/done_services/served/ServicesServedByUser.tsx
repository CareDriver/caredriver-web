"use client";

import DataLoaderIndicator from "@/components/DataLoaderIndicator";
import PageLoader from "@/components/PageLoader";
import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { userReqTypes } from "@/interfaces/UserRequest";
import { inputToDate, toformatDate } from "@/utils/parser/ForDate";
import {
    getServiceDoneCollection,
    getServicesDoneFilterNumPages,
    getServicesDoneFilterPaginated,
    getServicesDoneNumPages,
    getServicesDonePaginated,
} from "@/utils/requests/services/UserMadeServices";
import { CollectionReference, DocumentSnapshot, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const ServicesServedByUser = ({
    serviceUserId,
    type,
}: {
    serviceUserId: string;
    type: "driver" | "mechanic" | "tow" | "laundry";
}) => {
    const collection: CollectionReference = getServiceDoneCollection(type);
    const numPerPage = 10;
    const [dataState, setDataState] = useState<{
        data: ServiceRequestInterface[] | null;
        page: number;
        pages: number | null;
        lastDoc: DocumentSnapshot | undefined;
        value: Timestamp;
        isSearching: boolean;
        wereThereResults: boolean;
    }>({
        data: null,
        page: 1,
        pages: null,
        lastDoc: undefined,
        value: Timestamp.fromDate(new Date()),
        isSearching: false,
        wereThereResults: true,
    });

    const calculateSearchPages = async () => {
        getServicesDoneFilterNumPages(
            serviceUserId,
            dataState.value,
            numPerPage,
            collection,
        )
            .then((pages) => {
                setDataState({
                    ...dataState,
                    pages,
                });
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const calculateNormalNumPages = async () => {
        getServicesDoneNumPages(serviceUserId, numPerPage, collection)
            .then((pages) => {
                setDataState({
                    ...dataState,
                    pages,
                });
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const getSearchData = async () => {
        const startAfterDoc = dataState.lastDoc;
        getServicesDoneFilterPaginated(
            serviceUserId,
            dataState.value,
            "next",
            collection,
            startAfterDoc,
            numPerPage,
        )
            .then((result) => {
                var newData;
                if (dataState.data) {
                    newData = [...dataState.data, ...result.result];
                } else {
                    newData = result.result;
                }

                setDataState({
                    ...dataState,
                    data: newData,
                    lastDoc: result.lastDoc,
                });
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const getAllUsersData = async () => {
        const startAfterDoc = dataState.lastDoc;
        getServicesDonePaginated(
            serviceUserId,
            "next",
            collection,
            startAfterDoc,
            numPerPage,
        )
            .then((result) => {
                var newData;
                if (dataState.data) {
                    newData = [...dataState.data, ...result.result];
                } else {
                    newData = result.result;
                }

                setDataState({
                    ...dataState,
                    data: newData,
                    lastDoc: result.lastDoc,
                });
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const search = async () => {
        setDataState({
            ...dataState,
            data: null,
            lastDoc: undefined,
            pages: null,
            page: 1,
            isSearching: true,
        });
    };

    const handleNextClick = async () => {
        if (dataState.page === dataState.pages) {
            setDataState({
                ...dataState,
                wereThereResults: false,
            });
        } else {
            if (dataState.isSearching) {
                const startAfterDoc = dataState.lastDoc;
                getServicesDoneFilterPaginated(
                    serviceUserId,
                    dataState.value,
                    "next",
                    collection,
                    startAfterDoc,
                    numPerPage,
                )
                    .then((result) => {
                        var newData;
                        if (dataState.data) {
                            newData = [...dataState.data, ...result.result];
                        } else {
                            newData = result.result;
                        }

                        setDataState({
                            ...dataState,
                            data: newData,
                            lastDoc: result.lastDoc,
                            page: dataState.page + 1,
                        });
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            } else {
                const startAfterDoc = dataState.lastDoc;
                getServicesDonePaginated(
                    serviceUserId,
                    "next",
                    collection,
                    startAfterDoc,
                    numPerPage,
                )
                    .then((result) => {
                        var newData;
                        if (dataState.data) {
                            newData = [...dataState.data, ...result.result];
                        } else {
                            newData = result.result;
                        }

                        setDataState({
                            ...dataState,
                            data: newData,
                            lastDoc: result.lastDoc,
                            page: dataState.page + 1,
                        });
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            }
        }
    };

    useEffect(() => {
        if (!dataState.pages) {
            if (dataState.isSearching) {
                calculateSearchPages();
            } else {
                calculateNormalNumPages();
            }
        }
    }, [dataState.pages]);

    useEffect(() => {
        if (dataState.data === null) {
            if (dataState.isSearching) {
                getSearchData();
            } else {
                getAllUsersData();
            }
        }
    }, [dataState.data]);

    return dataState.data ? (
        <div>
            <div>
                <fieldset>
                    <input
                        type="date"
                        value={toformatDate(dataState.value.toDate())}
                        onChange={(e) => {
                            setDataState({
                                ...dataState,
                                value: Timestamp.fromDate(inputToDate(e)),
                            });
                        }}
                    />
                    <button onClick={search}>Filtrar</button>
                </fieldset>
            </div>
            {dataState.data.length > 0 ? (
                <InfiniteScroll
                    dataLength={dataState.data.length}
                    next={handleNextClick}
                    hasMore={dataState.page !== dataState.pages}
                    loader={<DataLoaderIndicator />}
                >
                    {dataState.data.map((req, i) => (
                        <div key={`service-served-by-user-${i}`}>
                            <h2>{req.requestReason}</h2>
                        </div>
                    ))}
                </InfiniteScroll>
            ) : (
                <div className="empty-wrapper | auto-height">
                    <h2>
                        {dataState.isSearching
                            ? `No se encontro servicios hechos hasta la fecha ${
                                  dataState.value.toDate().toISOString().split("T")[0]
                              }`
                            : `El usuario no ha hecho ningun servicio como ${userReqTypes[type]}`}
                    </h2>
                </div>
            )}
        </div>
    ) : (
        <PageLoader />
    );
};

export default ServicesServedByUser;
