"use client";

import Popup from "@/components/modules/Popup";
import { useState } from "react";
import RedirectorToServiceByFakeId from "../../../app_modules/services_performed/view/redirectors/RedirectorToServiceByFakeId";
import MagnifyingGlass from "@/icons/MagnifyingGlass";
import "@/styles/modules/popup.css";

const RedirectToService = () => {
    const [isOpen, setOpen] = useState(false);

    const open = () => setOpen(true);
    const close = () => setOpen(false);

    return (
        <>
            <button onClick={open} className="sidebar-option">
                <MagnifyingGlass />
                <span>Servicio por Id</span>
            </button>
            <Popup close={close} isOpen={isOpen}>
                <div>
                    <h2 className="text | bold big">
                        Buscar{" "}
                        <i className="text | bold big">
                            servicio por Id
                        </i>
                    </h2>
                    <p className="text | light margin-bottom-25">
                        Ingresa el Id del servicio segun al tipo de servicio
                        para ir a ver su informacion y su estado actual.
                    </p>
                    <RedirectorToServiceByFakeId />
                </div>
            </Popup>
        </>
    );
};

export default RedirectToService;
