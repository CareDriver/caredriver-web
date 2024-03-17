"use client";

import { AuthContext } from "@/context/AuthContext";
import { Services } from "@/interfaces/Services";
import { useContext, useEffect, useState } from "react";
import DrivePanel from "./DrivePanel";
import DriverRegistration from "./DriverRegistration";

const DriveService = () => {
    const { user } = useContext(AuthContext);
    const [isRegistered, setRegistered] = useState(false);

    useEffect(() => {
        if (user?.services.includes(Services.Driver)) {
            setRegistered(true);
        }
    }, []);

    return isRegistered ? <DrivePanel /> : <DriverRegistration />;
};

export default DriveService;
