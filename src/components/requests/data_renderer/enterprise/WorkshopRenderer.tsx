import Warehouse from "@/icons/Warehouse";
import { Enterprise } from "@/interfaces/Enterprise";
import EnterpriseRenderer from "./EnterpriseRenderer";

const WorkshopRenderer = ({ workshop }: { workshop: Enterprise }) => {
    return (
        <div className="form-sub-container | margin-top-25">
            <h2 className="text icon-wrapper | medium-big bold">
                <Warehouse />
                Taller mecanico
            </h2>
            <EnterpriseRenderer enterprise={workshop} />
        </div>
    );
};

export default WorkshopRenderer;
