import { TypeOfServiceDone } from "@/components/done_services/constants/TypeOfServiceDone";
import ServicesRequestedByUser from "@/components/done_services/requested/ServicesRequestedByUser";
import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const ListOfMechanicServiceReqsByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="userinfo" id={params.id}>
                <ServicesRequestedByUser
                    serviceUserId={params.id}
                    type="mechanic"
                    typeOfService={TypeOfServiceDone.Served}
                />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default ListOfMechanicServiceReqsByUser;
