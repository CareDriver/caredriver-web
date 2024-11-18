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
import CardForServicePerfWithLocation from "../cards/CardForServicePerfWithLocation";
import CardForServicePerfWithReason from "../cards/CardForServicePerfWithReason";
import "@/styles/components/user-services-served.css";
import "@/styles/components/service-req.css";
import { firestore } from "@/firebase/FirebaseConfig";
import { TypeOfServicePerformed } from "../../model/models/TypeOfServicePerformed";
import { getPathCollectionOfServicesPerf } from "../../model/utils/CollectionGetter";
import { ServiceType } from "@/interfaces/Services";
import { UserInterface } from "@/interfaces/UserInterface";
import { getUserByFakeId } from "@/components/app_modules/users/api/UserRequester";
import { useRouter } from "next/navigation";
import { routeToAllUsersAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUsersAsAdmin";
import { toast } from "react-toastify";
import PageLoading from "@/components/loaders/PageLoading";

interface Props {
    userId: string;
    typeOfService: ServiceType;
    typeOfPerf: TypeOfServicePerformed;
}

const ListOfServicesPerfByUser: React.FC<Props> = ({
    userId,
    typeOfService,
    typeOfPerf,
}) => {
    const COLLECTION_PATH = getPathCollectionOfServicesPerf(typeOfService);
    const PAGE_SIZE = 12;

    const router = useRouter();
    const [user, setUser] = useState<UserInterface | undefined>(undefined);
    const [deadline, setDeadline] = useState(Timestamp.now());
    const [documents, setDocuments] = useState<ServiceRequestInterface[]>([]);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        getUserByFakeId(userId).then((res) => {
            if (res && res.id) {
                setUser(res);
            } else {
                toast.error("Usuario no encontrado");
                router.push(routeToAllUsersAsAdmin());
            }
        });
    }, []);

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

    const fetchDocuments = (
        startAfterDoc: QueryDocumentSnapshot | null = null,
    ) => {
        if (!user?.id) {
            return;
        }

        setLoading(true);

        const adjustedDeadline = Timestamp.fromDate(
            new Date(deadline.seconds * 1000 + 86400000),
        );

        let q;
        let userFieldId =
            typeOfPerf === TypeOfServicePerformed.Requested
                ? "userId"
                : "serviceUserId";
        if (startAfterDoc) {
            q = query(
                collection(firestore, COLLECTION_PATH),
                limit(PAGE_SIZE),
                where(userFieldId, "==", user.id),
                where("createdAt", "<=", adjustedDeadline),
                orderBy("createdAt", "desc"),
                startAfter(startAfterDoc),
            );
        } else {
            q = query(
                collection(firestore, COLLECTION_PATH),
                limit(PAGE_SIZE),
                where(userFieldId, "==", user.id),
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
        if (user) {
            fetchDocuments();
        }
    }, [user, deadline]);

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

    const getServiceItem = (service: ServiceRequestInterface, key: string) => {
        if (typeOfService === "driver" || typeOfService === "tow") {
            return (
                <CardForServicePerfWithLocation
                    typeOfService={typeOfService}
                    service={service}
                    fakeUserServerId={
                        typeOfPerf === TypeOfServicePerformed.Served
                            ? userId
                            : undefined
                    }
                    key={key}
                />
            );
        } else {
            return (
                <CardForServicePerfWithReason
                    typeOfService={typeOfService}
                    service={service}
                    fakeUserServerId={
                        typeOfPerf === TypeOfServicePerformed.Served
                            ? userId
                            : undefined
                    }
                    key={key}
                />
            );
        }
    };

    const theareNoResults = (): boolean => {
        return documents.length === 0 && !hasMore;
    };

    if (!user) {
        return <PageLoading />;
    }

    return (
        <div
            className={`render-data-wrapper ${
                theareNoResults() && "auto-height max-height-100"
            }`}
        >
            <h2 className="text | bold big margin-bottom-25 capitalize">
                Servicios{" "}
                <i className="text | bold big capitalize">{typeOfPerf}</i>
            </h2>

            <fieldset className="filter-date-wrapper">
                <input
                    type="date"
                    className="filter-date-input"
                    onChange={handleDeadlineChange}
                    value={
                        new Date(deadline.seconds * 1000)
                            .toISOString()
                            .split("T")[0]
                    }
                />
            </fieldset>

            <div className="margin-top-25"></div>
            <div className="service-req-wrapper">
                {documents.map((serviceData, i) =>
                    getServiceItem(serviceData, `service-requested-${i}`),
                )}
            </div>

            {theareNoResults() && (
                <div>
                    <h2>{"No se encontraron servicios"}</h2>
                    <span className="circles-right-bottomv2 green"></span>
                </div>
            )}

            <div className="margin-top-25"></div>
            {loading && <span className="loader-green"></span>}
            {!hasMore && documents.length > 0 && (
                <h4 className="text | light">No hay mas resultados ...</h4>
            )}
            {hasMore && (
                <button
                    className="text small-general-button | bold gray"
                    onClick={handleLoadMore}
                    disabled={loading}
                >
                    Cargar más
                </button>
            )}
        </div>
    );
};

export default ListOfServicesPerfByUser;
