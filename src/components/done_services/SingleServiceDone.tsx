"use client";

import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { useEffect, useState } from "react";
import PageLoader from "../PageLoader";
import {
    getServiceDoneById,
    getServiceDoneCollection,
} from "@/utils/requests/services/UserMadeServices";
import { CollectionReference } from "firebase/firestore";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import { removeLastRoute } from "@/utils/parser/ForPahtname";
import { toformatDate } from "@/utils/parser/ForDate";
import UserIcon from "@/icons/UserIcon";
import HelmetSafety from "@/icons/HelmetSafety";
import { UserInterface } from "@/interfaces/UserInterface";
import { getUserById } from "@/utils/requests/UserRequester";

const SingleServiceDone = ({
    id,
    type,
}: {
    id: string;
    type: "driver" | "mechanic" | "tow" | "laundry";
}) => {
    const [service, setService] = useState<ServiceRequestInterface | null>(null);
    const collection: CollectionReference = getServiceDoneCollection(type);
    const router = useRouter();
    const pathname = usePathname();
    const [userReq, setUserReq] = useState<UserInterface | null | undefined>(null);
    const [userServer, setUserServer] = useState<UserInterface | null | undefined>(null);

    useEffect(() => {
        getServiceDoneById(id, collection).then((ser) => {
            if (ser) {
                setService(ser);
            } else {
                toast.error("Servicio no encontrado");
                window.location.replace(removeLastRoute(pathname));
            }
        });
    }, []);

    useEffect(() => {
        if (service && service.userId) {
            getUserById(service.userId).then((res) => {
                if (res) {
                    setUserReq(res);
                } else {
                    setUserReq(undefined);
                }
            });
        } else {
            setUserReq(undefined);
        }
    }, [service]);

    useEffect(() => {
        if (service && service.serviceUserId) {
            getUserById(service.serviceUserId).then((res) => {
                if (res) {
                    setUserServer(res);
                } else {
                    setUserServer(undefined);
                }
            });
        } else {
            setUserServer(undefined);
        }
    }, [service]);

    const getState = (service: ServiceRequestInterface) => {
        if (service.finished) {
            return <h2 className="text | bold green">Finalizado</h2>;
        } else if (service.canceled) {
            return <h2 className="text | bold red">Cancelado</h2>;
        } else {
            return <h2 className="text | bold yellow">Esta en progreso</h2>;
        }
    };

    return service ? (
        <section>
            <h1>
                Servicio{" "}
                {service.createdAt &&
                    `hecho el ${toformatDate(service.createdAt?.toDate())}`}
            </h1>
            <div>
                <h2>
                    {service.price?.price} {service.price?.currency}
                </h2>
                -{getState(service)}
            </div>

            <div>
                <h2
                    className={`text icon-wrapper | medium-big bold ${
                        userServer === undefined && "red-icon red"
                    }`}
                >
                    <HelmetSafety />
                    {userServer !== null ? (
                        userServer !== undefined ? (
                            `Usuario servidor (${userServer.services.toString()})`
                        ) : (
                            "Usuario servidor no encontrado"
                        )
                    ) : (
                        <>
                            Cargando datos del usuario servidor
                            <span className="loader-gray"></span>
                        </>
                    )}
                    {userServer && (
                        <div>
                            <img src={userServer.photoUrl.url} alt="" />
                            <div>
                                <h3>{userServer.fullName}</h3>
                                <h4>{userServer.email}</h4>
                                <h4>{userServer.phoneNumber}</h4>
                                <h4>{userServer.location}</h4>
                            </div>
                        </div>
                    )}
                </h2>
            </div>
            <div>
                <h2
                    className={`text icon-wrapper | medium-big bold ${
                        userReq === undefined && "red-icon red"
                    }`}
                >
                    <UserIcon />
                    {userReq !== null ? (
                        userReq !== undefined ? (
                            "Usuario solicitador del servicio"
                        ) : (
                            "Usuario solicitador no encontrado"
                        )
                    ) : (
                        <>
                            Cargando datos del usuario solicitador
                            <span className="loader-gray"></span>
                        </>
                    )}
                </h2>
                {userReq && (
                    <div>
                        <img src={userReq.photoUrl.url} alt="" />
                        <div>
                            <h3>{userReq.fullName}</h3>
                            <h4>{userReq.email}</h4>
                            <h4>{userReq.phoneNumber}</h4>
                            <h4>{userReq.location}</h4>
                        </div>
                    </div>
                )}
            </div>
        </section>
    ) : (
        <PageLoader />
    );
};

export default SingleServiceDone;
