import ChevronDown from "@/icons/ChevronDown";
import { UserRole, UserRoleRender } from "@/interfaces/UserInterface";
import { RoleFieldSetter } from "../../models/FieldSetters";
import { ChangeEvent } from "react";
interface Props {
    role: UserRole;
    setter: RoleFieldSetter;
}
const UserRoleField: React.FC<Props> = ({ role, setter }) => {
    const VALID_ROLES_TO_REGISTER = [
        UserRole.Support,
        UserRole.SupportTwo,
        UserRole.BalanceRecharge,
    ];

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
                {VALID_ROLES_TO_REGISTER.map((role, i) => (
                    <option key={`role-option-${i}`} value={role}>
                        {UserRoleRender[role]}
                    </option>
                ))}
            </select>
            <legend className="form-section-legend">Rol del usuario</legend>
        </fieldset>
    );
};

export default UserRoleField;
