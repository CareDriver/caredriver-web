"use client";

import Link from "next/link";
import SignUpAsNew from "./SignUpAsNew";
import SignUpWithPhone from "./SignUpWithPhone";
import { useState } from "react";

const enum Method {
    AsNew = "newuser",
    WithPhone = "usingphone",
}

const SignUp = () => {
    const [method, setMethod] = useState(Method.AsNew);

    return (
        <section>
            <h1 className="text | big bold">Registrate</h1>
            <div>
                <button
                    onClick={() => setMethod(Method.AsNew)}
                    className={`option-button ${method === Method.AsNew && "selected"}`}
                >
                    Nuevo Usuario
                </button>
                <button
                    onClick={() => setMethod(Method.WithPhone)}
                    className={`option-button ${
                        method === Method.WithPhone && "selected"
                    }`}
                >
                    Usuario Registrado
                </button>
            </div>
            {method === Method.AsNew ? <SignUpAsNew /> : <SignUpWithPhone />}
            <Link href={"/auth/signin"} className="text | small bold underline">
                Ya tienes cuenta? Inicia sesion
            </Link>
        </section>
    );
};

export default SignUp;
