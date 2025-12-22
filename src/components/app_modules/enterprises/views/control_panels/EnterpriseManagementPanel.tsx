import FieldDeleted from "@/components/form/view/field_renderers/FieldDeleted";
import { Enterprise } from "@/interfaces/Enterprise";
import EnterpriseRenderer from "../data_renderers/EnterpriseRenderer";
import EnterpriseEditForm from "../request_forms/to_edit/EnterpriseEditForm";
import { IEditedEnterpriseManager } from "../../models/enterprise_managers_edited/IEditedEnterpriseManager";

interface Props {
  enterprise: Enterprise;
  editedEnterpriseManager: IEditedEnterpriseManager;
}

const EnterpriseManagementPanel: React.FC<Props> = ({
  enterprise,
  editedEnterpriseManager,
}) => {
  return enterprise.deleted ? (
    <div className="margin-top-25 max-width-80">
      <FieldDeleted description="Esta empresa fue eliminada" />
      <EnterpriseRenderer enterprise={enterprise} />
    </div>
  ) : (
    <EnterpriseEditForm
      enterprise={enterprise}
      editedEnterpriseManager={editedEnterpriseManager}
    />
  );
};

export default EnterpriseManagementPanel;
