import FormToSeeInfo from "@/components/permission_handlers/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission_handlers/page/concrets/PageUserInfoPermission";
import { TypeOfServicePerformed } from "@/components/app_modules/services_performed/model/models/TypeOfServicePerformed";
import ListOfServicesPerfByUser from "@/components/app_modules/services_performed/view/lists_of_cards/ListOfServicesPerfByUser";

const ListOfDriveServiceDoneByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="userinfo" id={params.id}>
                <ListOfServicesPerfByUser
                    userId={params.id}
                    typeOfService="laundry"
                    typeOfPerf={TypeOfServicePerformed.Requested}
                />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default ListOfDriveServiceDoneByUser;
