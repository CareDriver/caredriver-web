"use client";

import { useEffect } from "react";

const DoSomething = () => {
    useEffect(() => {
        /* changeUsers()
            .then(() => console.log("success"))
            .catch((e) => console.log(e)); */
    }, []);

    return <div></div>;
};

export default DoSomething;
