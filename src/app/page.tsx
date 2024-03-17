import Link from "next/link";
import "../styles/components/home.css";

export default function App() {
    return (
        <main className="home-container">
            <h1 className="text | bigger bolder">BIENVENIDO</h1>
            <Link href={"/auth/signin"} className="action-button text | medium touchable">
                Comenzar
            </Link>
        </main>
    );
}
