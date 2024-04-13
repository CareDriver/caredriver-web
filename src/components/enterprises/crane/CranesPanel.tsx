import Link from "next/link";
import EnterpriseListForUsers from "../EnterpriseListForUsers";

const CranesPanel = () => {
    return (
        <section>
            <Link href={"/enterprise/cranes/register"}>Nueva Empresa</Link>
            <EnterpriseListForUsers type="tow" />
        </section>
    );
};

export default CranesPanel;
