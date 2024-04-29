"use client";

import PageLoader from "@/components/PageLoader";
import { DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import "@/styles/components/pagination.css";
import PageChanger from "@/components/requests/data_renderer/form/PageChanger";
import {
    getAllUsersNumPages,
    getAllUsersPaginated,
} from "@/utils/requests/UserRequester";
import { UserInterface } from "@/interfaces/UserInterface";

const UsersRenderer = () => {
    const numPerPage = 10;
    const [data, setData] = useState<UserInterface[] | null>(null);
    const [firstDoc, setFirstDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [pages, setPages] = useState<number | null>(null);
    const [page, setPage] = useState<number>(1);
    const [direction, setDirection] = useState<"prev" | "next" | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);

        getAllUsersNumPages(numPerPage)
            .then((pages) => {
                setPages(pages);
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);                
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        setLoading(true);

        const startAfterDoc = direction === "next" ? lastDoc : undefined;
        const endBeforeDoc = direction === "prev" ? firstDoc : undefined;
        getAllUsersPaginated(direction, startAfterDoc, endBeforeDoc, numPerPage)
            .then((data) => {
                setData(data.result);
                setFirstDoc(data.firstDoc);
                setLastDoc(data.lastDoc);
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);
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
                            // <ServiceItemReq
                            //     req={req}
                            //     key={`service-req-item-${i}`}
                            //     type={type}
                            // />
                            <div key={`user-item-${i}`}>
                                <img src={req.photoUrl} alt="" />
                                <div>
                                    <h2>{req.fullName}</h2>
                                    <h4>{req.email}</h4>
                                    <h4>{req.phoneNumber}</h4>
                                    <h4>
                                        {req.services.toString().replaceAll(",", " | ")}
                                    </h4>
                                </div>
                            </div>
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
                <h2>No hay usuarios registrados en la aplicacion</h2>
            </div>
        )
    ) : (
        <PageLoader />
    );
};

export default UsersRenderer;
