import Link from "next/link";

const CranesPanel = () => {
    return (
        <section>
            <Link href={"/enterprise/cranes/register"}>Nueva Empresa</Link>
            <div>empresas...</div>
        </section>
    );
};

export default CranesPanel;
