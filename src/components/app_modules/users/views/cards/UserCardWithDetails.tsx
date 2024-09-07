import { UserInterface } from "@/interfaces/UserInterface";
import { ROLES_TO_VIEW_USER_STATE } from "@/components/guards/models/PermissionsByUserRole";
import GuardOfModule from "@/components/guards/views/module_guards/GuardOfModule";
import { getUserRoleDetails } from "../../utils/UserRoleGetter";
import UserPhotoRenderer from "../data_renderers/for_user_data/UserPhotoRenderer";
import {
    differenceOnDays,
    timestampDateInSpanish,
} from "@/utils/helpers/DateHelper";

interface Props {
    user: UserInterface;
    reviewerUser?: UserInterface;
}

const UserCardWithDetails: React.FC<Props> = ({ user, reviewerUser }) => {
    const USER_ROLE_DETAILS = getUserRoleDetails(user);
    const IS_DISABLED =
        user.disable ||
        (user.disabledUntil &&
            differenceOnDays(user.disabledUntil.toDate()) > 0);

    return (
        <div className={`users-item ${IS_DISABLED && "users-disable"}`}>
            <UserPhotoRenderer photo={user.photoUrl} />
            <div>
                <h2 className="text | bolder medium-big capitalize">
                    {user.fullName}
                </h2>
                <h4 className="text | light">{user.email}</h4>
                <h4 className="text | light">{user.phoneNumber}</h4>
                <h4 className="text | light margin-bottom-50">
                    {user.services.toString().replaceAll(",", " | ")}
                </h4>
                <GuardOfModule
                    user={reviewerUser}
                    roles={ROLES_TO_VIEW_USER_STATE}
                >
                    <div className="row-wrapper">
                        {IS_DISABLED && (
                            <h4
                                className={`text | bold yellow ${
                                    user.disabledUntil !== undefined &&
                                    "max-width-60"
                                }`}
                            >
                                Deshabilitado{" "}
                                {user.disabledUntil
                                    ? "hasta el ".concat(
                                          timestampDateInSpanish(
                                              user.disabledUntil,
                                          ),
                                      )
                                    : ""}
                            </h4>
                        )}

                        <h4
                            className={`users-item-role text | right bold ${USER_ROLE_DETAILS.color}`}
                        >
                            {USER_ROLE_DETAILS.text}
                        </h4>
                    </div>
                </GuardOfModule>
            </div>
        </div>
    );
};

export default UserCardWithDetails;
