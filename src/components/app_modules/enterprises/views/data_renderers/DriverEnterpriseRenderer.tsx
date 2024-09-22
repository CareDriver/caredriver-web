import { Enterprise } from "@/interfaces/Enterprise";
import EnterpriseRenderer from "./EnterpriseRenderer";
import FieldDeleted from "../../../../form/view/field_renderers/FieldDeleted";
import Car from "@/icons/Car";
import { DRIVER_PLURAL } from "@/models/Business";

const DriverEnterpriseRenderer = ({
    driverEnterprise,
}: {
    driverEnterprise: Enterprise | undefined;
}) => {
    return (
        <div className="form-sub-container | margin-top-25">
            <h2 className="text icon-wrapper | medium-big bold">
                <Car />
                Empresa de {DRIVER_PLURAL}
            </h2>

            {driverEnterprise ? (
                <EnterpriseRenderer enterprise={driverEnterprise} />
            ) : (
                <FieldDeleted
                    description={`Empresa de ${DRIVER_PLURAL} no encontrada`}
                />
            )}
        </div>
    );
};

export default DriverEnterpriseRenderer;
