"use client";

import { AuthContext } from "@/context/AuthContext";
import { Services } from "@/interfaces/Services";
import { useContext, useEffect, useState } from "react";
import TowPanel from "./TowPanel";
import TowRegistration from "./registration/TowRegistration";

const TowService = () => {
    /* const { user } = useContext(AuthContext);
    const [isRegistered, setRegistered] = useState(false);

    useEffect(() => {
        if (user?.services.includes(Services.Driver)) {
            setRegistered(true);
        }
    }, []);

    return isRegistered ? <TowPanel /> : <TowRegistration />; */
    return <TowRegistration />;
};

export default TowService;
