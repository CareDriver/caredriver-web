"use client";
import { Enterprise, UserRoleEnterpriseRender } from "@/interfaces/Enterprise";
import { UserInterface } from "@/interfaces/UserInterface";
import { getUsersByTheirIds } from "@/utils/requests/UserRequester";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DataLoaderIndicator from "../DataLoaderIndicator";
import { DEFAULT_PHOTO } from "@/utils/user/UserData";
import InfiniteScroll from "react-infinite-scroll-component";
import Popup from "../form/Popup";
import "@/styles/modules/popup.css";
import TriangleExclamation from "@/icons/TriangleExclamation";
import DeleteUserFromService from "./DeleteUserFromService";

const EnterpriseUsers = ({ enterprise }: { enterprise: Enterprise }) => {
    const AMOUNT_OF_USERS_PER_PAGE = 20;
    const [missingIdUsers, setMissingIdUsers] = useState<string[]>(
        enterprise.addedUsersId || [],
    );
    const [mapRoles, setMapRoles] = useState(new Map<string, "user" | "support">());
    const [fetchedUsers, setFetchedUsers] = useState<{
        users: UserInterface[];
        hasMore: boolean;
    }>({
        users: [],
        hasMore: true,
    });
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);

    const pollMissingUsersId = (): string[] => {
        const usersPolled: string[] = missingIdUsers.slice(0, AMOUNT_OF_USERS_PER_PAGE);
        setMissingIdUsers((prev) => prev.slice(AMOUNT_OF_USERS_PER_PAGE));
        return usersPolled;
    };

    const fetchUsersById = async (): Promise<void> => {
        if (loading) return;

        const usersIdToFetch = pollMissingUsersId();
        if (usersIdToFetch.length === 0) {
            setFetchedUsers((prev) => ({
                ...prev,
                hasMore: false,
            }));
            return;
        }

        setLoading(true);
        try {
            const users = await getUsersByTheirIds(usersIdToFetch);
            setFetchedUsers((prev) => ({
                users: [...prev.users, ...users],
                hasMore:
                    users.length + prev.users.length !== enterprise.addedUsersId?.length,
            }));
        } catch (e) {
            toast.error("Error al obtener usuarios, recarga la página por favor");
        } finally {
            setLoading(false);
        }
    };

    const getUserRole = (user: UserInterface): "user" | "support" => {
        if (user.id) {
            let role = mapRoles.get(user.id);
            return role ? role : "support";
        }

        return "support";
    };

    const fillMapOfRoles = () => {
        if (enterprise.addedUsers) {
            let map = new Map<string, "user" | "support">();
            enterprise.addedUsers.map((u) => {
                map.set(u.userId, u.role);
            });
            setMapRoles(map);
        }
    };

    useEffect(() => {
        fillMapOfRoles();
    }, []);

    return (
        <div className="service-form-wrapper">
            <h1 className="text | big bolder">Usuarios agregados al servicio</h1>
            {fetchedUsers.users.length === 0 && !fetchedUsers.hasMore ? (
                <div>Ningún usuario registrado</div>
            ) : (
                <InfiniteScroll
                    dataLength={fetchedUsers.users.length}
                    next={fetchUsersById}
                    hasMore={fetchedUsers.hasMore}
                    loader={<DataLoaderIndicator />}
                >
                    <div className="users-wrapper">
                        {fetchedUsers.users.map((user) => (
                            <div
                                key={user.id}
                                className="users-item | touchable"
                                onClick={() => setSelectedUser(user)}
                            >
                                <img
                                    src={user.photoUrl.url || DEFAULT_PHOTO}
                                    alt=""
                                    className="users-item-photo"
                                />
                                <div>
                                    <h2 className="text | bolder medium-big capitalize">
                                        {user.fullName}
                                    </h2>
                                    <h4 className="text | light">{user.email}</h4>
                                    <h4 className="text | light">{user.phoneNumber}</h4>
                                    <div className="separator-horizontal"></div>
                                    <h4 className="text">
                                        {UserRoleEnterpriseRender[getUserRole(user)]}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            )}
            {selectedUser && (
                <DeleteUserFromService
                    userRole={getUserRole(selectedUser)}
                    cancel={() => setSelectedUser(null)}
                    enterprise={enterprise}
                    userToDelete={selectedUser}
                />
            )}
        </div>
    );
};

export default EnterpriseUsers;
