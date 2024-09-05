"use client";
import { Enterprise, UserRoleInEnterprise } from "@/interfaces/Enterprise";
import { UserInterface } from "@/interfaces/UserInterface";
import { getUsersByTheirIds } from "@/components/app_modules/users/api/UserRequester";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import "@/styles/modules/popup.css";
import FormToDeleteUserFromEnterprise from "../request_forms/to_delete/FormToDeleteUserFromEnterprise";
import DataLoading from "@/components/loaders/DataLoading";
import Popup from "@/components/modules/Popup";
import SimpleUserCard from "@/components/app_modules/users/views/cards/SimpleUserCard";
import Link from "next/link";
import {
    routeToServicePerformed,
    routeToServicesServedByUser,
} from "@/utils/route_builders/for_services/RouteBuilderForServices";
import { getIdSaved } from "@/utils/generators/IdGenerator";
import HelmetSafety from "@/icons/HelmetSafety";
import { AuthContext } from "@/context/AuthContext";
import PageLoading from "@/components/loaders/PageLoading";
import { isTheEnterpriseOwner } from "../../validators/validators_of_user_aggregators_to_enterprise/as_members/UserAggregatorValidatorToEnterpriseHelper";

const ListOfUsersOfAEnterprise = ({
    enterprise,
}: {
    enterprise: Enterprise;
}) => {
    const AMOUNT_OF_USERS_PER_PAGE = 20;
    const { checkingUserAuth, user: reviewerUser } = useContext(AuthContext);
    const [missingIdUsers, setMissingIdUsers] = useState<string[]>(
        enterprise.addedUsersId || [],
    );
    const [mapRoles, setMapRoles] = useState(
        new Map<string, UserRoleInEnterprise>(),
    );
    const [fetchedUsers, setFetchedUsers] = useState<{
        users: UserInterface[];
        hasMore: boolean;
    }>({
        users: [],
        hasMore: true,
    });
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserInterface | undefined>(
        undefined,
    );

    const pollMissingUsersId = (): string[] => {
        const usersPolled: string[] = missingIdUsers.slice(
            0,
            AMOUNT_OF_USERS_PER_PAGE,
        );
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
                    users.length + prev.users.length !==
                    enterprise.addedUsersId?.length,
            }));
        } catch (e) {
            toast.error(
                "Error al obtener usuarios, recarga la página por favor",
            );
        } finally {
            setLoading(false);
        }
    };

    const getUserRole = (user: UserInterface): UserRoleInEnterprise => {
        if (user.id) {
            let role = mapRoles.get(user.id);
            return role ? role : "support";
        }

        return "support";
    };

    const fillMapOfRoles = () => {
        if (enterprise.addedUsers) {
            let map = new Map<string, UserRoleInEnterprise>();
            enterprise.addedUsers.map((u) => {
                map.set(u.userId, u.role);
            });
            setMapRoles(map);
        }
    };

    useEffect(() => {
        fillMapOfRoles();
    }, []);

    if (checkingUserAuth || !reviewerUser) {
        return <PageLoading />;
    }

    return (
        <div className="service-form-wrapper">
            <h1 className="text | big bolder">
                Usuarios agregados al servicio
            </h1>
            {fetchedUsers.users.length === 0 && !fetchedUsers.hasMore ? (
                <div>Ningún usuario registrado</div>
            ) : (
                <InfiniteScroll
                    dataLength={fetchedUsers.users.length}
                    next={fetchUsersById}
                    hasMore={fetchedUsers.hasMore}
                    loader={<DataLoading />}
                >
                    <div className="users-wrapper">
                        {fetchedUsers.users.map((user) => (
                            <div
                                key={user.id}
                                onClick={() => setSelectedUser(user)}
                            >
                                <SimpleUserCard user={user} />
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            )}
            {selectedUser !== undefined && (
                <Popup
                    isOpen={selectedUser !== undefined}
                    close={() => setSelectedUser(undefined)}
                >
                    <SimpleUserCard user={selectedUser} />

                    <div className="margin-top-15">
                        <h3 className="icon-wrapper | text bolder">
                            <HelmetSafety />
                            Servicios realizados
                        </h3>
                        <Link
                            className="text underline | "
                            href={routeToServicesServedByUser(
                                enterprise.type,
                                getIdSaved(selectedUser.fakeId),
                            )}
                        >
                            Ir a los servicios del usuario
                        </Link>
                    </div>
                    {isTheEnterpriseOwner(reviewerUser, enterprise) && (
                        <>
                            <div className="margin-top-25">
                                <div className="separator-horizontal"></div>
                            </div>
                            <FormToDeleteUserFromEnterprise
                                selectedUser={{
                                    data: selectedUser,
                                    role: getUserRole(selectedUser),
                                }}
                                enterprise={enterprise}
                            />
                        </>
                    )}
                </Popup>
            )}
        </div>
    );
};

export default ListOfUsersOfAEnterprise;
