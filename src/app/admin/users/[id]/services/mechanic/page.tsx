import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";
import { TypeOfServicePerformed } from "@/components/services_performed/model/models/TypeOfServicePerformed";
import ListOfServicesPerfByUser from "@/components/services_performed/view/lists_of_cards/ListOfServicesPerfByUser";

const ListOfMechanicServiceReqsByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="userinfo" id={params.id}>
                <ListOfServicesPerfByUser
                    userId={params.id}
                    typeOfService="mechanic"
                    typeOfPerf={TypeOfServicePerformed.Served}
                />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default ListOfMechanicServiceReqsByUser;
