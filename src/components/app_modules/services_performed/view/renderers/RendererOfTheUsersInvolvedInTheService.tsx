"use client";

import HelmetSafety from "@/icons/HelmetSafety";
import UserIcon from "@/icons/UserIcon";
import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { ServicesDataInterface } from "@/interfaces/ServicesDataInterface";
import { flatPhone, UserInterface } from "@/interfaces/UserInterface";
import { getUserById } from "@/components/app_modules/users/api/UserRequester";
import { useEffect, useState } from "react";
import "@/styles/components/app-user.css";
import "@/styles/components/users.css";
import FieldDeleted from "@/components/form/view/field_renderers/FieldDeleted";
import UserPhotoRenderer from "@/components/app_modules/users/views/data_renderers/for_user_data/UserPhotoRenderer";
import { getPhoneNumber } from "@/utils/helpers/PhoneHelper";

interface UserServiceInfo {
    fullName: string;
    textNumber: string;
    photoUrl: string;
    email: string | undefined;
    normalServiceData?: ServicesDataInterface;
}

const RendererOfTheUsersInvolvedInTheService = ({
    service,
}: {
    service: ServiceRequestInterface;
}) => {
    const [serverUser, setServerUser] = useState<
        UserServiceInfo | null | undefined
    >(null);
    const [reqUser, setReqUser] = useState<UserServiceInfo | null | undefined>(
        null,
    );

    const renderUser = (user: UserServiceInfo) => {
        return (
            <div className="user-info-wrapper">
                <UserPhotoRenderer photo={user.photoUrl} />
                <div className="user-info-subwrapper">
                    <h3 className="text | big-medium-v4 bold">
                        {user.fullName}
                    </h3>
                    {user.email && (
                        <h4 className="text | gray-dark">{user.email}</h4>
                    )}
                    <h4 className="text | gray-dark">{user.textNumber}</h4>
                </div>
            </div>
        );
    };

    const toRenderUser = (user: UserInterface): UserServiceInfo => {
        return {
            fullName: user.fullName,
            textNumber: flatPhone(user.phoneNumber),
            photoUrl: user.photoUrl.url,
            email: user.email,
        };
    };

    useEffect(() => {
        if (service.serviceUserData) {
            setServerUser({
                ...service.serviceUserData,
                textNumber: getPhoneNumber(service.serviceUserData),
            });
        } else {
            getUserById(service.serviceUserId)
                .then((res) => {
                    if (res) {
                        setServerUser(toRenderUser(res));
                    } else {
                        setServerUser(undefined);
                    }
                })
                .catch(() => {
                    setServerUser(undefined);
                });
        }
    }, []);

    useEffect(() => {
        if (service.requestUserData) {
            setReqUser({
                ...service.requestUserData,
                textNumber: getPhoneNumber(service.requestUserData),
            });
        } else if (service.userId) {
            getUserById(service.userId)
                .then((res) => {
                    if (res) {
                        setReqUser(toRenderUser(res));
                    } else {
                        setReqUser(undefined);
                    }
                })
                .catch(() => {
                    setReqUser(undefined);
                });
        } else {
            setReqUser(undefined);
        }
    }, []);

    return (
        <>
            <div className="margin-top-50 | max-width-60">
                <h2 className="text icon-wrapper | medium-big bold margin-bottom-15">
                    <HelmetSafety /> Usuario servidor
                </h2>

                {serverUser === null ? (
                    <span className="loader"></span>
                ) : serverUser === undefined ? (
                    <FieldDeleted
                        description={"El usuario servidor no fue asignado"}
                    />
                ) : (
                    renderUser(serverUser)
                )}
            </div>
            <div className="margin-top-25 margin-bottom-25 | max-width-60">
                <h2 className="text icon-wrapper | medium-big bold margin-bottom-15">
                    <UserIcon /> Usuario solicitador del servicio
                </h2>
                {reqUser === null ? (
                    <span className="loader"></span>
                ) : reqUser === undefined ? (
                    <FieldDeleted
                        description={
                            "El usuario que pidio el servicio no fue encontrado"
                        }
                    />
                ) : (
                    renderUser(reqUser)
                )}
            </div>
        </>
    );
};

export default RendererOfTheUsersInvolvedInTheService;
