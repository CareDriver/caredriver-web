import Warehouse from "@/icons/Warehouse";
import { Enterprise } from "@/interfaces/Enterprise";
import EnterpriseRenderer from "./EnterpriseRenderer";
import FieldDeleted from "../form/FieldDeleted";

const WorkshopRenderer = ({ workshop }: { workshop: Enterprise | undefined }) => {
    return (
        <div className="form-sub-container | margin-top-25">
            <h2 className="text icon-wrapper | medium-big bold">
                <Warehouse />
                Taller mecanico
            </h2>

            {workshop ? (
                <EnterpriseRenderer enterprise={workshop} />
            ) : (
                <FieldDeleted description="No se selecciono el taller mecanico (El campo era opcional)" />
            )}
        </div>
    );
};

export default WorkshopRenderer;
