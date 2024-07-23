"use client";

import Link from "next/link";
import SignUpAsNew from "./SignUpAsNew";

const SignUp = () => {
    return (
        <section className="form-container | center">
            <h1 className="text | bigger bold">Regístrate!</h1>
            <SignUpAsNew />
            <Link href={"/auth/signin"} className="text | small underline">
                ¿Ya tienes cuenta? Inicia sesión
            </Link>
        </section>
    );
};

export default SignUp;
