import { isValidChangeReason } from "@/utils/validator/debt/DebtValidator";
import { Dispatch, SetStateAction } from "react";

export interface ActionUserForm {
    reason: {
        value: string;
        message: string | null;
    };
}

const ActionUserSetterForm = ({
    actionUser,
    setActionUser,
    loading,
}: {
    actionUser: ActionUserForm;
    setActionUser: Dispatch<SetStateAction<ActionUserForm>>;
    loading: boolean;
}) => {
    return (
        <div className="margin-bottom-25">
            <div className="margin-bottom-25">
                <h2 className="text | big-medium bolder">Razón de cambio</h2>
                <p className="text | light">
                    Escribe la razón por la cual estas haciendo este cambio en el usuario,
                    recuerda que esta acción sera registrada.
                </p>
            </div>

            <fieldset
                className="form-section"
                data-state={loading ? "loading" : "loaded"}
            >
                <input
                    type="text"
                    placeholder=""
                    className="form-section-input"
                    name="fullname"
                    value={actionUser.reason.value}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        const { isValid, message } = isValidChangeReason(newValue);
                        setActionUser({
                            ...actionUser,
                            reason: {
                                value: newValue,
                                message: isValid ? null : message,
                            },
                        });
                    }}
                />
                <legend className="form-section-legend">Razón de la acción</legend>
                {actionUser.reason.message && <small>{actionUser.reason.message}</small>}
            </fieldset>
        </div>
    );
};

export default ActionUserSetterForm;
