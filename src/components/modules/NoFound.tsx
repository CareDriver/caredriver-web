"use client";

import "@/styles/components/404.css";
import { useRouter } from "next/navigation";

const NoFound = () => {
  const router = useRouter();

  return (
    <main className="nofound-wrapper">
      <img
        src="/images/crane.png"
        alt="pagina no encontrada imagen"
        className="nofound-image"
      />
      <h1 className="nofound-code">404</h1>
      <i className="text | bold big-medium-v4">Pagina no encontrada</i>

      <span
        onClick={() => router.back()}
        className="text | light max-width-50 center margin-top-50 touchable"
      >
        ¡Vaya! Parece que te has desviado del camino,{" "}
        <i className="text | bold underline">haz click aquí para volver</i>
      </span>
    </main>
  );
};

export default NoFound;
