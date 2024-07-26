import Plus from "@/icons/Plus";
import Link from "next/link";
import EnterpriseListForUsers from "../EnterpriseListForUsers";
import "@/styles/components/enterprise.css";

const DriverEnterprisePanel = () => {
    return (
        <section className="enterprise-main-wrapper">
            <div>
                <h1 className="text | big bolder">Empresas de Choferes</h1>
                <p className="text | light">Estas son las empresas de Choferes que registraste.</p>
            </div>
            <Link
                className="small-general-button icon-wrapper | max-20 less-padding no-full center white-icon touchable"
                href={"/enterprise/driver/register"}
            >
                <Plus />
                <span className="text | white bold">Nueva Empresa de Choferes</span>
            </Link>
            <EnterpriseListForUsers type="driver" />
        </section>
    );
};

export default DriverEnterprisePanel;
