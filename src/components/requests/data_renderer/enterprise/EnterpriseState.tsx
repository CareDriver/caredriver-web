import TriangleExclamation from "@/icons/TriangleExclamation";
import { Enterprise, EnterpriseTypeRenderPronoun } from "@/interfaces/Enterprise";

const EnterpriseState = ({ enterprise }: { enterprise: Enterprise }) => {
    const deleted = enterprise.type === "tow" ? "eliminada" : "eliminado";
    const disable = enterprise.type === "tow" ? "desabilitada" : "desabilitado";

    return (
        (enterprise.deleted === true || enterprise.active === false) && (
            <h2
                className={`text icon-wrapper | margin-bottom-15 bold ${
                    enterprise.deleted === true ? "red red-icon" : "yellow yellow-icon"
                }`}
            >
                <TriangleExclamation />
                {enterprise.deleted === true
                    ? `${EnterpriseTypeRenderPronoun[enterprise.type]} fue ${deleted}`
                    : `${EnterpriseTypeRenderPronoun[enterprise.type]} fue ${disable}`}
            </h2>
        )
    );
};

export default EnterpriseState;
