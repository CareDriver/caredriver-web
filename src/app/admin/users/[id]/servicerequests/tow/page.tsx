import { TypeOfServicePerformed } from "@/components/services_performed/models/TypeOfServicePerformed";
import ListOfServicesPerfByUser from "@/components/services_performed/lists_of_cards/ListOfServicesPerfByUser";
import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

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
