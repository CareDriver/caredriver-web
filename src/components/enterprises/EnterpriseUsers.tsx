"use client";
import { Enterprise } from "@/interfaces/Enterprise";
import { UserInterface } from "@/interfaces/UserInterface";
import { getUsersByTheirIds } from "@/utils/requests/UserRequester";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DataLoaderIndicator from "../DataLoaderIndicator";
import { DEFAULT_PHOTO } from "@/utils/user/UserData";
import OwnInfiniteScroll from "../OwnInfiniteScroll";

const EnterpriseUsers = ({ enterprise }: { enterprise: Enterprise }) => {
    const AMOUNT_OF_USERS_PER_PAGE = 20;
    const [missingIdUsers, setMissingIdUsers] = useState<string[]>(
        enterprise.addedUsersId || [],
    );
    const [fetchedUsers, setFetchedUsers] = useState<{
        users: UserInterface[];
        hasMore: boolean;
    }>({
        users: [],
        hasMore: true,
    });
    const [loading, setLoading] = useState(false);

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
            console.log("Fetching users:", usersIdToFetch);
            const users = await getUsersByTheirIds(usersIdToFetch);
            setFetchedUsers((prev) => ({
                users: [
                    ...prev.users,
                    ...users.filter((user) => !prev.users.some((u) => u.id === user.id)),
                ],
                hasMore: missingIdUsers.length > 0,
            }));
        } catch (e) {
            toast.error("Error al obtener usuarios, recarga la página por favor");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsersById();
    }, []);

    useEffect(() => {
        console.log("polled:");
        console.log(missingIdUsers);
    }, [missingIdUsers]);

    return (
        <div className="service-form-wrapper">
            <h1 className="text | big bolder">Usuarios agregados al servicio</h1>
            {fetchedUsers.users.length === 0 && !fetchedUsers.hasMore ? (
                <div>Ningún usuario registrado</div>
            ) : (
                <OwnInfiniteScroll
                    fetcher={fetchUsersById}
                    hasMore={fetchedUsers.hasMore}
                    loader={<DataLoaderIndicator />}
                >
                    <div className="users-wrapper">
                        {fetchedUsers.users.map((user) => (
                            <div key={user.id} className="users-item | touchable">
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
                                </div>
                            </div>
                        ))}
                    </div>
                </OwnInfiniteScroll>
            )}
        </div>
    );
};

export default EnterpriseUsers;
