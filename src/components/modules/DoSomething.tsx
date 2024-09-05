"use client";

import { useEffect } from "react";
import { printEnterprisesWithUsers } from "../app_modules/enterprises/api/EnterpriseRequester";

const DoSomething = () => {
    useEffect(() => {
        printEnterprisesWithUsers()
            .then(() => console.log("success"))
            .catch((e) => console.log(e));
    }, []);

    return <div></div>;
};

export default DoSomething;
