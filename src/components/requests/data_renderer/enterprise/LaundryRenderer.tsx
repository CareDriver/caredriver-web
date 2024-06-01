import { Enterprise } from "@/interfaces/Enterprise";
import EnterpriseRenderer from "./EnterpriseRenderer";
import FieldDeleted from "../form/FieldDeleted";
import Soap from "@/icons/Soap";

const LaundryRenderer = ({ laundry }: { laundry: Enterprise | undefined }) => {
    return (
        <div className="form-sub-container | margin-top-25">
            <h2 className="text icon-wrapper | medium-big bold">
                <Soap />
                Lavadero
            </h2>

            {laundry ? (
                <EnterpriseRenderer enterprise={laundry} />
            ) : (
                <FieldDeleted description="El usuario no selecciono el lavadero donde trabaja" />
            )}
        </div>
    );
};

export default LaundryRenderer;
