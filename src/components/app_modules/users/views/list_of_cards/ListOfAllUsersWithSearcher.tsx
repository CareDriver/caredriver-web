"use client";

import { DocumentSnapshot } from "firebase/firestore";
import { FormEvent, useContext, useEffect, useState } from "react";
import "@/styles/components/pagination.css";
import {
    getAllUsersPaginated,
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
import { isNullOrEmptyText } from "@/validators/TextValidator";
import { validateSearchInput } from "../../validators/for_data/SearcherValidator";

const ListOfAllUsersWithSearcher = () => {
    const PAGE_SIZE = 10;
    const { checkingUserAuth, user: adminUser } = useContext(AuthContext);

    const [searchState, setSearchState] = useState({
        isSearching: false,
        currentInput: "",
        searchInput: "",
    });
    const [documents, setDocuments] = useState<UserInterface[]>([]);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(
        undefined,
    );
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const updateDocuments = (newDocs: UserInterface[]) => {
        setDocuments((prevDocuments) => {
            const updatedDocs = prevDocuments.map((doc) => {
                const newDoc = newDocs.find((d) => d.id === doc.id);
                return newDoc ? newDoc : doc;
            });

            const newUniqueDocs = newDocs.filter(
                (newDoc) => !updatedDocs.some((doc) => doc.id === newDoc.id),
            );

            return [...updatedDocs, ...newUniqueDocs];
        });
    };

    const searchUsers = async (
        adminUser: UserInterface,
        searchCriteria: string,
        startAfterDoc: DocumentSnapshot | undefined,
    ) => {
        if (loading) {
            return;
        }

        setLoading(true);
        try {
            var res = await getSearchUsersPaginated(
                adminUser.role,
                adminUser.email ?? "",
                searchCriteria,
                "next",
                startAfterDoc,
                PAGE_SIZE,
            );
            if (res.result.length > 0) {
                updateDocuments(res.result);
            } else {
                setHasMore(false);
            }
            setLastDoc(res.lastDoc);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    const findAllUsers = async (
        adminUser: UserInterface,
        startAfterDoc: DocumentSnapshot | undefined,
    ) => {
        if (loading) {
            return;
        }

        setLoading(true);

        try {
            var res = await getAllUsersPaginated(
                adminUser.role,
                adminUser.email ?? "",
                "next",
                startAfterDoc,
                PAGE_SIZE,
            );
            if (res.result.length > 0) {
                updateDocuments(res.result);
            } else {
                setHasMore(false);
            }
            setLastDoc(res.lastDoc);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    const defaultLoading = async (adminUser: UserInterface) => {
        setDocuments([]);
        setHasMore(true);
        setSearchState((prev) => ({ ...prev, isSearching: false }));
        await findAllUsers(adminUser, undefined);
    };

    const performSearch = async (
        e: FormEvent<HTMLFormElement>,
        adminUser: UserInterface,
    ) => {
        e.preventDefault();
        let validToSearch: boolean =
            !isNullOrEmptyText(searchState.currentInput) &&
            validateSearchInput(searchState.currentInput);
        if (validToSearch) {
            setDocuments([]);
            setHasMore(true);
            setSearchState((prev) => ({
                ...prev,
                searchInput: prev.currentInput,
                isSearching: true,
            }));
            await searchUsers(adminUser, searchState.currentInput, undefined);
        } else {
            setDocuments([]);
            setHasMore(false);
            setSearchState((prev) => ({
                ...prev,
                isSearching: true,
            }));
        }
    };

    const next = async (adminUser: UserInterface) => {
        if (searchState.isSearching) {
            await searchUsers(adminUser, searchState.searchInput, lastDoc);
        } else {
            await findAllUsers(adminUser, lastDoc);
        }
    };

    const nothingWasFound = (): boolean => documents.length === 0 && !hasMore;

    useEffect(() => {
        if (!checkingUserAuth && adminUser) {
            next(adminUser);
        }
    }, [checkingUserAuth]);

    if (checkingUserAuth || !adminUser) {
        return <PageLoading />;
    }

    return (
        <div
            className={`render-data-wrapper ${
                nothingWasFound() && "auto-height max-height-100"
            }`}
        >
            <h1 className="text | big bold margin-bottom-25 capitalize">
                Usuarios
            </h1>
            <div className="row-wrapper | row-responsive space-between | margin-bottom-50">
                <form
                    className="search-wrapper"
                    onSubmit={(e) => performSearch(e, adminUser)}
                >
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar por nombre, email, teléfono completo"
                        value={searchState.currentInput}
                        onChange={(e) => {
                            setSearchState((prev) => ({
                                ...prev,
                                currentInput: e.target.value,
                            }));
                        }}
                    />
                    <button className="search-button icon-wrapper | gray-icon">
                        <Search />
                    </button>
                </form>
                <GuardOfModule user={adminUser} roles={ROLES_TO_ADD_USERS}>
                    <Link
                        href={routeToCreateNewUserAsAdmin()}
                        className="icon-wrapper small-general-button text | bold touchable"
                    >
                        <UserPlus />
                        Nuevo Usuario
                    </Link>
                </GuardOfModule>
            </div>
            <InfiniteScroll
                dataLength={documents.length}
                next={() => next(adminUser)}
                hasMore={hasMore}
                loader={<DataLoading />}
            >
                <div
                    className={`users-wrapper ${
                        !nothingWasFound() && "users-search-top-space"
                    }`}
                >
                    {documents.map(
                        (user, i) =>
                            user.fakeId && (
                                <Link
                                    className="touchable"
                                    key={`user-${i}`}
                                    href={routeToManageUserAsAdmin(user.fakeId)}
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

            {nothingWasFound() && (
                <div className="text center">
                    <h2 className="text | medium center">
                        {searchState.isSearching
                            ? "Lo sentimos, pero no hay usuarios que coincidan con tu criterio de busqueda."
                            : "No hay usuarios registrados en la aplicación."}
                    </h2>
                    {searchState.isSearching && (
                        <span
                            className="text | center medium bold underline touchable"
                            onClick={() => defaultLoading(adminUser)}
                        >
                            <i>Click aquí para cargar todos los usuarios</i>
                        </span>
                    )}
                    <span className="circles-right-bottomv2 green"></span>
                </div>
            )}

            {documents.length > 0 && !hasMore && (
                <i className="text | small light | margin-top-25">
                    Estos son todos los usuarios encontrados.
                    {searchState.isSearching && (
                        <span
                            className="text small"
                            onClick={() => defaultLoading(adminUser)}
                        >
                            {" "}
                            <i className="text small bold underline ">
                                Click aquí para cargar todos los usuarios
                            </i>
                        </span>
                    )}
                </i>
            )}
        </div>
    );
};

export default ListOfAllUsersWithSearcher;
