"use client";

import "@/styles/components/sidebar.css";
import "@/styles/base/reset.css";
import Link from "next/link";
import Building from "@/icons/Building";
import Warehouse from "@/icons/Warehouse";
import Wrench from "@/icons/Wrench";
import Bullhorn from "@/icons/Bullhorn";
import Users from "@/icons/Users";
import SackDollar from "@/icons/SackDollar";
import UserIcon from "@/icons/UserIcon";
import LocationDot from "@/icons/LocationDot";
import Phone from "@/icons/Phone";
import Camera from "@/icons/Camera";
import LogoutOption from "../sidebar_options/LogoutOption";
import { UserInterface } from "@/interfaces/UserInterface";
import UserRoleSideBar from "../sidebar_sections/UserRoleSideBar";
import UserGear from "@/icons/UserGear";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import Plus from "@/icons/Plus";
import MessageIcon from "@/icons/Envelope";
import Store from "@/icons/Store";

const ServerUserSideBar = ({
  pathname,
  logout,
  user,
}: {
  pathname: string;
  logout: () => void;
  user: UserInterface;
}) => {
  const { userProps } = useContext(AuthContext);

  return (
    <>
      <UserRoleSideBar customRole={"Panel de Taller"}>
        <UserGear />
      </UserRoleSideBar>

      <span className="text | white medium bold | margin-bottom-15">
        Mi Negocio
      </span>
      <li className="sidebar-options margin-bottom-15">
        <Link
          href="/directory/business"
          className={`sidebar-option ${
            pathname === "/directory/business" && "selected"
          }`}
        >
          <Warehouse />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/directory/business/orders"
          className={`sidebar-option ${
            pathname.startsWith("/directory/business/orders") && "selected"
          }`}
        >
          <Wrench />
          <span>Órdenes</span>
        </Link>
        <Link
          href="/directory/business/contacts"
          className={`sidebar-option ${
            pathname.startsWith("/directory/business/contacts") && "selected"
          }`}
        >
          <MessageIcon />
          <span>Contactos</span>
        </Link>
        <Link
          href="/directory/business/offers"
          className={`sidebar-option ${
            pathname.startsWith("/directory/business/offers") && "selected"
          }`}
        >
          <Bullhorn />
          <span>Ofertas</span>
        </Link>
        <Link
          href="/directory/business/profile"
          className={`sidebar-option ${
            pathname.startsWith("/directory/business/profile") && "selected"
          }`}
        >
          <Building />
          <span>Ficha de Negocio</span>
        </Link>
        <Link
          href="/directory/business/team"
          className={`sidebar-option ${
            pathname.startsWith("/directory/business/team") && "selected"
          }`}
        >
          <Users />
          <span>Equipo</span>
        </Link>
        <Link
          href="/directory/business/subscription"
          className={`sidebar-option ${
            pathname.startsWith("/directory/business/subscription") &&
            "selected"
          }`}
        >
          <SackDollar />
          <span>Mi Plan</span>
        </Link>
      </li>

      <div>
        <i className="separator-horizontal green-opacity"></i>
      </div>

      <span className="text | white medium bold | margin-bottom-15">
        Registro
      </span>
      <li className="sidebar-options margin-bottom-15">
        <Link
          href="/directory/register"
          className={`sidebar-option ${
            pathname === "/directory/register" && "selected"
          }`}
        >
          <Store />
          <span>Registrar Negocio</span>
        </Link>
      </li>

      <div>
        <i className="separator-horizontal green-opacity"></i>
      </div>

      <span className="text | white medium bold | margin-bottom-15">
        Mi Cuenta
      </span>
      <li className="sidebar-options">
        <Link
          href="/user/profile"
          className={`sidebar-option ${
            pathname === "/user/profile" && "selected"
          }`}
        >
          <UserIcon />
          <span>Mi Perfil</span>
        </Link>

        {!userProps?.hasPhone && (
          <Link
            href="/user/profile/renew/phone"
            className={`sidebar-option ${
              pathname === "/user/profile/renew/phone" && "selected"
            }`}
          >
            <Phone />
            <span>Agregar Teléfono</span>
          </Link>
        )}
        <Link
          href="/user/profile/renew/profilepicture"
          className={`sidebar-option ${
            pathname === "/user/profile/renew/profilepicture" && "selected"
          }`}
        >
          <Camera />
          <span>Foto de Perfil</span>
        </Link>
        <Link
          href="/user/profile/renew/location"
          className={`sidebar-option ${
            pathname === "/user/profile/renew/location" && "selected"
          }`}
        >
          <LocationDot />
          <span>Ubicación</span>
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

export default ServerUserSideBar;
