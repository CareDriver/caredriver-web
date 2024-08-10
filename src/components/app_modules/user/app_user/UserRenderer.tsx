"use client";

import PageLoader from "@/components/PageLoader";
import { UserInterface } from "@/interfaces/UserInterface";
import { getUserById } from "@/utils/requests/UserRequester";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import DisableUser from "./options/DisableUser";
import DeleteUser from "./options/DeleteUser";
import "@/styles/components/app-user.css";
import { DEFAULT_PHOTO, getRole } from "@/utils/user/UserData";
import "@/styles/components/debt-user.css";
import { AuthContext } from "@/context/AuthContext";
import CompPermissionValidator from "@/components/permission_handlers/component/CompPermissionValidator";
import {
    checkPermission,
    ROLES_FOR_DELETE_USERS,
    ROLES_FOR_DISABLE_USERS,
    ROLES_FOR_SERVER_USER_ACTIONS,
    ROLES_TO_VIEW_CONTACT_USERS,
    ROLES_TO_VIEW_USER_CREDENTIALS,
} from "@/utils/validator/roles/RoleValidator";
import UserHistoryRenderer from "./concrets/UserHistoryRenderer";
import UserContacts from "./options/UserContacts";
import UserRoleSeter from "./options/UserRoleSeter";
import FieldDeleted from "@/components/requests/data_renderer/form/FieldDeleted";

const UserRenderer = ({ userId }: { userId: string }) => {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState<UserInterface | null>(null);
    const router = useRouter();
    const [formState, setFormState] = useState({
        loading: false,
    });

    const [role, setRole] = useState<{
        value: string;
        isHigher: boolean;
    } | null>(null);

    useEffect(() => {
        getUserById(userId)
            .then((res) => {
                if (res) {
                    setUserData(res);
                    setRole(getRole(res));
                } else {
                    toast.error("Usuario no encontrado");
                    router.push("/admin/users");
                }
            })
            .catch((e) => {
                console.log(e);
                toast.error("Usuario no encontrado");
                router.push("/admin/users");
            });
    }, []);

    return userData ? (
        <section className="render-data-wrapper">
            <div className="user-info-wrapper">
                <img
                    src={
                        userData.photoUrl.url === ""
                            ? DEFAULT_PHOTO
                            : userData.photoUrl.url
                    }
                    alt=""
                    className="user-info-photo"
                />

                <div className="user-info-subwrapper">
                    <h1 className="text | big bolder">{userData.fullName}</h1>
                    <h3 className="text | gray-dark bold">{userData.email}</h3>
                    <CompPermissionValidator
                        user={user.data}
                        roles={ROLES_TO_VIEW_USER_CREDENTIALS}
                    >
                        <>
                            <h3 className="text | gray-dark bold">{userData.location}</h3>
                            <h3 className="text | gray-dark bold margin-bottom-15">
                                {userData.phoneNumber}
                            </h3>
                            {role ? (
                                <h3
                                    className={`text | bolder ${
                                        role.isHigher && "green"
                                    }`}
                                >
                                    {role.value}
                                </h3>
                            ) : (
                                <span className="loader-gray-medium"></span>
                            )}
                        </>
                    </CompPermissionValidator>
                </div>
            </div>

            {userData && userData.deleted === false ? (
                <>
                    {user.data && (
                        <CompPermissionValidator
                            user={user.data}
                            roles={ROLES_TO_VIEW_CONTACT_USERS}
                        >
                            <UserContacts
                                reviewUserName={user.data.fullName}
                                user={userData}
                            />
                        </CompPermissionValidator>
                    )}

                    {user.data &&
                        checkPermission(userData.role, ROLES_FOR_SERVER_USER_ACTIONS) && (
                            <UserHistoryRenderer
                                formState={formState}
                                setFormState={setFormState}
                                reviewUser={user.data}
                                userData={userData}
                            />
                        )}

                    {user.data && (
                        <CompPermissionValidator
                            user={user.data}
                            roles={ROLES_FOR_SERVER_USER_ACTIONS}
                        >
                            <UserRoleSeter
                                user={userData}
                                adminUser={user.data}
                                loading={formState.loading}
                                setLoading={(s: boolean) =>
                                    setFormState({ ...formState, loading: s })
                                }
                            />
                        </CompPermissionValidator>
                    )}
                    {user.data && (
                        <CompPermissionValidator
                            user={user.data}
                            roles={ROLES_FOR_DISABLE_USERS}
                        >
                            <DisableUser
                                setLoading={(loading: boolean) =>
                                    setFormState({ ...formState, loading })
                                }
                                user={userData}
                                adminUser={user.data}
                                loading={formState.loading}
                            />
                        </CompPermissionValidator>
                    )}
                    {user.data && (
                        <CompPermissionValidator
                            user={user.data}
                            roles={ROLES_FOR_DELETE_USERS}
                        >
                            <DeleteUser
                                setLoading={(loading: boolean) =>
                                    setFormState({ ...formState, loading })
                                }
                                user={userData}
                                adminUser={user.data}
                                loading={formState.loading}
                            />
                        </CompPermissionValidator>
                    )}
                </>
            ) : (
                <div className="max-width-60 margin-top-50">
                    <FieldDeleted description="El usuario fue eliminado" />
                </div>
            )}
        </section>
    ) : (
        <PageLoader />
    );
};

export default UserRenderer;
