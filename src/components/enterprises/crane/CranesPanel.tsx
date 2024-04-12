
import Link from "next/link";
import EnterpriseList from "./EnterpriseList";

const CranesPanel = () => {
    return (
        <section>
            <Link href={"/enterprise/cranes/register"}>Nueva Empresa</Link>
            <EnterpriseList />
        </section>
    );
};

export default CranesPanel;
