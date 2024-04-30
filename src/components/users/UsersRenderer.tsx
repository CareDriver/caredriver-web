"use client";

import PageLoader from "@/components/PageLoader";
import { DocumentSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import "@/styles/components/pagination.css";
import PageChanger from "@/components/requests/data_renderer/form/PageChanger";
import {
    getAllUsersNumPages,
    getAllUsersPaginated,
    getSearchUsersNumPages,
    getSearchUsersPaginated,
} from "@/utils/requests/UserRequester";
import { UserInterface } from "@/interfaces/UserInterface";
import UserItemRenderer from "./UserItemRenderer";
import { AuthContext } from "@/context/AuthContext";

const UsersRenderer = () => {
    const numPerPage = 1;
    const [data, setData] = useState<UserInterface[] | null>(null);
    const [firstDoc, setFirstDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [pages, setPages] = useState<number | null>(null);
    const [page, setPage] = useState<number>(1);
    const [direction, setDirection] = useState<"prev" | "next" | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);

    const { loadingUser, user } = useContext(AuthContext);

    const [searchState, setSearchState] = useState({
        value: "",
        isSearching: false,
        wereThereResults: true,
    });

    const calculateSearchPages = async () => {
        if (user.data && user.data.email && searchState.isSearching) {
            setLoading(true);
            try {
                var pags = await getSearchUsersNumPages(
                    user.data.email,
                    numPerPage,
                    searchState.value,
                );
                setPages(pags);
                setLoading(false);
            } catch (e) {
                console.log(e);
                setLoading(false);
            }
        }
    };

    const calculateNormalNumPages = async () => {
        if (user.data && user.data.email) {
            setLoading(true);
            try {
                var pags = await getAllUsersNumPages(user.data.email, numPerPage);
                setPages(pags);
                setLoading(false);
            } catch (e) {
                console.log(e);
                setLoading(false);
            }
        }
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

    const getSearchData = async () => {
        if (user.data && user.data.email) {
            try {
                const startAfterDoc = direction === "next" ? lastDoc : undefined;
                const endBeforeDoc = direction === "prev" ? firstDoc : undefined;
                var dat = await getSearchUsersPaginated(
                    user.data.email,
                    searchState.value,
                    direction,
                    startAfterDoc,
                    endBeforeDoc,
                    numPerPage,
                );
                setData(dat.result);
                setFirstDoc(dat.firstDoc);
                setLastDoc(dat.lastDoc);
                setLoading(false);
            } catch (e) {
                console.log(e);
                setLoading(false);
            }
        }
    };

    const getAllUsersData = async () => {
        if (user.data && user.data.email) {
            try {
                const startAfterDoc = direction === "next" ? lastDoc : undefined;
                const endBeforeDoc = direction === "prev" ? firstDoc : undefined;
                var dat = await getAllUsersPaginated(
                    user.data.email,
                    direction,
                    startAfterDoc,
                    endBeforeDoc,
                    numPerPage,
                );
                setData(dat.result);
                setFirstDoc(dat.firstDoc);
                setLastDoc(dat.lastDoc);
                setLoading(false);
            } catch (e) {
                console.log(e);
                setLoading(false);
            }
        }
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

    const search = async () => {
        setFirstDoc(undefined);
        setLastDoc(undefined);
        setDirection(undefined);
        if (searchState.value.trim().length == 0) {
            setSearchState({
                ...searchState,
                isSearching: false,
            });
            await getAllUsersData();
        } else {
            setSearchState({
                ...searchState,
                isSearching: true,
            });
            await getSearchData();
        }
        setPages(null);
        setPage(1);
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
                                <UserItemRenderer req={req} key={`user-item-${i}`} />
                            ))}
                        </div>
                    )}

                    {pages ? (
                        <PageChanger
                            page={page}
                            pages={pages}
                            loading={loading}
                            setPage={setPage}
                            setDirection={setDirection}
                        />
                    ) : (
                        <span className="loader-green"></span>
                    )}
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
