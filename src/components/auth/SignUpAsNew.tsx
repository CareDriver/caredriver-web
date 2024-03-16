"use client";

import { auth } from "@/firebase/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const SignUpAsNew = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const signUp = (e: FormEvent) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, formData.email, formData.password)
            .then((res) => {
                console.log(res);
                router.push("/services/drive");
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <form onSubmit={signUp}>
            <fieldset>
                <input
                    type="email"
                    placeholder="Correo Electronico"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
            </fieldset>
            <fieldset>
                <input
                    type="text"
                    placeholder="Contraseña"
                    onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                    }
                />
            </fieldset>

            <button>Registrarse</button>
        </form>
    );
};

export default SignUpAsNew;
