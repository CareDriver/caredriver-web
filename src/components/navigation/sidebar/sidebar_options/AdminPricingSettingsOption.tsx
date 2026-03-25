import MoneyBillTrendUp from "@/icons/MoneyBillTrendUp";
import Link from "next/link";

const AdminPricingSettingsOption = ({ pathname }: { pathname: string }) => {
  const route = "/admin/settings/pricing";

  return (
    <Link
      href={route}
      className={`sidebar-option ${pathname === route && "selected"}`}
    >
      <MoneyBillTrendUp />
      <span>Precios y Comisiones</span>
    </Link>
  );
};

export default AdminPricingSettingsOption;
