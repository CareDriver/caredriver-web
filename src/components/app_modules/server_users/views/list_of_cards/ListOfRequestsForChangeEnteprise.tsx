"use client";

import { DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "@/styles/components/personal-data-req.css";
import DataLoading from "@/components/loaders/DataLoading";
import WholeScreenText from "@/components/modules/WholeScreenText";
import PageLoading from "@/components/loaders/PageLoading";
import { RequestForChangeOfEnterprise } from "@/interfaces/RequestForChangeOfEnterprise";
import {
    countPagesOfRequestsToChangeEnterprise,
    getRequestsToChangeEntepriseByPagination,
} from "../../api/RequestForChangeEnterprise";
import Link from "next/link";
import { routeToReviewRequestToChangeEnterpriseAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUserServerAsAdmin";
import CardToRequesterToChangeEnterprise from "../cards/CardToRequesterToChangeEnterprise";

interface Props {}

const ListOfRequestsForChangeEnteprise: React.FC<Props> = ({}) => {
    const PAGE_SIZE = 15;
    const [data, setData] = useState<RequestForChangeOfEnterprise[] | null>(
        null,
    );
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
        countPagesOfRequestsToChangeEnterprise(PAGE_SIZE)
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
        getRequestsToChangeEntepriseByPagination(
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
            .catch((e) => {console.log(e);
            });
    }, [page]);

    if (!data) {
        return <PageLoading />;
    }

    if (data.length <= 0) {
        return (
            <WholeScreenText text="No hay peticiones de usuarios para cambiarse de empresa" />
        );
    }

    return (
        <div className="render-data-wrapper">
            <h1
                className={
                    "text | big bolder margin-bottom-25 capitalize"
                }
            >
                Solicitudes para cambiarse de empresa
            </h1>

            <InfiniteScroll
                dataLength={data.length}
                next={handleNextClick}
                hasMore={page !== pages}
                loader={<DataLoading />}
            >
                <div className="personal-data-req-wrapper">
                    {data.map((req, i) => (
                        <Link
                            href={routeToReviewRequestToChangeEnterpriseAsAdmin(
                                req.id,
                            )}
                            key={`enterprise-update-req-item-${i}`}
                            className="touchable"
                        >
                            <CardToRequesterToChangeEnterprise req={req} />
                        </Link>
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default ListOfRequestsForChangeEnteprise;
