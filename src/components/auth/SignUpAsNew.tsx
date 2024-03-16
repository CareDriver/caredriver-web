"use client";

import { auth } from "@/firebase/FirebaseConfig";
import { servicesData } from "@/interfaces/ServicesDataInterface";
import { saveUser } from "@/utils/requests/UserRequester";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const SignUpAsNew = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const signUp = async (e: FormEvent) => {
        e.preventDefault();
        var wasSuccess = false;
        var userId = "";

        createUserWithEmailAndPassword(auth, formData.email, formData.password)
            .then((res) => {
                wasSuccess = true;
                userId = res.user.uid;
                console.log(res);
            })
            .catch((e) => {
                wasSuccess = false;
                console.log(e);
            });

        const emptyUserData = {
            id: userId,
            fullName: formData.fullName,
            phoneNumber: "",
            photoUrl: "",

            comments: [],
            vehicles: [],
            services: [],

            servicesData: servicesData,
            pickUpLocationsHistory: [],
            deliveryLocationsHistory: [],

            email: formData.email,
        };
        await saveUser(userId, emptyUserData);

        if (wasSuccess) {
            router.push("/services/drive");
        }
    };

    return (
        <form onSubmit={signUp}>
            <fieldset>
                <input
                    type="text"
                    placeholder="Nombre Completo"
                    onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                    }
                />
            </fieldset>
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
