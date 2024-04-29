"use client";

import PageLoader from "@/components/PageLoader";
import { DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import "@/styles/components/pagination.css";
import PageChanger from "@/components/requests/data_renderer/form/PageChanger";
import {
    getAllUsersNumPages,
    getAllUsersPaginated,
    getSearchUsersNumPages,
    getSearchUsersPaginated,
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

    const [searchState, setSearchState] = useState({
        value: "",
        isSearching: false,
        wereThereResults: true,
    });

    const calculateSearchPages = () => {
        setLoading(true);

        if (searchState.isSearching) {
            getSearchUsersNumPages(numPerPage, searchState.value)
                .then((pages) => {
                    setPages(pages);
                    setLoading(false);
                })
                .catch((e) => {
                    console.log(e);
                    setLoading(false);
                });
        }
    };

    const calculateNormalNumPages = () => {
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
    };

    useEffect(() => {
        calculateNormalNumPages();
    }, []);

    const getSearchData = () => {
        const startAfterDoc = direction === "next" ? lastDoc : undefined;
        const endBeforeDoc = direction === "prev" ? firstDoc : undefined;
        getSearchUsersPaginated(
            searchState.value,
            direction,
            startAfterDoc,
            endBeforeDoc,
            numPerPage,
        )
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
    };

    const getAllUsersData = () => {
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
    };

    useEffect(() => {
        setLoading(true);

        if (searchState.isSearching) {
            getSearchData();
        } else {
            getAllUsersData();
        }
    }, [page]);

    useEffect(() => {
        if (searchState.isSearching && data && data.length <= 0) {
            setSearchState({
                ...searchState,
                wereThereResults: false,
            });
        }
    }, [data]);

    const search = () => {
        setFirstDoc(undefined);
        setLastDoc(undefined);
        setDirection(undefined);
        if (searchState.value.trim().length == 0) {
            setSearchState({
                ...searchState,
                isSearching: false,
            });
            calculateNormalNumPages();
            getAllUsersData();
        } else {
            setSearchState({
                ...searchState,
                isSearching: true,
            });
            calculateSearchPages();
            getSearchData();
        }
    };

    return data ? (
        <div>
            <div>
                <fieldset>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email, telefono"
                        value={searchState.value}
                        onChange={(e) => {
                            setSearchState({
                                ...searchState,
                                value: e.target.value,
                                wereThereResults: true,
                            });
                        }}
                    />
                    <button onClick={search} disabled={!searchState.wereThereResults}>
                        Buscar
                    </button>
                </fieldset>
            </div>
            {data.length > 0 ? (
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
                                    <img src={req.photoUrl.url} alt="" />
                                    <div>
                                        <h2>{req.fullName}</h2>
                                        <h4>{req.email}</h4>
                                        <h4>{req.phoneNumber}</h4>
                                        <h4>
                                            {req.services
                                                .toString()
                                                .replaceAll(",", " | ")}
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
                    <h2>
                        {searchState.isSearching
                            ? "Ningun usuario fue encontrado"
                            : "No hay usuarios registrados en la aplicacion"}
                    </h2>
                </div>
            )}
        </div>
    ) : (
        <PageLoader />
    );
};

export default UsersRenderer;
