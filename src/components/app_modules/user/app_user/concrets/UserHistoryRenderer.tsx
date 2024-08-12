import CompPermissionValidator from "@/components/permission_handlers/views/component/CompPermissionValidator";
import { UserInterface } from "@/interfaces/UserInterface";
import ServiceReqsByUser from "../ServiceReqsByUser";
import ServiceServedByUser from "../ServiceServedByUser";
import BalanceUser from "../options/BalanceUser";
import MinBalanceUser from "../options/MinBalanceUser";
import DebtHistory from "../DebtHistory";
import {
    ROLES_TO_SET_MIN_USER_BALANCE,
    ROLES_TO_SET_USER_BALANCE,
    ROLES_TO_VIEW_USERS_HISTORY,
} from "@/components/permission_handlers/models/PermissionsByUserRole";

const UserHistoryRenderer = ({
    reviewUser,
    userData,
    formState,
    setFormState,
}: {
    reviewUser: UserInterface;
    userData: UserInterface;
    formState: {
        loading: boolean;
    };
    setFormState: (state: { loading: boolean }) => void;
}) => {
    const getServicesServed = () => {
        if (userData && userData.services.length > 1) {
            return <ServiceServedByUser user={userData} />;
        }
    };

    return (
        <>
            {reviewUser && (
                <CompPermissionValidator
                    user={reviewUser}
                    roles={ROLES_TO_SET_USER_BALANCE}
                >
                    <>
                        <BalanceUser
                            loading={formState.loading}
                            setLoading={(loading: boolean) =>
                                setFormState({
                                    ...formState,
                                    loading: loading,
                                })
                            }
                            user={userData}
                            adminUser={reviewUser}
                        />
                        <DebtHistory user={userData} />
                    </>
                </CompPermissionValidator>
            )}

            <CompPermissionValidator
                user={reviewUser}
                roles={ROLES_TO_SET_MIN_USER_BALANCE}
            >
                <MinBalanceUser
                    user={userData}
                    loading={formState.loading}
                    setLoading={(loading: boolean) =>
                        setFormState({
                            ...formState,
                            loading: loading,
                        })
                    }
                />
            </CompPermissionValidator>

            <CompPermissionValidator
                user={reviewUser}
                roles={ROLES_TO_VIEW_USERS_HISTORY}
            >
                <>
                    {getServicesServed()}
                    <ServiceReqsByUser user={reviewUser} />
                </>
            </CompPermissionValidator>
        </>
    );
};

export default UserHistoryRenderer;
