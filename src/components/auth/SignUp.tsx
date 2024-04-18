"use client";

import Link from "next/link";
import SignUpAsNew from "./SignUpAsNew";

const SignUp = () => {

    return (
        <section className="form-container | center">
            <h1 className="text | bigger bold">Registrate!</h1>
            <SignUpAsNew /> 
            <Link href={"/auth/signin"} className="text | small underline">
                Ya tienes cuenta? Inicia sesion
            </Link>
        </section>
    );
};

export default SignUp;
