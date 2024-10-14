import { UserInterface } from "@/interfaces/UserInterface";
import { ROLES_TO_VIEW_USER_STATE } from "@/components/guards/models/PermissionsByUserRole";
import GuardOfModule from "@/components/guards/views/module_guards/GuardOfModule";
import { getUserRoleDetails } from "../../utils/UserRoleGetter";
import UserPhotoRenderer from "../data_renderers/for_user_data/UserPhotoRenderer";
import {
    differenceOnDays,
    timestampDateInSpanish,
} from "@/utils/helpers/DateHelper";
import TriangleExclamation from "@/icons/TriangleExclamation";
import {
    cutTextWithDotsByLength,
    MAX_LENGTH_FOR_NAMES_DISPLAY,
} from "@/utils/text_helpers/TextCutter";

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
            <div className="full-width">
                <h2 className="text | bolder medium-big capitalize wrap">
                    {cutTextWithDotsByLength(
                        user.fullName,
                        MAX_LENGTH_FOR_NAMES_DISPLAY,
                    )}
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
                    <div className="column-wrapper column-left gap-0 full-width">
                        <h4
                            className={`text | right bold ${USER_ROLE_DETAILS.color}`}
                        >
                            {USER_ROLE_DETAILS.text}
                        </h4>
                        {IS_DISABLED && (
                            <h4 className={`text | bolder`}>
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
                        {user.deleted && (
                            <h4 className="text | bold red small | icon-wrapper red-icon llb">
                                <TriangleExclamation />
                                Cuenta eliminada
                            </h4>
                        )}
                    </div>
                </GuardOfModule>
            </div>
        </div>
    );
};

export default UserCardWithDetails;
