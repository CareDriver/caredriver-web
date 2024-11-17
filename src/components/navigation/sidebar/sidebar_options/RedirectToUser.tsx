"use client";

import Popup from "@/components/modules/Popup";
import { useState } from "react";
import "@/styles/modules/popup.css";
import RedirectorToUserByFakeId from "@/components/app_modules/users/views/redirectors/RedirectorToUserByFakeId";
import UserSecret from "@/icons/UserSecret";

const RedirectToUser = () => {
    const [isOpen, setOpen] = useState(false);

    const open = () => setOpen(true);
    const close = () => setOpen(false);

    return (
        <>
            <button onClick={open} className="sidebar-option">
                <UserSecret />
                <span>Usuario por Id</span>
            </button>
            <Popup close={close} isOpen={isOpen}>
                <div>
                    <h2 className="text | bold big">
                        Buscar{" "}
                        <i className="text | bold big">
                            usuario por Id
                        </i>
                    </h2>
                    <p className="text | light margin-bottom-25">
                        Ingresa el Id del usuario para ir a ver su informacion,
                        estado y actividad en la aplicacion.
                    </p>
                    <RedirectorToUserByFakeId />
                </div>
            </Popup>
        </>
    );
};

export default RedirectToUser;
