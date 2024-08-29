import ChevronDown from "@/icons/ChevronDown";
import { UserRole, USER_ROLE_TO_SPANISH } from "@/interfaces/UserInterface";
import { RoleFieldSetter } from "../../models/FieldSetters";
import { ChangeEvent } from "react";
interface Props {
    role: UserRole;
    setter: RoleFieldSetter;
    roles?: UserRole[];
}

const USER_ROLES: UserRole[] = [
    UserRole.User,
    UserRole.BalanceRecharge,
    UserRole.Support,
    UserRole.SupportTwo,
    UserRole.Admin,
];

const UserRoleField: React.FC<Props> = ({ role, setter, roles }) => {
    const ROLES_OPTIONS = roles ? roles : USER_ROLES;

    const changeRole = (e: ChangeEvent<HTMLSelectElement>) => {
        let newRole = e.target.value as UserRole;
        setter(newRole);
    };

    return (
        <fieldset className="form-section | select-item">
            <ChevronDown />
            <select
                className="form-section-input"
                onChange={changeRole}
                value={role}
            >
                {ROLES_OPTIONS.map((role, i) => (
                    <option key={`role-option-${i}`} value={role}>
                        {USER_ROLE_TO_SPANISH[role]}
                    </option>
                ))}
            </select>
            <legend className="form-section-legend">Rol del usuario</legend>
        </fieldset>
    );
};

export default UserRoleField;
