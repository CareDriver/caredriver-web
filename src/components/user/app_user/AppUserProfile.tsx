"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import PageLoader from "../../PageLoader";
import "@/styles/components/profile.css";
import { DEFAULT_PHOTO } from "@/utils/user/UserData";
import UserDataUpdater from "./UserDataUpdater";
import CompPermissionValidator from "@/components/permission/component/CompPermissionValidator";
import { ROLES_TO_EDIT_USER_PROFILE } from "@/utils/validator/roles/RoleValidator";

const AppUserProfile = () => {
    const { user, loadingUser } = useContext(AuthContext);

    return loadingUser ? (
        <PageLoader />
    ) : user.data ? (
        <section className="user-page-wrapper | max-height-100">
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
            <CompPermissionValidator user={user.data} roles={ROLES_TO_EDIT_USER_PROFILE}>
                <UserDataUpdater user={user.data} />
            </CompPermissionValidator>
            <span className="circles-right-bottomv2 green"></span>
        </section>
    ) : (
        <h2>Usuario no encontrado</h2>
    );
};

export default AppUserProfile;
