"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import PageLoader from "../PageLoader";
import "@/styles/components/profile.css";
import Link from "next/link";
import PenToSquare from "@/icons/PenToSquare";
import LocationDot from "@/icons/LocationDot";
import MoneyBillWave from "@/icons/MoneyBillWave";

const UserProfile = () => {
    const { user, loadingUser } = useContext(AuthContext);

    const validToDisable = () => {
        if (!loadingUser && user.data) {
            var valid = false;

            if (!user.data.currentDebtWithTheApp) {
                valid = true;
            }
            if (
                user.data.currentDebtWithTheApp &&
                user.data.currentDebtWithTheApp.amount <= 0
            ) {
                valid = true;
            }

            return valid;
        }
    };

    return loadingUser ? (
        <PageLoader />
    ) : user.data ? (
        <section className="user-page-wrapper">
            <section className="profile-wrapper">
                <img src={user.data.photoUrl} className="profile-photo" alt="" />
                <div className="profile-info-wrapper">
                    <h1 className="profile-fullname">{user.data.fullName}</h1>
                    <h2 className="profile-email">{user.data.email}</h2>
                </div>
            </section>

            <section className="margin-top-50">
                <Link
                    className="icon-wrapper small-general-button text | gray gray-icon bolder touchable"
                    href="/user/update/photo"
                >
                    <PenToSquare />
                    Cambiar mi foto
                </Link>
            </section>

            <section className="profile-info-wrapper | margin-top-50 margin-bottom-25 max-width-50">
                <h2 className="profile-subtitle icon-wrapper">
                    <LocationDot />
                    Mi ubicacion
                </h2>
                <span className="location-field">{user.data.location}</span>
                <div className="margin-top-15">
                    <Link
                        className="icon-wrapper small-general-button text | gray gray-icon bolder touchable"
                        href="/user/update/location"
                    >
                        <PenToSquare />
                        Cambiar mi ubicacion
                    </Link>
                </div>
            </section>

            <i className="separator-horizontal | max-width-80"></i>

            <section className="profile-info-wrapper | margin-top-25 max-width-60">
                <h2 className="profile-subtitle icon-wrapper">
                    <MoneyBillWave />
                    Deuda |{" "}
                    {user.data.currentDebtWithTheApp
                        ? user.data.currentDebtWithTheApp.amount +
                          " " +
                          user.data.currentDebtWithTheApp.currency
                        : "0"}
                </h2>
                <p className="text | gray-dark">
                    {user.data.currentDebtWithTheApp &&
                    user.data.currentDebtWithTheApp.amount > 0
                        ? "Tienes que pagar tu deuda, sino no podras seguir usando nuestra aplicacion para ofrecer tus servicios."
                        : "Aqui se mostrara la deuda actual que tienes que pagar a medida que usas nuestra aplicacion"}
                </p>
                {
                    <div className="margin-top-15">
                        <button
                            disabled={validToDisable()}
                            className="small-general-button text | medium bold touchable 
    yellow"
                        >
                            Pagar Deuda
                        </button>
                    </div>
                }
            </section>
        </section>
    ) : (
        <h2>User not found</h2>
    );
};

export default UserProfile;
