import Link from "next/link";

export default function App() {
    return (
        <main>
            <div>BIENVENIDO</div>
            <Link href={"/auth"}>Comenzar</Link>
        </main>
    );
}
