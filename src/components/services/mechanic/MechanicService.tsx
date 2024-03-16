"use client";

import { AuthContext } from "@/context/AuthContext";
import { Services } from "@/interfaces/Services";

import { useContext, useEffect, useState } from "react";
import MechanicPanel from "./MechanicPanel";
import MechanicRegistration from "./MechanicRegistration";

const MechanicService = () => {
    const { user } = useContext(AuthContext);
    const [isRegistered, setRegistered] = useState(false);

    useEffect(() => {
        if (user?.services.includes(Services.Driver)) {
            setRegistered(true);
        }
    }, []);

    return isRegistered ? <MechanicPanel /> : <MechanicRegistration />;
};

export default MechanicService;
