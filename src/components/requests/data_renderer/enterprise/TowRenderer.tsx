import { Enterprise } from "@/interfaces/Enterprise";
import EnterpriseRenderer from "./EnterpriseRenderer";
import Building from "@/icons/Building";

const TowRenderer = ({ tow }: { tow: Enterprise }) => {
    
    return (
        <div className="form-sub-container | margin-top-25 max-width-90">
            <h2 className="text icon-wrapper | medium-big bold">
                <Building />
                Empresa Operadora de Grua
            </h2>
            <EnterpriseRenderer enterprise={tow} />
        </div>
    );
};

export default TowRenderer;
