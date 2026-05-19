import LocationDot from "@/icons/LocationDot";
import Link from "next/link";

const ProviderMapOption = ({ pathname }: { pathname: string }) => {
  const route = "/admin/providers/map";
  return (
    <Link
      href={route}
      className={`sidebar-option ${pathname.startsWith(route) ? "selected" : ""}`}
    >
      <LocationDot />
      <span>Mapa de Proveedores</span>
    </Link>
  );
};

export default ProviderMapOption;
