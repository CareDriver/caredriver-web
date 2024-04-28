"use client";

import PageLoader from "@/components/PageLoader";
import { DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import "@/styles/components/pagination.css";
import { EnterpriseTypeRender, ReqEditEnterprise } from "@/interfaces/Enterprise";
import {
    getEditEnterpriseReqs,
    getEditEnterpriseReqsNumPages,
} from "@/utils/requests/enterprise/EditEnterpriseReq";
import EnterpriseUpItemReq from "./EnterpriseUpItemReq";
import PageChanger from "../../data_renderer/form/PageChanger";

const EnterpriseUpReqsRender = ({ type }: { type: "mechanical" | "tow" }) => {
    const numPerPage = 10;
    const [data, setData] = useState<ReqEditEnterprise[] | null>(null);
    const [firstDoc, setFirstDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [pages, setPages] = useState<number | null>(null);
    const [page, setPage] = useState<number>(1);
    const [direction, setDirection] = useState<"prev" | "next" | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);

        getEditEnterpriseReqsNumPages(numPerPage, type)
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
        getEditEnterpriseReqs(type, direction, startAfterDoc, endBeforeDoc, numPerPage)
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
                            <EnterpriseUpItemReq
                                enterprise={req}
                                type={type}
                                key={`service-req-up-item-${i}`}
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
                <h2>
                    No hay peticiones para editar {type === "tow" ? "una" : "un"}{" "}
                    {EnterpriseTypeRender[type]}
                </h2>
            </div>
        )
    ) : (
        <PageLoader />
    );
};

export default EnterpriseUpReqsRender;
