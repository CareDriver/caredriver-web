import { Enterprise } from "@/interfaces/Enterprise";
import EnterpriseRenderer from "./EnterpriseRenderer";
import Building from "@/icons/Building";
import FieldDeleted from "../form/FieldDeleted";

const TowRenderer = ({ tow }: { tow: Enterprise | undefined }) => {
    return (
        <div className="form-sub-container | margin-top-25">
            <h2 className="text icon-wrapper | medium-big bold">
                <Building />
                Empresa Operadora de Grua
            </h2>
            {tow ? (
                <EnterpriseRenderer enterprise={tow} />
            ) : (
                <FieldDeleted description="No se selecciono la empresa de grua" />
            )}
        </div>
    );
};

export default TowRenderer;
