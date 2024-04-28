import Car from "@/icons/Car";
import InputData from "../form/InputData";

const VehicleCategoryRender = ({ category }: { category: string }) => {
    return (
        <>
            <h2 className="text icon-wrapper | medium-big bold">
                <Car /> Categoria del vehículo
            </h2>
            <InputData content={category} placeholder={undefined} />
        </>
    );
};

export default VehicleCategoryRender;
