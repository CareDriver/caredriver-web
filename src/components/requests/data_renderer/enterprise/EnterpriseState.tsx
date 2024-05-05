import TriangleExclamation from "@/icons/TriangleExclamation";
import { Enterprise } from "@/interfaces/Enterprise";

const EnterpriseState = ({ enterprise }: { enterprise: Enterprise }) => {
    return (
        (enterprise.deleted === true || enterprise.active === false) && (
            <h2
                className={`text icon-wrapper | margin-bottom-15 bold ${
                    enterprise.deleted === true ? "red red-icon" : "yellow yellow-icon"
                }`}
            >
                <TriangleExclamation />
                {enterprise.deleted === true
                    ? `${
                          enterprise.type === "tow"
                              ? "Esta empresa fue eliminada"
                              : "Este taller fue eliminado"
                      }`
                    : `${
                          enterprise.type === "tow"
                              ? "Esta empresa fue desabilitada"
                              : "Este taller fue desabilitado"
                      }`}
            </h2>
        )
    );
};

export default EnterpriseState;
