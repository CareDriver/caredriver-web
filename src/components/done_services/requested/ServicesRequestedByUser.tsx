"use client";

import PageLoader from "@/components/PageLoader";
import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { userReqTypes } from "@/interfaces/UserRequest";
import { getFormatDate, inputToDate } from "@/utils/parser/ForDate";
import {
    getServiceRequestedCollection,
    getServicesRequestedFilterNumPages,
    getServicesRequestedFilterPaginated,
    getServicesRequestedNumPages,
    getServicesRequestedPaginated,
} from "@/utils/requests/services/UserRequestedServices";
import {
    collection,
    CollectionReference,
    DocumentSnapshot,
    limit,
    onSnapshot,
    orderBy,
    query,
    QueryDocumentSnapshot,
    startAfter,
    Timestamp,
    where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FullLocationServiceItem from "../items/FullLocationServiceItem";
import ReasonAndLocationServiceItem from "../items/ReasonAndLocationServiceItem";
import { ServicesRender } from "@/interfaces/Services";
import "@/styles/components/user-services-served.css";
import "@/styles/components/service-req.css";
import { firestore } from "@/firebase/FirebaseConfig";
import { getNameServiceCollection } from "@/utils/requests/services/UserMadeServices";
import { toast } from "react-toastify";

const ServicesRequestedByUser = ({
    serviceUserId,
    type,
}: {
    serviceUserId: string;
    type: "driver" | "mechanic" | "tow" | "laundry";
}) => {
    const COLLECTION_PATH = getNameServiceCollection(type);
    const PAGE_SIZE = 10;
    const [deadline, setDeadline] = useState(Timestamp.now());
    const [documents, setDocuments] = useState<ServiceRequestInterface[]>([]);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const updateDocuments = (newDocs: ServiceRequestInterface[]) => {
        setDocuments((prevDocuments) => {
            const updatedDocs = prevDocuments.map((doc) => {
                const newDoc = newDocs.find((d) => d.id === doc.id);
                return newDoc ? newDoc : doc;
            });

            const newUniqueDocs = newDocs.filter(
                (newDoc) => !updatedDocs.some((doc) => doc.id === newDoc.id),
            );

            return [...updatedDocs, ...newUniqueDocs];
        });
    };

    const fetchDocuments = (startAfterDoc: QueryDocumentSnapshot | null = null) => {
        setLoading(true);

        const adjustedDeadline = Timestamp.fromDate(
            new Date(deadline.seconds * 1000 + 86400000),
        );

        let q;
        if (startAfterDoc) {
            q = query(
                collection(firestore, COLLECTION_PATH),
                limit(PAGE_SIZE),
                where("userId", "==", serviceUserId),
                where("createdAt", "<=", adjustedDeadline),
                orderBy("createdAt", "desc"),
                startAfter(startAfterDoc),
            );
        } else {
            q = query(
                collection(firestore, COLLECTION_PATH),
                limit(PAGE_SIZE),
                where("userId", "==", serviceUserId),
                where("createdAt", "<=", adjustedDeadline),
                orderBy("createdAt", "desc"),
            );
        }

        try {
            onSnapshot(q, (snapshot) => {
                if (!snapshot.empty) {
                    const docs = snapshot.docs.map((doc) => {
                        let serviceData = doc.data() as ServiceRequestInterface;
                        serviceData.id = doc.id;
                        return serviceData;
                    });
                    updateDocuments(docs);
                    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
                    setLastDoc(lastVisible);
                } else {
                    setHasMore(false);
                    toast.info("No hay mas resultados")
                }
                setLoading(false);
            });
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [deadline]);

    const handleLoadMore = () => {
        if (lastDoc) {
            fetchDocuments(lastDoc);
        }
    };

    const handleDeadlineChange = (event: any) => {
        const selectedDate = event.target.value;
        setDeadline(Timestamp.fromDate(new Date(selectedDate)));
        setDocuments([]);
        setLastDoc(null);
    };

    return (
        <div>
            <input
                type="date"
                onChange={handleDeadlineChange}
                value={new Date(deadline.seconds * 1000).toISOString().split("T")[0]}
            />
            {documents.map((serviceData, i) => (
                <div key={i}>
                    <h1>{i + 1}</h1>
                    <h3>Id: {serviceData.id}</h3>
                    <h3>fakedId: {serviceData.fakedId}</h3>
                    {serviceData.createdAt && (
                        <h4>{getFormatDate(serviceData.createdAt.toDate())}</h4>
                    )}
                    {serviceData.price && serviceData.price.price && (
                        <h3 className="text | bolder margin-bottom-25">
                            {serviceData.price.price} {serviceData.price.currency}
                        </h3>
                    )}

                    <div className="margin-bottom-15">
                        <h4 className="text | bold gray-dark">Desde</h4>
                        <p className="text | gray-dark">
                            {serviceData.pickupLocation.locationName}
                        </p>
                    </div>
                    <div className="separator-horizontal"></div>
                </div>
            ))}
            {loading && <p>Cargando...</p>}
            {hasMore && (
                <button onClick={handleLoadMore} disabled={loading}>
                    Cargar más
                </button>
            )}
        </div>
    );

    /* const [dataState, setDataState] = useState<{
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
        getServicesRequestedFilterNumPages(
            serviceUserId,
            dataState.value,
            PAGE_SIZE,
            COLLECTION,
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
        getServicesRequestedNumPages(serviceUserId, PAGE_SIZE, COLLECTION)
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
        getServicesRequestedFilterPaginated(
            serviceUserId,
            dataState.value,
            "next",
            COLLECTION,
            startAfterDoc,
            PAGE_SIZE,
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
        getServicesRequestedPaginated(
            serviceUserId,
            "next",
            COLLECTION,
            startAfterDoc,
            PAGE_SIZE,
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
                getServicesRequestedFilterPaginated(
                    serviceUserId,
                    dataState.value,
                    "next",
                    COLLECTION,
                    startAfterDoc,
                    PAGE_SIZE,
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
                getServicesRequestedPaginated(
                    serviceUserId,
                    "next",
                    COLLECTION,
                    startAfterDoc,
                    PAGE_SIZE,
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
                        Filtrar por pedidos hasta :{"  "}
                    </button>
                    <input
                        type="date"
                        className="filter-date-input"
                        value={dataState.value.toDate().toISOString().split("T")[0]}
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
                    loader={
                        <span className="text | bolder | margin-top-25">
                            Cargando mas datos...
                        </span>
                    }
                >
                    <div className="service-req-wrapper">
                        {dataState.data.map(
                            (req, i) =>
                                req.fakedId &&
                                getServiceItem(
                                    `/admin/users/${serviceUserId}/servicerequests/${type}/${req.fakedId}`,
                                    req,
                                    `servie-requested-${i}`,
                                ),
                        )}
                    </div>
                </InfiniteScroll>
            ) : (
                <div className="empty-wrapper | auto-height">
                    <h2>
                        {dataState.isSearching
                            ? `No se encontró ninguna petición hasta la fecha ${getFormatDate(
                                  dataState.value.toDate(),
                              )}`
                            : `El usuario no ha hecho ninguna petición por un ${userReqTypes[type]}`}
                    </h2>
                </div>
            )}
        </div>
    ) : (
        <PageLoader />
    ); */
};

export default ServicesRequestedByUser;
