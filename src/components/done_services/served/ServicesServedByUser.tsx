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
import FullLocationServiceItem from "../items/FullLocationServiceItem";
import ReasonAndLocationServiceItem from "../items/ReasonAndLocationServiceItem";
import { ServicesRender } from "@/interfaces/Services";
import "@/styles/components/user-services-served.css";
import "@/styles/components/service-req.css";

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
        value: Timestamp.now(),
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

                console.log(newData);

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

    const getServiceItem = (
        link: string,
        service: ServiceRequestInterface,
        key: string,
    ) => {
        if (type === "driver" || type === "tow") {
            return <FullLocationServiceItem link={link} service={service} key={key} />;
        } else {
            return (
                <ReasonAndLocationServiceItem link={link} service={service} key={key} />
            );
        }
    };

    return dataState.data ? (
        <div className="render-data-wrapper">
            <h2 className="text | bolder big margin-bottom-25">
                Servicios hechos como {ServicesRender[type]}
            </h2>
            <div className="margin-bottom-50">
                <fieldset className="filter-date-wrapper">
                    <button className="filter-date-button" onClick={search}>
                        Filtrar por servicios creados hasta el:{" "}
                    </button>
                    <input
                        type="date"
                        className="filter-date-input"
                        value={toformatDate(dataState.value.toDate())}
                        onChange={(e) => {
                            setDataState({
                                ...dataState,
                                value: Timestamp.fromDate(inputToDate(e)),
                            });
                        }}
                    />
                </fieldset>
            </div>
            {dataState.data.length > 0 ? (
                <InfiniteScroll
                    dataLength={dataState.data.length}
                    next={handleNextClick}
                    hasMore={dataState.page !== dataState.pages}
                    loader={<DataLoaderIndicator />}
                >
                    <div className="service-req-wrapper">
                        {dataState.data.map((req, i) =>
                            getServiceItem(
                                `/admin/users/${serviceUserId}/services/${type}/${req.id}`,
                                req,
                                `service-req-by-user-${i}`,
                            ),
                        )}
                    </div>
                </InfiniteScroll>
            ) : (
                <div className="empty-wrapper | auto-height">
                    <h2>
                        {dataState.isSearching
                            ? `No se encontró servicios hechos hasta la fecha ${
                                  dataState.value.toDate().toISOString().split("T")[0]
                              }`
                            : `El usuario no ha hecho ningún servicio como ${userReqTypes[type]}`}
                    </h2>
                </div>
            )}
        </div>
    ) : (
        <PageLoader />
    );
};

export default ServicesServedByUser;
