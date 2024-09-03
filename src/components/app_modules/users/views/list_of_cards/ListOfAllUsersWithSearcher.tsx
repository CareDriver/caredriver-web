"use client";

import { DocumentSnapshot } from "firebase/firestore";
import { FormEvent, useContext, useEffect, useState } from "react";
import "@/styles/components/pagination.css";
import {
    getAllUsersNumPages,
    getAllUsersPaginated,
    getSearchUsersNumPages,
    getSearchUsersPaginated,
} from "@/components/app_modules/users/api/UserRequester";
import { UserInterface } from "@/interfaces/UserInterface";
import UserCardWithDetails from "../cards/UserCardWithDetails";
import { AuthContext } from "@/context/AuthContext";
import InfiniteScroll from "react-infinite-scroll-component";
import "@/styles/modules/search.css";
import "@/styles/components/users.css";
import Search from "@/icons/Search";
import Link from "next/link";
import UserPlus from "@/icons/UserPlus";
import DataLoading from "../../../../loaders/DataLoading";
import PageLoading from "../../../../loaders/PageLoading";
import GuardOfModule from "@/components/guards/views/module_guards/GuardOfModule";
import { ROLES_TO_ADD_USERS } from "@/components/guards/models/PermissionsByUserRole";
import {
    routeToCreateNewUserAsAdmin,
    routeToManageUserAsAdmin,
} from "@/utils/route_builders/as_admin/RouteBuilderForUsersAsAdmin";

const ListOfAllUsersWithSearcher = () => {
    const { checkingUserAuth, user: adminUser } = useContext(AuthContext);
    const numPerPage = 10;
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
        if (adminUser && adminUser.email && dataState.isSearching) {
            try {
                var pages = await getSearchUsersNumPages(
                    adminUser.role,
                    adminUser.email,
                    numPerPage,
                    dataState.value.toLocaleLowerCase(),
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
        if (adminUser && adminUser.email) {
            try {
                var pages = await getAllUsersNumPages(
                    adminUser.role,
                    adminUser.email,
                    numPerPage,
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

    const getSearchData = async () => {
        if (adminUser && adminUser.email) {
            try {
                const startAfterDoc = dataState.lastDoc;
                const endBeforeDoc = undefined;
                var result = await getSearchUsersPaginated(
                    adminUser.role,
                    adminUser.email,
                    dataState.value.toLocaleLowerCase(),
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
        if (adminUser && adminUser.email) {
            try {
                const startAfterDoc = dataState.lastDoc;
                const endBeforeDoc = undefined;
                var result = await getAllUsersPaginated(
                    adminUser.role,
                    adminUser.email,
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

    const search = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
            if (adminUser && adminUser.email) {
                if (dataState.isSearching) {
                    try {
                        const startAfterDoc = dataState.lastDoc;
                        const endBeforeDoc = undefined;
                        var result = await getSearchUsersPaginated(
                            adminUser.role,
                            adminUser.email,
                            dataState.value.toLocaleLowerCase(),
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
                            adminUser.role,
                            adminUser.email,
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
        if (!checkingUserAuth) {
            calculateNormalNumPages();
        }
    }, [checkingUserAuth]);

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
        <div className="render-data-wrapper">
            <h1 className="text | big-medium bolder margin-bottom-25 capitalize">
                Usuarios
            </h1>
            <div className="row-wrapper | row-responsive space-between | margin-bottom-50">
                <form className="search-wrapper" onSubmit={(e) => search(e)}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar por nombre, email, telefono"
                        value={dataState.value}
                        onChange={(e) => {
                            setDataState({
                                ...dataState,
                                value: e.target.value,
                            });
                        }}
                    />
                    <button className="search-button icon-wrapper | gray-icon">
                        <Search />
                    </button>
                </form>
                <div>
                    {adminUser && (
                        <GuardOfModule
                            user={adminUser}
                            roles={ROLES_TO_ADD_USERS}
                        >
                            <Link
                                href={routeToCreateNewUserAsAdmin()}
                                className="icon-wrapper small-general-button text | bolder white-icon touchable"
                            >
                                <UserPlus />
                                Nuevo Usuario
                            </Link>
                        </GuardOfModule>
                    )}
                </div>
            </div>
            {dataState.data.length > 0 ? (
                <InfiniteScroll
                    dataLength={dataState.data.length}
                    next={handleNextClick}
                    hasMore={dataState.page !== dataState.pages}
                    loader={<DataLoading />}
                >
                    <div className="users-wrapper">
                        {dataState.data.map(
                            (user, i) =>
                                user.fakeId && (
                                    <Link
                                        className="touchable"
                                        key={`user-${i}`}
                                        href={routeToManageUserAsAdmin(
                                            user.fakeId,
                                        )}
                                    >
                                        <UserCardWithDetails
                                            user={user}
                                            reviewerUser={adminUser}
                                        />
                                    </Link>
                                ),
                        )}
                    </div>
                </InfiniteScroll>
            ) : (
                <div className="empty-wrapper | auto-height">
                    <h2>
                        {dataState.isSearching
                            ? "Ningún usuario fue encontrado"
                            : "No hay usuarios registrados en la aplicación"}
                    </h2>
                </div>
            )}
        </div>
    ) : (
        <PageLoading />
    );
};

export default ListOfAllUsersWithSearcher;
