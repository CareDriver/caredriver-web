import { TypeOfServicePerformed } from "@/components/services_performed/models/TypeOfServicePerformed";
import ListOfServicesPerfByUser from "@/components/services_performed/lists_of_cards/ListOfServicesPerfByUser";
import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const ListOfDriveServiceReqsByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="userinfo" id={params.id}>
                <ListOfServicesPerfByUser
                    userId={params.id}
                    typeOfService="laundry"
                    typeOfPerf={TypeOfServicePerformed.Served}
                />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default ListOfDriveServiceReqsByUser;
