import Warehouse from "@/icons/Warehouse";
import { Enterprise } from "@/interfaces/Enterprise";
import InputData from "../InputData";
import ImageRenderer from "../ImageRenderer";

const WorkshopRenderer = ({ workshop }: { workshop: Enterprise }) => {
    return (
        <div className="form-sub-container | margin-top-25 max-width-90">
            <h2 className="text icon-wrapper | medium-big bold">
                <Warehouse />
                Taller mecanico
            </h2>
            <InputData content={workshop.name} placeholder={"Nombre del Taller"} />
            <InputData content={workshop.phone} placeholder={"Numero de Telefono"} />
            <ImageRenderer isCircle={true} placeholder="Logo" url={workshop.logoImgUrl} />
        </div>
    );
};

export default WorkshopRenderer;
