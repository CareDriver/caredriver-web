import Link from "next/link";

const SignIn = () => {
    return (
        <section>
            <h1>Iniciar Sesion</h1>
            <form>
                <fieldset>
                    <input type="text" placeholder="Correo Electronico" />
                </fieldset>
                <fieldset>
                    <input type="text" placeholder="Contraseña" />
                </fieldset>

                <button>Iniciar Sesion</button>
            </form>
            <Link href={"/auth/signup"}>Todavia no tienes cuenta? Registrate ahora</Link>
        </section>
    );
};

export default SignIn;
