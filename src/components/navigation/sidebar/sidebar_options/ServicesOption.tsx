import Taxi from "@/icons/Taxi";
import Link from "next/link";

const ServicesOption = ({ pathname }: { pathname: string }) => {
  const servicesRoute = "/admin/services";

  return (
    <Link
      href={servicesRoute}
      className={`sidebar-option ${pathname === servicesRoute && "selected"}`}
    >
      <Taxi />
      <span>Servicios Activos</span>
    </Link>
  );
};

export default ServicesOption;
