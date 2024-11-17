"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import "@/styles/components/profile.css";
import Link from "next/link";
import PenToSquare from "@/icons/PenToSquare";
import LocationDot from "@/icons/LocationDot";
import PageLoading from "@/components/loaders/PageLoading";
import UserPhotoRenderer from "../data_renderers/for_user_data/UserPhotoRenderer";
import FormToRequestBalanceRecharge from "../request_forms/to_manage_balance/FormToRequestBalanceRecharge";
import {
    routeToRenewLocationAsUser,
    routeToRenewPhotoAsUser,
} from "@/utils/route_builders/as_user/RouteBuilderForProfileAsUser";
import "@/styles/components/users.css";
import { isNullOrEmptyText } from "@/validators/TextValidator";
import FieldDeleted from "@/components/form/view/field_renderers/FieldDeleted";
import BalanceHistoryRenderer from "../data_renderers/for_activity_in_the_app/BalanceHistoryRenderer";
import "@/styles/components/debt-user.css";

const UserProfileForServerUser = () => {
    const { user, checkingUserAuth, userProps } = useContext(AuthContext);

    if (checkingUserAuth) {
        return <PageLoading />;
    }

    console.log(userProps);

    return (
        user && (
            <section className="user-page-wrapper">
                <section className="profile-wrapper">
                    <UserPhotoRenderer photo={user.photoUrl} />
                    <div className="profile-info-wrapper">
                        <h1 className="profile-fullname">{user.fullName}</h1>
                        {user.email && (
                            <h2 className="profile-email">{user.email}</h2>
                        )}
                        {!isNullOrEmptyText(user.phoneNumber) && (
                            <h2 className="profile-email">
                                {user.phoneNumber}
                            </h2>
                        )}
                    </div>
                </section>

                <section className="margin-top-50">
                    <Link
                        className="icon-wrapper small-general-button text | gray gray-icon bold touchable"
                        href={routeToRenewPhotoAsUser()}
                    >
                        <PenToSquare />
                        Cambiar mi foto
                    </Link>
                </section>

                <section className="profile-info-wrapper | max-width-60 margin-top-25 margin-bottom-25">
                    <h2 className="profile-subtitle icon-wrapper">
                        <LocationDot />
                        Mi Ubicación
                    </h2>
                    {userProps.hasLocation ? (
                        <span className="location-field">{user.location}</span>
                    ) : (
                        <FieldDeleted description={"Sin Ubicación"} />
                    )}
                    <div className="margin-top-5">
                        <Link
                            className="icon-wrapper small-general-button text | gray gray-icon bold touchable"
                            href={routeToRenewLocationAsUser()}
                        >
                            <PenToSquare />
                            {userProps.hasLocation
                                ? "Cambiar mi ubicación"
                                : "Agregar ubicación"}
                        </Link>
                    </div>
                </section>

                <i className="separator-horizontal | max-width-60"></i>

                <FormToRequestBalanceRecharge user={user} />
                <BalanceHistoryRenderer balanceHistory={user.balanceHistory}/>
            </section>
        )
    );
};

export default UserProfileForServerUser;

// Branding option
/* 
{user.branding &&
                        (differenceOnDays(user.branding.dateLimit.toDate()) >
                        0 ? (
                            <section className="profile-info-wrapper | fit-width row-wrapper-item">
                                <h2 className="profile-subtitle icon-wrapper">
                                    <Bullhorn />
                                    Branding
                                </h2>
                                <span className="location-field">
                                    Valido hasta el{" "}
                                    {
                                        user.branding.dateLimit
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
*/
