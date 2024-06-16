"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import PageLoader from "../../PageLoader";
import "@/styles/components/profile.css";
import Link from "next/link";
import PenToSquare from "@/icons/PenToSquare";
import LocationDot from "@/icons/LocationDot";
import MoneyBillWave from "@/icons/MoneyBillWave";
import { getGreeting } from "@/utils/contact/Content";
import { sendWhatsapp } from "@/utils/contact/Sender";
import { DEFAULT_PHOTO } from "@/utils/user/UserData";
import { PHONE_BUSINESS } from "@/database/Business";
import Bullhorn from "@/icons/Bullhorn";
import { differenceOnDays } from "@/utils/parser/ForDate";

const UserProfile = () => {
    const { user, loadingUser } = useContext(AuthContext);

    const sendMessageToPay = () => {
        if (user.data) {
            const message = `${getGreeting()}\n\nSoy el usuario servidor ${
                user.data?.fullName
            }, **quiero recargar saldo por favor**`;

            sendWhatsapp(PHONE_BUSINESS, message);
        }
    };

    return loadingUser ? (
        <PageLoader />
    ) : user.data ? (
        <section className="user-page-wrapper">
            <section className="profile-wrapper">
                <img
                    src={
                        user.data.photoUrl.url === ""
                            ? DEFAULT_PHOTO
                            : user.data.photoUrl.url
                    }
                    className="profile-photo"
                    alt=""
                />
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

            <div className="row-wrapper | top-align gap-20 | margin-top-50 margin-bottom-25 max-width-80">
                <section className="profile-info-wrapper | fit-width row-wrapper-item">
                    <h2 className="profile-subtitle icon-wrapper">
                        <LocationDot />
                        Mi ubicacion
                    </h2>
                    <span className="location-field">{user.data.location}</span>
                    <div className="margin-top-5">
                        <Link
                            className="icon-wrapper small-general-button text | gray gray-icon bolder touchable"
                            href="/user/update/location"
                        >
                            <PenToSquare />
                            Cambiar mi ubicacion
                        </Link>
                    </div>
                </section>
                {user.data.branding &&
                    (differenceOnDays(user.data.branding.dateLimit.toDate()) > 0 ? (
                        <section className="profile-info-wrapper | fit-width row-wrapper-item">
                            <h2 className="profile-subtitle icon-wrapper">
                                <Bullhorn />
                                Branding
                            </h2>
                            <span className="location-field">
                                Valido hasta el{" "}
                                {
                                    user.data.branding.dateLimit
                                        .toDate()
                                        .toISOString()
                                        .split("T")[0]
                                }
                            </span>
                        </section>
                    ) : (
                        <section className="profile-info-wrapper | row-wrapper-item">
                            <h2 className="profile-subtitle icon-wrapper">
                                <Bullhorn />
                                Branding
                            </h2>
                            <span className="location-field | red">
                                Expiro tu fecha limite!
                            </span>
                        </section>
                    ))}
            </div>

            <i className="separator-horizontal | max-width-80"></i>

            <section className="profile-info-wrapper | margin-top-25 max-width-60">
                <h2 className="profile-subtitle icon-wrapper">
                    <MoneyBillWave />
                    Saldo |{" "}
                    {user.data.balance
                        ? user.data.balance.amount + " " + user.data.balance.currency
                        : "0"}
                </h2>
                <p className="text | gray-dark">
                    {user.data.balance &&
                    user.data.balance.amount <= user.data.minimumBalance.amount
                        ? "Tienes que recargar tu salso, sino no podras seguir usando nuestra aplicacion para ofrecer tus servicios. Haz click para enviar un mensaje a nuestro administrador para recargar saldo."
                        : `Recarga saldo cuando lo nececites, tu saldo minimo no puede ser menos de ${user.data.minimumBalance.amount
                              .toString()
                              .replace("-", "")} ${user.data.minimumBalance.currency}`}
                </p>
                {
                    <div className="margin-top-5">
                        <button
                            type="button"
                            onClick={sendMessageToPay}
                            className="small-general-button text | medium bold touchable 
    yellow"
                        >
                            Recargar saldo
                        </button>
                    </div>
                }
            </section>
            <span className="circles-right-bottomv2 green"></span>
        </section>
    ) : (
        <h2>Usuario no encontrado</h2>
    );
};

export default UserProfile;
