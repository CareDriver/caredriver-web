import { Enterprise } from "@/interfaces/Enterprise";
import EnterpriseRenderer from "./EnterpriseRenderer";
import FieldDeleted from "../form/FieldDeleted";
import Car from "@/icons/Car";

const DriverServiceRenderer = ({
    driverEnterprise,
}: {
    driverEnterprise: Enterprise | undefined;
}) => {
    return (
        <div className="form-sub-container | margin-top-25">
            <h2 className="text icon-wrapper | medium-big bold">
                <Car />
                Empresa de choferes
            </h2>

            {driverEnterprise ? (
                <EnterpriseRenderer enterprise={driverEnterprise} />
            ) : (
                <FieldDeleted description="El usuario no selecciono la empresa de choferes donde trabaja" />
            )}
        </div>
    );
};

export default DriverServiceRenderer;
