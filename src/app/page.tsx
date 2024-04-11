import Link from "next/link";
import "@/styles/components/home.css";
import "@/styles/base/reset.css";

export default function App() {
    return (
        <main className="home-container">
            <span className="circles"></span>
            <img src="/images/logowithname.png" alt="" />
            <Link href={"/auth/signin"} className="action-button">
                Comenzar
            </Link>
            <span className="circles-right-bottom"></span>
        </main>
    );
}
