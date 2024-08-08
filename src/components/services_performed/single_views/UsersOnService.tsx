"use client";

import FieldDeleted from "@/components/requests/data_renderer/form/FieldDeleted";
import HelmetSafety from "@/icons/HelmetSafety";
import UserIcon from "@/icons/UserIcon";
import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { ServicesDataInterface } from "@/interfaces/ServicesDataInterface";
import { UserInterface } from "@/interfaces/UserInterface";
import { getUserById } from "@/utils/requests/UserRequester";
import { useEffect, useState } from "react";
import "@/styles/components/app-user.css";

interface UserServiceInfo {
    fullName: string;
    phoneNumber: string;
    photoUrl: string;
    email: string | undefined;
    normalServiceData?: ServicesDataInterface;
}

const UsersOnService = ({ service }: { service: ServiceRequestInterface }) => {
    const [serverUser, setServerUser] = useState<UserServiceInfo | null | undefined>(
        null,
    );
    const [reqUser, setReqUser] = useState<UserServiceInfo | null | undefined>(null);

    const renderUser = (user: UserServiceInfo) => {
        return (
            <div className="user-info-wrapper">
                <img
                    src={user.photoUrl}
                    alt="user photo"
                    className="user-info-photo-size-v2"
                />
                <div className="user-info-subwrapper">
                    <h3 className="text | big-medium-v2 bolder">{user.fullName}</h3>
                    {user.email && (
                        <h4 className="text | medium-big bold gray-dark">{user.email}</h4>
                    )}
                    <h4 className="text | medium-big bold gray-dark">
                        {user.phoneNumber}
                    </h4>
                </div>
            </div>
        );
    };

    const toRenderUser = (user: UserInterface): UserServiceInfo => {
        return {
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            photoUrl: user.photoUrl.url,
            email: user.email,
        };
    };

    useEffect(() => {
        if (service.serviceUserData) {
            setServerUser(service.serviceUserData);
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
            setReqUser(service.requestUserData);
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
            <div className="margin-top-50 | max-width-80">
                <h2 className="text icon-wrapper | user-title-responsive big-medium-v4 bold nb margin-bottom-15">
                    <HelmetSafety /> Usuario servidor
                </h2>

                {serverUser === null ? (
                    <span className="loader"></span>
                ) : serverUser === undefined ? (
                    <FieldDeleted description={"El usuario servidor no fue asignado"} />
                ) : (
                    renderUser(serverUser)
                )}
            </div>
            <div className="margin-top-25 margin-bottom-50 | max-width-80">
                <h2 className="text icon-wrapper | user-title-responsive big-medium-v4 bold nb margin-bottom-15">
                    <UserIcon /> Usuario solicitador del servicio
                </h2>
                {reqUser === null ? (
                    <span className="loader"></span>
                ) : reqUser === undefined ? (
                    <FieldDeleted
                        description={"El usuario que pidio el servicio no fue encontrado"}
                    />
                ) : (
                    renderUser(reqUser)
                )}
            </div>
        </>
    );
};

export default UsersOnService;
