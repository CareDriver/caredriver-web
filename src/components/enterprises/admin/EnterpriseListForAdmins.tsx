"use client";

import React, { useEffect, useState } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import { Enterprise } from "@/interfaces/Enterprise";
import {
    getEnterprisesAdminNumPages,
    getEnterprisesAdminPaginated,
} from "@/utils/requests/enterprise/EnterpriseRequester";
import EnterpriseItem from "../EnterpriseItem";
import "@/styles/components/pagination.css";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import Plus from "@/icons/Plus";
import "@/styles/components/enterprise.css";


const EnterpriseListForAdmins = ({ type }: { type: string }) => {
    const numPerPage = 12;
    const [data, setData] = useState<Enterprise[] | null>(null);
    const [page, setPage] = useState<number>(1);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [pages, setPages] = useState<number | null>(null);

    useEffect(() => {
        getEnterprisesAdminNumPages(numPerPage, type).then((pages) => setPages(pages));
    }, []);

    useEffect(() => {
        const startAfterDoc = lastDoc;
        const endBeforeDoc = undefined;
        getEnterprisesAdminPaginated(
            type,
            "next",
            startAfterDoc,
            endBeforeDoc,
            numPerPage,
        ).then((result) => {
            if (data) {
                setData([...data, ...result.result]);
            } else {
                setData(result.result);
            }
            setLastDoc(result.lastDoc);
        });
    }, [page]);

    const handleNextClick = () => {
        if (page === pages) return;
        setPage((prev) => prev + 1);
    };

    return data ? (
        <section className="enterprise-main-wrapper">
            <h1 className="text | big bolder capitalize">
                {type === "tow"
                    ? "Empresas de Grua Creadas"
                    : "Talleres Mecanicos Creados"}
            </h1>
            <Link
                className="general-button icon-wrapper | max-20 less-padding no-full center white-icon touchable"
                href={`/admin/enterprises/${
                    type === "tow" ? "cranes" : "workshops"
                }/register`}
            >
                <Plus />
                <span className="text | bold">
                    {type === "tow" ? "Nueva Empresa" : "Nuevo Taller"}
                </span>
            </Link>
            {data.length > 0 ? (
                <InfiniteScroll
                    dataLength={data.length}
                    next={handleNextClick}
                    hasMore={page !== pages}
                    loader={<span className="loader-gray"></span>}
                >
                    <div className="enterprise-list">
                        {data.map((product, i) => (
                            <EnterpriseItem
                                key={`enterprise-item-${i}`}
                                route={`/admin/enterprises/${
                                    type === "tow" ? "cranes" : "workshops"
                                }/edit/${product.id}`}
                                enterprise={product}
                            />
                        ))}
                    </div>
                </InfiniteScroll>
            ) : (
                <div className="empty-wrapper | auto-height">
                    <h2>
                        No hay{" "}
                        {type === "tow"
                            ? "ninguna empresa de grua creada"
                            : "ningun taller mecanico creado"}
                    </h2>
                </div>
            )}
        </section>
    ) : (
        <div className="empty-wrapper | auto-height">
            <span className="loader-green | big-loader"></span>
        </div>
    );
};

export default EnterpriseListForAdmins;
