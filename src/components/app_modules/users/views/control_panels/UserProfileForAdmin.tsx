"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import "@/styles/components/profile.css";
import FormToUpdateUserData from "../request_forms/to_manage_data/FormToUpdateUserData";
import PageLoading from "@/components/loaders/PageLoading";
import GuardOfModule from "@/components/guards/views/module_guards/GuardOfModule";
import { ROLES_TO_EDIT_USER_PROFILE } from "@/components/guards/models/PermissionsByUserRole";
import UserPhotoRenderer from "../data_renderers/for_user_data/UserPhotoRenderer";

const UserProfileForAdmin = () => {
    const { user, checkingUserAuth } = useContext(AuthContext);

    if (checkingUserAuth) {
        return <PageLoading />;
    }

    return (
        user && (
            <section className="user-page-wrapper | max-height-100">
                <section className="profile-wrapper">
                    <UserPhotoRenderer photo={user.photoUrl} />
                    <div className="profile-info-wrapper">
                        <h1 className="profile-fullname">{user.fullName}</h1>
                        <h2 className="profile-email">{user.email}</h2>
                    </div>
                </section>
                <GuardOfModule user={user} roles={ROLES_TO_EDIT_USER_PROFILE}>
                    <FormToUpdateUserData user={user} />
                </GuardOfModule>
                <span className="circles-right-bottomv2 green"></span>
            </section>
        )
    );
};

export default UserProfileForAdmin;
