"use client";

import PageLoader from "@/components/PageLoader";
import { DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ChangePhotoReqInterface } from "@/interfaces/ChangePhotoReq";
import {
    getChangePhotoReqNumPages,
    getChangePhotoReqPaginated,
} from "@/utils/requests/ChangePhotoRequester";
import UpPhotoItemReq from "./UpPhotoItemReq";
import InfiniteScroll from "react-infinite-scroll-component";
import "@/styles/components/personal-data-req.css";

const UpPhotoReqsRenderer = () => {
    const numPerPage = 10;
    const [data, setData] = useState<ChangePhotoReqInterface[] | null>(null);
    const [page, setPage] = useState<number>(1);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [pages, setPages] = useState<number | null>(null);

    useEffect(() => {
        getChangePhotoReqNumPages(numPerPage)
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
        getChangePhotoReqPaginated("next", startAfterDoc, endBeforeDoc, numPerPage)
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

    const handleNextClick = () => {
        if (page === pages) return;
        setPage((prev) => prev + 1);
    };

    return data ? (
        data.length > 0 ? (
            <div className="render-data-wrapper">
                <h1 className={"text | big-medium bolder margin-bottom-25 capitalize"}>
                    Solicitudes para editar fotos de Perfil
                </h1>
                <InfiniteScroll
                    dataLength={data.length}
                    next={handleNextClick}
                    hasMore={page !== pages}
                    loader={<span className="loader-gray"></span>}
                >
                    <div className="personal-data-req-wrapper">
                        {data.map((req, i) => (
                            <UpPhotoItemReq
                                photo={req}
                                key={`photo-update-req-item-${i}`}
                            />
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        ) : (
            <div className="empty-wrapper | auto-height">
                <h2>No hay peticiones para actualizar fotos de perfil</h2>
            </div>
        )
    ) : (
        <PageLoader />
    );
};

export default UpPhotoReqsRenderer;
