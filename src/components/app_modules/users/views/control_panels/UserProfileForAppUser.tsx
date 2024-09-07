"use client";

import { UserInterface } from "@/interfaces/UserInterface";
import { getUserByFakeId } from "@/components/app_modules/users/api/UserRequester";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import FormToDisableUserByAdmin from "../request_forms/to_change_state/FormToDisableUserByAdmin";
import "@/styles/components/app-user.css";
import "@/styles/components/debt-user.css";
import { AuthContext } from "@/context/AuthContext";
import GuardOfModule from "@/components/guards/views/module_guards/GuardOfModule";
import {
    ROLES_FOR_DELETE_USERS,
    ROLES_FOR_DISABLE_USERS,
    ROLES_FOR_SERVER_USER_ACTIONS,
    ROLES_TO_SET_MIN_USER_BALANCE,
    ROLES_TO_SET_USER_BALANCE,
    ROLES_TO_VIEW_CONTACT_USERS,
    ROLES_TO_VIEW_USER_CREDENTIALS,
    ROLES_TO_VIEW_USERS_HISTORY,
} from "@/components/guards/models/PermissionsByUserRole";
import FieldDeleted from "@/components/form/view/field_renderers/FieldDeleted";
import UserPhotoRenderer from "../data_renderers/for_user_data/UserPhotoRenderer";
import PageLoading from "@/components/loaders/PageLoading";
import UserContactsRenderer from "../data_renderers/for_user_data/UserContactsRenderer";
import RedirectorRendererForServicesRequestedByUser from "../data_renderers/for_activity_in_the_app/RedirectorRendererForServicesRequestedByUser";
import ServiceServedByUser from "../data_renderers/for_activity_in_the_app/RedirectorRendererForUserMadeServices";
import FormToChangeUserBalanceByAdmin from "../request_forms/to_manage_balance/FormToChangeUserBalanceByAdmin";
import BalanceHistoryRenderer from "../data_renderers/for_activity_in_the_app/BalanceHistoryRenderer";
import FormToChangeTheMinimumUserBalance from "../request_forms/to_manage_balance/FormToChangeTheMinimumUserBalance";
import FormFoChangeUserRoleToAdmin from "../request_forms/to_change_role/FormFoChangeUserRoleToAdmin";
import FormToDeleteUserByAdmin from "../request_forms/to_change_state/FormToDeleteUserByAdmin";
import { getUserRoleDetails, isUserServer } from "../../utils/UserRoleGetter";
import { routeToAllUsersAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUsersAsAdmin";
import "@/styles/components/users.css";
import { checkPermission } from "@/components/guards/validators/RoleValidator";
import FormToDisableUserByDateByAdmin from "../request_forms/to_change_state/FormToDisableUserByDateByAdmin";
import { timestampDateInSpanish } from "@/utils/helpers/DateHelper";

const UserProfileForAppUser = ({ userId }: { userId: string }) => {
    const router = useRouter();
    const { user: adminUser } = useContext(AuthContext);
    const [user, setUser] = useState<UserInterface | null>(null);
    const [role, setRole] = useState<{
        text: string;
        color: string;
    } | null>(null);

    useEffect(() => {
        getUserByFakeId(userId)
            .then((res) => {
                if (res) {
                    setUser(res);
                    setRole(getUserRoleDetails(res));
                } else {
                    toast.error("Usuario no encontrado");
                    router.push(routeToAllUsersAsAdmin());
                }
            })
            .catch((e) => {
                toast.error("Usuario no encontrado");
                router.push(routeToAllUsersAsAdmin());
            });
    }, []);

    if (!user || !adminUser) {
        return <PageLoading />;
    }

    return (
        <section className="render-data-wrapper">
            <div className="user-info-wrapper">
                <UserPhotoRenderer photo={user.photoUrl} />

                <div className="user-info-subwrapper">
                    <h1 className="text | big bolder capitalize">
                        {user.fullName}
                    </h1>
                    <h3 className="text | medium">{user.email}</h3>
                    <GuardOfModule
                        user={adminUser}
                        roles={ROLES_TO_VIEW_USER_CREDENTIALS}
                    >
                        <>
                            <h3 className="text | medium">{user.location}</h3>
                            <h3 className="text | medium">
                                {user.phoneNumber}
                            </h3>
                            <div className="separator-horizontal"></div>

                            {user.createdAt && (
                                <h3 className="text | medium">
                                    <b className="text | medium bold">
                                        Cuenta creada el{" "}
                                    </b>{" "}
                                    <i>
                                        {timestampDateInSpanish(user.createdAt)}
                                    </i>
                                </h3>
                            )}

                            {role ? (
                                <div>
                                    {isUserServer(user) &&
                                        user.serverUserAt && (
                                            <h4
                                                className={`text | medium ${role.color}`}
                                            >
                                                <b className="text | medium bold">
                                                    Usuario servidor desde el{" "}
                                                </b>{" "}
                                                <i>
                                                    {timestampDateInSpanish(
                                                        user.serverUserAt,
                                                    )}
                                                </i>
                                            </h4>
                                        )}
                                    <h4
                                        className={`text | medium bolder ${role.color}`}
                                    >
                                        {role.text}
                                    </h4>
                                </div>
                            ) : (
                                <span className="loader-gray-medium"></span>
                            )}
                        </>
                    </GuardOfModule>
                </div>
            </div>

            {user.deleted === false ? (
                <>
                    {adminUser && (
                        <GuardOfModule
                            user={adminUser}
                            roles={ROLES_TO_VIEW_CONTACT_USERS}
                        >
                            <UserContactsRenderer
                                email={user.email}
                                phoneNumber={user.phoneNumber}
                            />
                        </GuardOfModule>
                    )}

                    {(!user.role ||
                        checkPermission(
                            user.role,
                            ROLES_FOR_SERVER_USER_ACTIONS,
                        )) && (
                        <>
                            {
                                <GuardOfModule
                                    user={adminUser}
                                    roles={ROLES_TO_SET_USER_BALANCE}
                                >
                                    <>
                                        <FormToChangeUserBalanceByAdmin
                                            user={user}
                                            adminUser={adminUser}
                                        />
                                        <BalanceHistoryRenderer
                                            balanceHistory={user.balanceHistory}
                                        />
                                    </>
                                </GuardOfModule>
                            }

                            <GuardOfModule
                                user={adminUser}
                                roles={ROLES_TO_SET_MIN_USER_BALANCE}
                            >
                                <FormToChangeTheMinimumUserBalance
                                    user={user}
                                />
                            </GuardOfModule>

                            <GuardOfModule
                                user={adminUser}
                                roles={ROLES_TO_VIEW_USERS_HISTORY}
                            >
                                <>
                                    {user && isUserServer(user) && (
                                        <ServiceServedByUser user={user} />
                                    )}
                                    <RedirectorRendererForServicesRequestedByUser
                                        user={user}
                                    />
                                </>
                            </GuardOfModule>
                        </>
                    )}

                    <GuardOfModule
                        user={adminUser}
                        roles={ROLES_FOR_SERVER_USER_ACTIONS}
                    >
                        <FormFoChangeUserRoleToAdmin
                            user={user}
                            adminUser={adminUser}
                        />
                    </GuardOfModule>
                    {
                        <GuardOfModule
                            user={adminUser}
                            roles={ROLES_FOR_DISABLE_USERS}
                        >
                            <FormToDisableUserByAdmin
                                user={user}
                                adminUser={adminUser}
                            />
                            <FormToDisableUserByDateByAdmin
                                user={user}
                                adminUser={adminUser}
                            />
                        </GuardOfModule>
                    }
                    {
                        <GuardOfModule
                            user={adminUser}
                            roles={ROLES_FOR_DELETE_USERS}
                        >
                            <FormToDeleteUserByAdmin
                                user={user}
                                adminUser={adminUser}
                            />
                        </GuardOfModule>
                    }
                </>
            ) : (
                <div className="max-width-60 margin-top-50">
                    <FieldDeleted description="El usuario fue eliminado" />
                </div>
            )}
        </section>
    );
};

export default UserProfileForAppUser;
