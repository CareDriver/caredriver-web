import TriangleExclamation from "@/icons/TriangleExclamation";
import { EnterpriseData } from "@/interfaces/Enterprise";
import { ENTERPRISE_TO_SPANISH_WITH_DEFINITE_ARTICLE } from "../../utils/EnterpriseSpanishTranslator";

const EnterpriseStatus = ({ enterprise }: { enterprise: EnterpriseData }) => {
  const DELETED_MESSAGE = enterprise.type === "tow" ? "eliminada" : "eliminado";
  const DISABLE_MESSAGE =
    enterprise.type === "tow" ? "deshabilitada" : "deshabilitado";

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
              ENTERPRISE_TO_SPANISH_WITH_DEFINITE_ARTICLE[enterprise.type]
            } fue ${DELETED_MESSAGE}`
          : `${
              ENTERPRISE_TO_SPANISH_WITH_DEFINITE_ARTICLE[enterprise.type]
            } fue ${DISABLE_MESSAGE}`}
      </h2>
    )
  );
};

export default EnterpriseStatus;
