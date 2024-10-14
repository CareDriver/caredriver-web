"use client";

import { LicenseUpdateReq } from "@/interfaces/PersonalDocumentsInterface";
import {
    getLicencesToUpdateNumPages,
    getLicencesToUpdatePaginated,
} from "@/components/app_modules/server_users/api/LicenseUpdaterReq";
import { DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import LicenseCard from "../cards/LicenseCard";
import InfiniteScroll from "react-infinite-scroll-component";
import "@/styles/components/personal-data-req.css";
import DataLoading from "@/components/loaders/DataLoading";
import WholeScreenText from "@/components/modules/WholeScreenText";
import PageLoading from "@/components/loaders/PageLoading";

const ListOfRequestsForLicenseRenewal = () => {
    const PAGE_SIZE = 15;
    const [data, setData] = useState<LicenseUpdateReq[] | null>(null);
    const [page, setPage] = useState<number>(1);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(
        undefined,
    );
    const [pages, setPages] = useState<number | null>(null);

    const handleNextClick = () => {
        if (page === pages) return;
        setPage((prev) => prev + 1);
    };

    useEffect(() => {
        getLicencesToUpdateNumPages(PAGE_SIZE)
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
        getLicencesToUpdatePaginated(
            "next",
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
            .catch(() => {});
    }, [page]);

    if (!data) {
        return <PageLoading />;
    }

    if (data.length <= 0) {
        return (
            <WholeScreenText text="No hay peticiones para actualizar licencias" />
        );
    }

    return (
        <div className="render-data-wrapper">
            <h1
                className={
                    "text | big bolder margin-bottom-25 capitalize"
                }
            >
                Solicitudes para renovar Licencias
            </h1>
            <InfiniteScroll
                dataLength={data.length}
                next={handleNextClick}
                hasMore={page !== pages}
                loader={<DataLoading />}
            >
                <div className="personal-data-req-wrapper">
                    {data.map((req, i) => (
                        <LicenseCard
                            license={req}
                            key={`license-update-req-item-${i}`}
                        />
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default ListOfRequestsForLicenseRenewal;
