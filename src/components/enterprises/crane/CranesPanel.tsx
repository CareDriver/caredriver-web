import Link from "next/link";
import EnterpriseListForUsers from "../EnterpriseListForUsers";
import Plus from "@/icons/Plus";
import "@/styles/components/enterprise.css";

const CranesPanel = () => {
    return (
        <section className="enterprise-main-wrapper">
            <h1 className="text | big bolder">
                Empresas Operadoras de Gruas que registraste
            </h1>
            <Link
                className="general-button icon-wrapper | max-20 less-padding no-full center white-icon touchable"
                href={"/enterprise/cranes/register"}
            >
                <Plus />
                <span className="text | bold">Nueva Empresa</span>
            </Link>
            <EnterpriseListForUsers type="tow" />
        </section>
    );
};

export default CranesPanel;
