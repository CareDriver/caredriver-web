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
                <span>Ir a un servicio</span>
            </button>
            <Popup close={close} isOpen={isOpen}>
                <div>
                    <h2 className="text | bolder big-medium capitalize margin-bottom-25">
                        Buscar servicio por ID
                    </h2>
                    <RedirectorToServiceByFakeId />
                </div>
            </Popup>
        </>
    );
};

export default RedirectToService;
