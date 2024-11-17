"use client";

import { DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ChangePhotoReqInterface } from "@/interfaces/ChangePhotoReq";
import {
    getChangePhotoReqNumPages,
    getChangePhotoReqPaginated,
} from "@/components/app_modules/users/api/ChangePhotoRequester";
import UserCardWithNewPhoto from "../cards/UserCardWithNewPhoto";
import InfiniteScroll from "react-infinite-scroll-component";
import "@/styles/components/personal-data-req.css";
import PageLoading from "@/components/loaders/PageLoading";
import WholeScreenText from "@/components/modules/WholeScreenText";
import DataLoading from "@/components/loaders/DataLoading";

const ListOfRequestsToUpdateUserPhotos = () => {
    const numPerPage = 10;
    const [data, setData] = useState<ChangePhotoReqInterface[] | null>(null);
    const [page, setPage] = useState<number>(1);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(
        undefined,
    );
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
        getChangePhotoReqPaginated(
            "next",
            startAfterDoc,
            endBeforeDoc,
            numPerPage,
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

    const handleNextClick = () => {
        if (page === pages) return;
        setPage((prev) => prev + 1);
    };

    if (!data) {
        return <PageLoading />;
    }

    if (data.length <= 0) {
        return (
            <WholeScreenText
                text={"No hay peticiones para actualizar fotos de perfil"}
            />
        );
    }

    return (
        <div className="render-data-wrapper">
            <h1
                className={
                    "text | big bold margin-bottom-25 capitalize"
                }
            >
                Solicitudes para editar fotos de Perfil
            </h1>
            <InfiniteScroll
                dataLength={data.length}
                next={handleNextClick}
                hasMore={page !== pages}
                loader={<DataLoading />}
            >
                <div className="personal-data-req-wrapper">
                    {data.map((req, i) => (
                        <UserCardWithNewPhoto
                            photo={req}
                            key={`photo-update-req-item-${i}`}
                        />
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default ListOfRequestsToUpdateUserPhotos;
