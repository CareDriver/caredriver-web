"use client";

import "@/styles/components/sidebar.css";
import "@/styles/base/reset.css";
import Link from "next/link";
import { UserRole } from "@/interfaces/UserInterface";
import UserTie from "@/icons/UserTie";
import UserRoleSideBar from "../sidebar_sections/UserRoleSideBar";
import LogoutOption from "../sidebar_options/LogoutOption";
import Building from "@/icons/Building";
import FileArrowUp from "@/icons/FileArrowUp";
import FileImage from "@/icons/FileImage";
import Repeat from "@/icons/Repeat";
import SackDollar from "@/icons/SackDollar";
import Bullhorn from "@/icons/Bullhorn";
import MoneyBillTransfer from "@/icons/MoneyBillTransfer";
import Users from "@/icons/Users";
import UserPlus from "@/icons/UserPlus";
import UserIcon from "@/icons/UserIcon";
import Warehouse from "@/icons/Warehouse";
import Wrench from "@/icons/Wrench";

const AdminSideBar = ({
  pathname,
  logout,
}: {
  pathname: string;
  logout: () => void;
}) => {
  return (
    <>
      <UserRoleSideBar role={UserRole.Admin}>
        <UserTie />
      </UserRoleSideBar>

      <span className="text | white medium bold | margin-bottom-15">
        Directorio & SaaS
      </span>
      <li className="sidebar-options margin-bottom-15">
        <Link
          href="/directory/admin"
          className={`sidebar-option ${
            pathname === "/directory/admin" && "selected"
          }`}
        >
          <Warehouse />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/directory/admin/businesses"
          className={`sidebar-option ${
            pathname.startsWith("/directory/admin/businesses") && "selected"
          }`}
        >
          <Building />
          <span>Negocios</span>
        </Link>
        <Link
          href="/directory/admin/requests"
          className={`sidebar-option ${
            pathname.startsWith("/directory/admin/requests") && "selected"
          }`}
        >
          <FileArrowUp />
          <span>Solicitudes</span>
        </Link>
        <Link
          href="/directory/admin/receipts"
          className={`sidebar-option ${
            pathname.startsWith("/directory/admin/receipts") && "selected"
          }`}
        >
          <FileImage />
          <span>Comprobantes</span>
        </Link>
        <Link
          href="/directory/admin/subscriptions"
          className={`sidebar-option ${
            pathname.startsWith("/directory/admin/subscriptions") && "selected"
          }`}
        >
          <Repeat />
          <span>Suscripciones</span>
        </Link>
        <Link
          href="/directory/admin/pricing"
          className={`sidebar-option ${
            pathname.startsWith("/directory/admin/pricing") && "selected"
          }`}
        >
          <SackDollar />
          <span>Precios y Pagos</span>
        </Link>
        <Link
          href="/directory/admin/campaigns"
          className={`sidebar-option ${
            pathname.startsWith("/directory/admin/campaigns") && "selected"
          }`}
        >
          <Bullhorn />
          <span>Campañas</span>
        </Link>
        <Link
          href="/directory/admin/referrals"
          className={`sidebar-option ${
            pathname.startsWith("/directory/admin/referrals") && "selected"
          }`}
        >
          <MoneyBillTransfer />
          <span>Referidos</span>
        </Link>
      </li>

      <div>
        <i className="separator-horizontal green-opacity"></i>
      </div>

      <span className="text | white medium bold | margin-bottom-15">
        Usuarios
      </span>
      <li className="sidebar-options margin-bottom-15">
        <Link
          href="/directory/admin/users"
          className={`sidebar-option ${
            pathname === "/directory/admin/users" && "selected"
          }`}
        >
          <Users />
          <span>Usuarios</span>
        </Link>
        <Link
          href="/admin/users/new"
          className={`sidebar-option ${
            pathname === "/admin/users/new" && "selected"
          }`}
        >
          <UserPlus />
          <span>Crear Usuario</span>
        </Link>
      </li>

      <div>
        <i className="separator-horizontal green-opacity"></i>
      </div>

      <span className="text | white medium bold | margin-bottom-15">
        Perfil
      </span>
      <li className="sidebar-options">
        <Link
          href="/admin/profile"
          className={`sidebar-option ${
            pathname === "/admin/profile" && "selected"
          }`}
        >
          <UserIcon />
          <span>Mi Perfil</span>
        </Link>
        <LogoutOption logout={logout} />
      </li>

      {process.env.NODE_ENV === "development" && (
        <>
          <div>
            <i className="separator-horizontal green-opacity"></i>
          </div>
          <span
            className="text | white medium bold | margin-bottom-15"
            style={{ color: "#07E580" }}
          >
            🛠️ Dev Tools
          </span>
          <li className="sidebar-options">
            <Link
              href="/dev/seed"
              className={`sidebar-option ${
                pathname === "/dev/seed" && "selected"
              }`}
            >
              <Wrench />
              <span>Datos de Prueba</span>
            </Link>
          </li>
        </>
      )}
    </>
  );
};

export default AdminSideBar;
