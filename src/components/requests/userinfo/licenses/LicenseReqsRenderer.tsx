"use client";

import PageLoader from "@/components/PageLoader";
import { LicenseUpdateReq } from "@/interfaces/PersonalDocumentsInterface";
import {
    getLicencesToUpdateNumPages,
    getLicencesToUpdatePaginated,
} from "@/utils/requests/LicenseUpdaterReq";
import { DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import LicenseUpdateItemReq from "./LicenseUpdateItemReq";
import PageChanger from "../../data_renderer/form/PageChanger";

const LicenseReqsRenderer = () => {
    const numPerPage = 10;
    const [data, setData] = useState<LicenseUpdateReq[] | null>(null);
    const [firstDoc, setFirstDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [pages, setPages] = useState<number | null>(null);
    const [page, setPage] = useState<number>(1);
    const [direction, setDirection] = useState<"prev" | "next" | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);

        getLicencesToUpdateNumPages(numPerPage)
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
        getLicencesToUpdatePaginated(direction, startAfterDoc, endBeforeDoc, numPerPage)
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
                            <LicenseUpdateItemReq
                                license={req}
                                key={`license-update-req-item-${i}`}
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
                <h2>No hay peticiones para actualizar licencias</h2>
            </div>
        )
    ) : (
        <PageLoader />
    );
};

export default LicenseReqsRenderer;
