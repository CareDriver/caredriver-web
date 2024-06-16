import Plus from "@/icons/Plus";
import Link from "next/link";
import EnterpriseListForUsers from "../EnterpriseListForUsers";
import "@/styles/components/enterprise.css";

const LaundryPanel = () => {
    return (
        <section className="enterprise-main-wrapper">
            <div>
                <h1 className="text | big bolder">Lavaderos</h1>
                <p className="text | light">Estas son los lavaderos que registraste.</p>
            </div>
            <Link
                className="small-general-button icon-wrapper | max-20 less-padding no-full center white-icon touchable"
                href={"/enterprise/laundry/register"}
            >
                <Plus />
                <span className="text | white bold">Nuevo lavadero</span>
            </Link>
            <EnterpriseListForUsers type="laundry" />
        </section>
    );
};

export default LaundryPanel;
