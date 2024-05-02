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
    const numPerPage = 10;
    const [data, setData] = useState<UserInterface[] | null>(null);
    const [page, setPage] = useState<number>(1);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [pages, setPages] = useState<number | null>(null);
    
    const { loadingUser, user } = useContext(AuthContext);
    const [searchState, setSearchState] = useState({
        value: "",
        isSearching: false,
        wereThereResults: true,
    });

    const calculateSearchPages = async () => {
        if (user.data && user.data.email && searchState.isSearching) {
            try {
                var pags = await getSearchUsersNumPages(
                    user.data.email,
                    numPerPage,
                    searchState.value,
                );
                setPages(pags);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const calculateNormalNumPages = async () => {
        if (user.data && user.data.email) {
            try {
                var pags = await getAllUsersNumPages(user.data.email, numPerPage);
                setPages(pags);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const getSearchData = async () => {
        if (user.data && user.data.email) {
            try {
                const startAfterDoc = lastDoc;
                const endBeforeDoc = undefined;
                var result = await getSearchUsersPaginated(
                    user.data.email,
                    searchState.value,
                    "next",
                    startAfterDoc,
                    endBeforeDoc,
                    numPerPage,
                );
                if (data) {
                    setData([...data, ...result.result]);
                } else {
                    setData(result.result);
                }
                setLastDoc(result.lastDoc);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const getAllUsersData = async () => {
        if (user.data && user.data.email) {
            try {
                const startAfterDoc = lastDoc;
                const endBeforeDoc = undefined;
                var result = await getAllUsersPaginated(
                    user.data.email,
                    "next",
                    startAfterDoc,
                    endBeforeDoc,
                    numPerPage,
                );
                if (data) {
                    setData([...data, ...result.result]);
                } else {
                    setData(result.result);
                }
                setLastDoc(result.lastDoc);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const search = async () => {
        setData(null);
        setLastDoc(undefined);
        if (searchState.value.trim().length == 0) {
            setSearchState({
                ...searchState,
                isSearching: false,
            });
        } else {
            setSearchState({
                ...searchState,
                isSearching: true,
            });
        }
        setPages(null);
        setPage(1);
    };

    const handleNextClick = () => {
        if (page === pages) return;
        setPage((prev) => prev + 1);
    };

    useEffect(() => {
        if (!loadingUser) {
            calculateNormalNumPages();
        }
    }, [loadingUser]);

    useEffect(() => {
        if (!pages) {
            if (searchState.isSearching) {
                calculateSearchPages();
            } else {
                calculateNormalNumPages();
            }
        }
    }, [pages]);

    useEffect(() => {
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
                <InfiniteScroll
                    dataLength={data.length}
                    next={handleNextClick}
                    hasMore={page !== pages}
                    loader={<span className="loader-gray"></span>}
                    endMessage={
                        <div>
                            <span>no hay mas usuarios</span>
                        </div>
                    }
                >
                    {data.map((req, i) => (
                        <UserItemRenderer req={req} key={`user-item-${i}`} />
                    ))}
                </InfiniteScroll>
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
