"use client";

import { Enterprise } from "@/interfaces/Enterprise";
import { UserInterface } from "@/interfaces/UserInterface";
import { useEffect, useState } from "react";

const DriverInstrucctions = ({ user }: { user: UserInterface }) => {
    const [enterprises, setEnterprises] = useState<Enterprise[]>([]);

    useEffect(() => {
        // TODO: load drive enterprises based on the user location
    }, []);

    return (
        <div className="max-width-60">
            <p className="text | medium margin-top-15">
                1. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Autem distinctio saepe quis tempore rerum laudantium.
            </p>
            <p className="text | medium margin-top-15">
                2. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Autem distinctio saepe quis tempore rerum laudantium, est
                tenetur magni sint consequatur molestiae nam dolorem ex
                asperiores repudiandae voluptatem? Quo, blanditiis ipsam!
            </p>
        </div>
    );
};

export default DriverInstrucctions;
