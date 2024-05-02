"use client";

import PageLoader from "@/components/PageLoader";
import { DocumentSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import "@/styles/components/pagination.css";
import {
    getAllUsersNumPages,
    getAllUsersPaginated,
    getSearchUsersNumPages,
    getSearchUsersPaginated,
} from "@/utils/requests/UserRequester";
import { UserInterface } from "@/interfaces/UserInterface";
import UserItemRenderer from "./UserItemRenderer";
import { AuthContext } from "@/context/AuthContext";
import InfiniteScroll from "react-infinite-scroll-component";

const UsersRenderer = () => {
    const numPerPage = 2;
    const { loadingUser, user } = useContext(AuthContext);
    const [dataState, setDataState] = useState<{
        data: UserInterface[] | null;
        page: number;
        pages: number | null;
        lastDoc: DocumentSnapshot | undefined;
        value: string;
        isSearching: boolean;
        wereThereResults: boolean;
    }>({
        data: null,
        page: 1,
        pages: null,
        lastDoc: undefined,
        value: "",
        isSearching: false,
        wereThereResults: true,
    });

    const calculateSearchPages = async () => {
        if (user.data && user.data.email && dataState.isSearching) {
            try {
                var pages = await getSearchUsersNumPages(
                    user.data.email,
                    numPerPage,
                    dataState.value,
                );
                setDataState({
                    ...dataState,
                    pages,
                });
            } catch (e) {
                console.log(e);
            }
        }
    };

    const calculateNormalNumPages = async () => {
        if (user.data && user.data.email) {
            try {
                var pages = await getAllUsersNumPages(user.data.email, numPerPage);
                setDataState({
                    ...dataState,
                    pages,
                });
            } catch (e) {
                console.log(e);
            }
        }
    };

    const getSearchData = async () => {
        if (user.data && user.data.email) {
            try {
                const startAfterDoc = dataState.lastDoc;
                const endBeforeDoc = undefined;
                var result = await getSearchUsersPaginated(
                    user.data.email,
                    dataState.value,
                    "next",
                    startAfterDoc,
                    endBeforeDoc,
                    numPerPage,
                );
                var newData;
                if (dataState.data) {
                    newData = [...dataState.data, ...result.result];
                } else {
                    newData = result.result;
                }
                setDataState({
                    ...dataState,
                    data: newData,
                    lastDoc: result.lastDoc,
                });
            } catch (e) {
                console.log(e);
            }
        }
    };

    const getAllUsersData = async () => {
        if (user.data && user.data.email) {
            try {
                const startAfterDoc = dataState.lastDoc;
                const endBeforeDoc = undefined;
                var result = await getAllUsersPaginated(
                    user.data.email,
                    "next",
                    startAfterDoc,
                    endBeforeDoc,
                    numPerPage,
                );
                var newData;
                if (dataState.data) {
                    newData = [...dataState.data, ...result.result];
                } else {
                    newData = result.result;
                }
                setDataState({
                    ...dataState,
                    data: newData,
                    lastDoc: result.lastDoc,
                });
            } catch (e) {
                console.log(e);
            }
        }
    };

    const search = async () => {
        if (dataState.value.trim().length == 0) {
            setDataState({
                ...dataState,
                data: null,
                lastDoc: undefined,
                pages: null,
                page: 1,
                isSearching: false,
            });
        } else {
            setDataState({
                ...dataState,
                data: null,
                lastDoc: undefined,
                pages: null,
                page: 1,
                isSearching: true,
            });
        }
    };

    const handleNextClick = async () => {
        if (dataState.page === dataState.pages) {
            setDataState({
                ...dataState,
                wereThereResults: false,
            });
        } else {
            if (user.data && user.data.email) {
                if (dataState.isSearching) {
                    try {
                        const startAfterDoc = dataState.lastDoc;
                        const endBeforeDoc = undefined;
                        var result = await getSearchUsersPaginated(
                            user.data.email,
                            dataState.value,
                            "next",
                            startAfterDoc,
                            endBeforeDoc,
                            numPerPage,
                        );
                        var newData;
                        if (dataState.data) {
                            newData = [...dataState.data, ...result.result];
                        } else {
                            newData = result.result;
                        }
                        setDataState({
                            ...dataState,
                            data: newData,
                            lastDoc: result.lastDoc,
                            page: dataState.page + 1,
                        });
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    try {
                        const startAfterDoc = dataState.lastDoc;
                        const endBeforeDoc = undefined;
                        var result = await getAllUsersPaginated(
                            user.data.email,
                            "next",
                            startAfterDoc,
                            endBeforeDoc,
                            numPerPage,
                        );
                        var newData;
                        if (dataState.data) {
                            newData = [...dataState.data, ...result.result];
                        } else {
                            newData = result.result;
                        }
                        setDataState({
                            ...dataState,
                            data: newData,
                            lastDoc: result.lastDoc,
                            page: dataState.page + 1,
                        });
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
    };

    useEffect(() => {
        if (!loadingUser) {
            calculateNormalNumPages();
        }
    }, [loadingUser]);

    useEffect(() => {
        if (!dataState.pages) {
            if (dataState.isSearching) {
                calculateSearchPages();
            } else {
                calculateNormalNumPages();
            }
        }
    }, [dataState.pages]);

    useEffect(() => {
        if (dataState.data === null) {
            if (dataState.isSearching) {
                getSearchData();
            } else {
                getAllUsersData();
            }
        }
    }, [dataState.data]);

    return dataState.data ? (
        <div>
            <div>
                <fieldset>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email, telefono"
                        value={dataState.value}
                        onChange={(e) => {
                            setDataState({
                                ...dataState,
                                value: e.target.value,
                            });
                        }}
                    />
                    <button onClick={search}>Buscar</button>
                </fieldset>
            </div>
            {dataState.data.length > 0 ? (
                <InfiniteScroll
                    dataLength={dataState.data.length}
                    next={handleNextClick}
                    hasMore={dataState.page !== dataState.pages}
                    loader={<span className="loader-gray"></span>}
                >
                    {dataState.data.map((req, i) => (
                        <UserItemRenderer req={req} key={`user-item-${i}`} />
                    ))}
                </InfiniteScroll>
            ) : (
                <div className="empty-wrapper | auto-height">
                    <h2>
                        {dataState.isSearching
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
