import Plus from "@/icons/Plus";
import Link from "next/link";
import EnterpriseListForUsers from "../EnterpriseListForUsers";
import "@/styles/components/enterprise.css";

const MechanicalworkshopPanel = () => {
    return (
        <section className="enterprise-main-wrapper">
            <div>
                <h1 className="text | big bolder">Talleres mecanicos</h1>
                <p className="text | light">
                    Estas son los talleres mecanicos que registraste.
                </p>
            </div>
            <Link
                className="small-general-button icon-wrapper | max-20 less-padding no-full center white-icon touchable"
                href={"/enterprise/workshops/register"}
            >
                <Plus />
                <span className="text | white bold">Nuevo Taller</span>
            </Link>
            <EnterpriseListForUsers type="mechanical" />
        </section>
    );
};

export default MechanicalworkshopPanel;
