"use client";
import PageLoader from "@/components/PageLoader";
import { AuthContext } from "@/context/AuthContext";
import AddressCar from "@/icons/AddressCar";
import SackDollar from "@/icons/SackDollar";
import Link from "next/link";
import { useContext } from "react";

const DrivePanel = () => {
    const { user, loadingUser } = useContext(AuthContext);

    return loadingUser ? (
        <PageLoader />
    ) : user.data ? (
        <div className="service-form-wrapper">
            <h1 className="text | big bolder green">Tu solicitud fue aprobada!</h1>
            <p className="text icon-wrapper | green-icon green bolder lb medium margin-top-15">
                <SackDollar />
                Ve a nuestra Aplicacion Móvil y empieza a Ofrecer tu servicio!
            </p>
            {user.data.licenses && user.data.licenses.car && (
                <div>
                    <h2 className="text icon-wrapper | medium-big bold lb">
                        <AddressCar />
                        Licencia | Automovil
                    </h2>
                    <h3>
                        {user.data.licenses.car.expiredDateLicense.toDate().toUTCString()}
                    </h3>
                    <Link href={`/services/license/update/car`}>Actualizar Licencia</Link>
                </div>
            )}
            {user.data.licenses && user.data.licenses.motorcycle && (
                <div>
                    <h2 className="text icon-wrapper | medium-big bold lb">
                        <AddressCar />
                        Licencia | Motocicleta
                    </h2>
                    <h3>
                        {user.data.licenses.motorcycle.expiredDateLicense
                            .toDate()
                            .toUTCString()}
                    </h3>
                    <Link href={`/services/license/update/motorcycle`}>
                        Actualizar Licencia
                    </Link>
                </div>
            )}
            {(!user.data.licenses?.car || !user.data.licenses?.motorcycle) && (
                <div>
                    <h2 className="text icon-wrapper | medium-big bold lb">
                        <AddressCar />
                        {user.data.licenses && !user.data.licenses.motorcycle
                            ? "Motocicleta"
                            : "Automovil"}
                    </h2>
                    <h3>
                        Agrega este vehiculo para poder ofrecer tu servicio usando este
                        vehiculo.
                    </h3>
                    <Link
                        href={`/services/drive/addnew/${
                            user.data.licenses && !user.data.licenses.motorcycle
                                ? "motorcycle"
                                : "car"
                        }`}
                    >
                        Agregar Vehiculo
                    </Link>
                </div>
            )}
        </div>
    ) : (
        <h2>Usuario no encontrado</h2>
    );
};

export default DrivePanel;
