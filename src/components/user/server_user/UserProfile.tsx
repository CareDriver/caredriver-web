"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import PageLoader from "../../PageLoader";
import "@/styles/components/profile.css";
import Link from "next/link";
import PenToSquare from "@/icons/PenToSquare";
import LocationDot from "@/icons/LocationDot";
import MoneyBillWave from "@/icons/MoneyBillWave";
import { getGreeting } from "@/utils/contact/Content";
import { sendWhatsapp } from "@/utils/contact/Sender";
import { DEFAULT_PHOTO } from "@/utils/user/UserData";

const UserProfile = () => {
    const { user, loadingUser } = useContext(AuthContext);

    const validToDisable = () => {
        if (!loadingUser && user.data) {
            var valid = false;

            if (!user.data.balance) {
                valid = true;
            }
            if (
                user.data.balance &&
                user.data.balance.amount <= 0
            ) {
                valid = true;
            }

            return valid;
        }
    };

    const sendMessageToPay = () => {
        if (
            user.data &&
            user.data.balance &&
            user.data.balance.amount > 0
        ) {
            const currency = user.data.balance.currency;
            const number = "+59164868951";
            const message = `${getGreeting()}\n\nSoy el usuario servidor ${
                user.data?.fullName
            }, **quiero pagar ${
                user.data.balance.amount
            } ${currency} de mi deuda ${
                user.data.balance.amount
            } ${currency} **. Es decir **${user.data.balance.amount}/${
                user.data.balance.amount
            }**`;

            sendWhatsapp(number, message);
        }
    };

    return loadingUser ? (
        <PageLoader />
    ) : user.data ? (
        <section className="user-page-wrapper | max-height-100">
            <section className="profile-wrapper">
                <img
                    src={user.data.photoUrl.url === "" ? DEFAULT_PHOTO : user.data.photoUrl.url}
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
                    {user.data.balance
                        ? user.data.balance.amount +
                          " " +
                          user.data.balance.currency
                        : "0"}
                </h2>
                <p className="text | gray-dark">
                    {user.data.balance &&
                    user.data.balance.amount > 0
                        ? "Tienes que pagar tu deuda, sino no podras seguir usando nuestra aplicacion para ofrecer tus servicios. Haz click para enviar un mensaje a nuestro administrador para pagar tu deuda."
                        : "Aqui se mostrara la deuda actual que tienes que pagar a medida que usas nuestra aplicacion"}
                </p>
                {
                    <div className="margin-top-15">
                        <button
                            onClick={sendMessageToPay}
                            disabled={validToDisable()}
                            className="small-general-button text | medium bold touchable 
    yellow"
                        >
                            Pagar Deuda
                        </button>
                    </div>
                }
            </section>
            <span className="circles-right-bottomv2 green"></span>
        </section>
    ) : (
        <h2>User not found</h2>
    );
};

export default UserProfile;
