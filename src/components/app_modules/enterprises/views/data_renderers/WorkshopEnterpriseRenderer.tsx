import Warehouse from "@/icons/Warehouse";
import { Enterprise } from "@/interfaces/Enterprise";
import EnterpriseRenderer from "./EnterpriseRenderer";
import FieldDeleted from "../../../../form/view/field_renderers/FieldDeleted";

const WorkshopEnterpriseRenderer = ({
    workshop,
}: {
    workshop: Enterprise | undefined;
}) => {
    return (
        <div className="form-sub-container | margin-top-25">
            <h2 className="text icon-wrapper | medium-big bold">
                <Warehouse />
                Taller mecánico
            </h2>

            {workshop ? (
                <EnterpriseRenderer enterprise={workshop} />
            ) : (
                <FieldDeleted description="Taller mecánico no encontrado" />
            )}
        </div>
    );
};

export default WorkshopEnterpriseRenderer;
