import { Enterprise } from "@/interfaces/Enterprise";
import { UserInterface } from "@/interfaces/UserInterface";
import { EnterpriseManagementView } from "../../models/EntepriseMangementViews";
import Users from "@/icons/Users";
import {
    getUserRoleForEnterprise,
    UserRoleForEnteprise,
} from "../../models/UserRolesInAEnterprise";
import {
    anyServerUsersInEnterprise,
    anySupportUsersInEnterprise,
} from "../../validators/validators_of_user_aggregators_to_enterprise/as_members/UserAggregatorValidatorToEnterpriseHelper";

interface Props {
    content: {
        user: UserInterface;
        enterprise: Enterprise;
    };
    behavior: {
        loading: boolean;
        setView: (v: EnterpriseManagementView) => void;
    };
}

const EnterpriseUsersPanel: React.FC<Props> = ({ content, behavior }) => {
    const ROLE_IN_ENTERPRISE: UserRoleForEnteprise = getUserRoleForEnterprise(
        content.user,
        content.enterprise,
    );

    return (
        <div
            className={`form-sub-container | margin-top-50 max-width-60 ${
                behavior.loading && "loading-section"
            }`}
            data-state={behavior.loading ? "loading" : "loaded"}
        >
            <h2 className="text icon-wrapper | green green-icon medium-big bold">
                <Users />
                {!content.enterprise.addedUsers ||
                content.enterprise.addedUsers.length === 0
                    ? "ningún usuario agregado"
                    : content.enterprise.addedUsers.length > 1
                    ? `${content.enterprise.addedUsers.length} Usuarios agregados`
                    : "Un usuario agregado"}
            </h2>
            <p>
                {ROLE_IN_ENTERPRISE === UserRoleForEnteprise.OWNER ||
                ROLE_IN_ENTERPRISE === UserRoleForEnteprise.SUPPORT
                    ? "Registra o agrega usuarios a la empresa o agregar usuarios soporte que ayuden a manejar la empresa."
                    : "Puedes ver a los usuarios que trabajan en esta empresa y ver los servicios que realizaron"}
            </p>

            <div className="row-wrapper">
                {(ROLE_IN_ENTERPRISE === UserRoleForEnteprise.OWNER ||
                    ROLE_IN_ENTERPRISE === UserRoleForEnteprise.SUPPORT) && (
                    <button
                        type="button"
                        onClick={() =>
                            behavior.setView(EnterpriseManagementView.ADD_USER)
                        }
                        className={`small-general-button text | bold green touchable ${
                            behavior.loading && "loading-section"
                        }`}
                    >
                        Registrar nuevo usuario
                    </button>
                )}
                {anyServerUsersInEnterprise(content.enterprise) && (
                    <button
                        type="button"
                        onClick={() =>
                            behavior.setView(
                                EnterpriseManagementView.VIEW_SERVER_USERS,
                            )
                        }
                        className={`small-general-button text | bold green touchable ${
                            behavior.loading && "loading-section"
                        }`}
                    >
                        Administrar usuarios servidores
                    </button>
                )}
                {anySupportUsersInEnterprise(content.enterprise) && (
                    <button
                        type="button"
                        onClick={() =>
                            behavior.setView(
                                EnterpriseManagementView.VIEW_SUPPORT_USERS,
                            )
                        }
                        className={`small-general-button text | bold green touchable ${
                            behavior.loading && "loading-section"
                        }`}
                    >
                        Administrar usuarios soporte
                    </button>
                )}
            </div>
        </div>
    );
};

export default EnterpriseUsersPanel;
