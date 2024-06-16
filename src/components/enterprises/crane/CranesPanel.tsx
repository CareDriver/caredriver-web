import Link from "next/link";
import EnterpriseListForUsers from "../EnterpriseListForUsers";
import Plus from "@/icons/Plus";
import "@/styles/components/enterprise.css";

const CranesPanel = () => {
    return (
        <section className="enterprise-main-wrapper">
            <div>
                <h1 className="text | big bolder">Empresas Operadoras de Gruas</h1>
                <p className="text | light">
                    Estas son las empresas operadoras de gruas que registraste.
                </p>
            </div>
            <Link
                className="small-general-button icon-wrapper | max-20 less-padding no-full center white-icon touchable"
                href={"/enterprise/cranes/register"}
            >
                <Plus />
                <span className="text | white bold">Nueva Empresa</span>
            </Link>
            <EnterpriseListForUsers type="tow" />
        </section>
    );
};

export default CranesPanel;
