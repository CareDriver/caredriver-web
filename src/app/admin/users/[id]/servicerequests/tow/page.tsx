import FormToSeeInfo from "@/components/permission_handlers/views/consent_forms/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission_handlers/views/page/concrets/PageUserInfoPermission";
import { TypeOfServicePerformed } from "@/components/app_modules/services_performed/model/models/TypeOfServicePerformed";
import ListOfServicesPerfByUser from "@/components/app_modules/services_performed/view/lists_of_cards/ListOfServicesPerfByUser";

const ListOfTowServiceDoneByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="userinfo" id={params.id}>
                <ListOfServicesPerfByUser
                    userId={params.id}
                    typeOfService="tow"
                    typeOfPerf={TypeOfServicePerformed.Requested}
                />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default ListOfTowServiceDoneByUser;
