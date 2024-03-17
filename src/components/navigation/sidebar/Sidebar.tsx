"use client";

import { auth } from "@/firebase/FirebaseConfig";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import Link from "next/link";

const SideBar = () => {
    const router = useRouter();

    const logout = () => {
        auth.signOut()
            .then(() => {
                toast("Sesion cerrada existosamente");
                router.push("/");
            })
            .catch(() => {
                toast("Algo salio mal");
                router.push("/");
            });
    };

    return (
        <nav>
            <li>
                <Link href={"/services/drive"}>Chofer</Link>
                <Link href={"/services/mechanic"}>Mecanico</Link>
                <Link href={"/services/tow"}>Grua</Link>
            </li>
            <li>
                <button onClick={logout}>Log out</button>
            </li>
        </nav>
    );
};

export default SideBar;
