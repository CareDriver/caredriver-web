"use client";

import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import {
    collection,
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
import FullLocationServiceItem from "../items/FullLocationServiceItem";
import ReasonAndLocationServiceItem from "../items/ReasonAndLocationServiceItem";
import "@/styles/components/user-services-served.css";
import "@/styles/components/service-req.css";
import { firestore } from "@/firebase/FirebaseConfig";
import { getNameServiceCollection } from "@/utils/requests/services/UserMadeServices";
import { TypeOfServiceDone } from "../constants/TypeOfServiceDone";

const ServicesRequestedByUser = ({
    serviceUserId,
    type,
    typeOfService,
}: {
    serviceUserId: string;
    type: "driver" | "mechanic" | "tow" | "laundry";
    typeOfService: TypeOfServiceDone;
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

    const theareNoResults = (): boolean => {
        return documents.length === 0 && !hasMore;
    };

    return (
        <div
            className={`render-data-wrapper ${
                theareNoResults() && "auto-height max-height-100"
            }`}
        >
            <h2 className="text | bolder big margin-bottom-25">
                Servicios {typeOfService}
            </h2>

            <fieldset className="filter-date-wrapper">
                <input
                    type="date"
                    className="filter-date-input"
                    onChange={handleDeadlineChange}
                    value={new Date(deadline.seconds * 1000).toISOString().split("T")[0]}
                />
            </fieldset>

            <div className="margin-top-25"></div>
            <div className="service-req-wrapper">
                {/* TODO:  remove the filter*/}
                {documents
                    .filter((s) => s.fakedId !== undefined)
                    .map((serviceData, i) =>
                        getServiceItem(
                            `/admin/users/${serviceUserId}/servicerequests/${type}/${serviceData.fakedId}`,
                            serviceData,
                            `service-requested-${i}`,
                        ),
                    )}
            </div>

            {theareNoResults() && (
                <div>
                    <h2>{"No se encontraron servicios"}</h2>
                    <span className="circles-right-bottomv2 green"></span>
                </div>
            )}

            <div className="margin-top-25"></div>
            {loading && <span className="loader"></span>}
            {hasMore && (
                <button onClick={handleLoadMore} disabled={loading}>
                    Cargar más
                </button>
            )}
        </div>
    );
};

export default ServicesRequestedByUser;
