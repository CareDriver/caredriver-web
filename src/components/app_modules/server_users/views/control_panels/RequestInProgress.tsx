import "@/styles/components/inprogress.css";
import Image from "next/image";

const RequestInProgress = () => {
  return (
    <section className="inprogress-wrapper">
      <h1 className="text | big bold">Tu solicitud está siendo revisada</h1>
      <p className="text | bold">
        Espera a que uno de nuestros administradores apruebe tu solicitud.
      </p>
      <img className="inprogress-image" src="/images/image2.png" alt="" />
      <span className="circles-right-bottomv2 green"></span>
    </section>
  );
};

export default RequestInProgress;
