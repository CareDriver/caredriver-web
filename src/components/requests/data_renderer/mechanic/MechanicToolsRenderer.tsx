import ScrewdriverWrench from "@/icons/ScrewdriverWrench";
import InputData from "../form/InputData";
import FieldDeleted from "../form/FieldDeleted";

const MechanicToolsRenderer = ({ tools }: { tools: string | undefined }) => {
    return (
        <div className="form-sub-container | margin-top-25">
            <h2 className="text icon-wrapper | medium-big bold">
                <ScrewdriverWrench />
                Herramientas de trabajo
            </h2>
            {tools ? (
                <fieldset className="form-section">
                    <InputData content={tools} placeholder="Herramientas" />
                    <legend className="form-section-legend">Herramientas</legend>
                </fieldset>
            ) : (
                <FieldDeleted
                    description={
                        "El usuario que solicito ser mecánico no especifico sus herramientas de trabajo"
                    }
                />
            )}
        </div>
    );
};

export default MechanicToolsRenderer;
