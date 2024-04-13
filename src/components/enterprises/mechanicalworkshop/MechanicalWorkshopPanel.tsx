import Plus from "@/icons/Plus";
import Link from "next/link";
import EnterpriseListForUsers from "../EnterpriseListForUsers";
import "@/styles/components/enterprise.css";

const MechanicalworkshopPanel = () => {
    return (
        <section className="enterprise-main-wrapper">
            <h1 className="text | big bolder">Talleres mecanicos que registraste</h1>
            <Link
                className="general-button icon-wrapper | max-20 less-padding no-full center white-icon"
                href={"/enterprise/workshops/register"}
            >
                <Plus />
                <span className="text | bold">Nuevo Taller</span>
            </Link>
            <EnterpriseListForUsers type="mechanical" />
        </section>
    );
};

export default MechanicalworkshopPanel;
