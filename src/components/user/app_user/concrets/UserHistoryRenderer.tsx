import CompPermissionValidator from "@/components/permission/component/CompPermissionValidator";
import { UserInterface } from "@/interfaces/UserInterface";
import ServiceReqsByUser from "../ServiceReqsByUser";
import ServiceServedByUser from "../ServiceServedByUser";
import BalanceUser from "../options/BalanceUser";
import MinBalanceUser from "../options/MinBalanceUser";
import DebtHistory from "../DebtHistory";
import { ROLES_TO_VIEW_USERS_HISTORY } from "@/utils/validator/roles/RoleValidator";

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
            )}
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
            <DebtHistory user={userData} />

            <CompPermissionValidator user={userData} roles={ROLES_TO_VIEW_USERS_HISTORY}>
                <>
                    {getServicesServed()}
                    <ServiceReqsByUser user={userData} />
                </>
            </CompPermissionValidator>
        </>
    );
};

export default UserHistoryRenderer;
