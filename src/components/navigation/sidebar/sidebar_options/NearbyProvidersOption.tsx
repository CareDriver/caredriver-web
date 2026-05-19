import PersonCircleCheck from "@/icons/PersonCircleCheck";
import Link from "next/link";

const NearbyProvidersOption = ({ pathname }: { pathname: string }) => {
  const route = "/admin/providers/nearby";
  return (
    <Link
      href={route}
      className={`sidebar-option ${pathname.startsWith(route) ? "selected" : ""}`}
    >
      <PersonCircleCheck />
      <span>Proveedores Cercanos</span>
    </Link>
  );
};

export default NearbyProvidersOption;
