import ScrewdriverWrench from "@/icons/ScrewdriverWrench";
import { FieldStringForm } from "../../FormModels";
import { Dispatch, SetStateAction } from "react";
import { isValidMechanicTools } from "@/utils/validator/service_requests/MechanicValidator";

const MechanicTools = ({
    tools,
    setTools,
}: {
    tools: FieldStringForm;
    setTools: Dispatch<SetStateAction<FieldStringForm>>;
}) => {
    return (
        <div className="form-sub-container | margin-top-25 max-width-60">
            <div>
                <h2 className="text icon-wrapper | medium-big bold">
                    <ScrewdriverWrench />
                    Herramientas de trabajo
                </h2>
                <p className="text | light">
                    Por favor menciona las herramientas de trabajo que tienes para
                    trabajar como mecánico
                </p>
            </div>
            <fieldset className="form-section">
                <input
                    type="text"
                    placeholder=""
                    className="form-section-input"
                    value={tools.value}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        const { isValid, message } = isValidMechanicTools(newValue);
                        setTools({
                            value: newValue,
                            message: isValid ? null : message,
                        });
                    }}
                />
                <legend className="form-section-legend">Herramientas</legend>
                {tools.message && <small>{tools.message}</small>}
            </fieldset>{" "}
        </div>
    );
};

export default MechanicTools;
