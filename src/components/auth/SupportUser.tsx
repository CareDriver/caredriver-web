"use client";

import { FormEvent } from "react";

const SupportUser = () => {
    const createSupportUser = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/firebase", {
                method: "POST",
                body: JSON.stringify({
                    email: "supportbyadmin@gmail.com",
                    password: "support123",
                }),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });
            console.log(res);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <form onSubmit={createSupportUser}>
            <button>create</button>
        </form>
    );
};

export default SupportUser;
