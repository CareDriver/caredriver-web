import ServicesServedByUser from "@/components/done_services/served/ServicesServedByUser";
import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const ListOfMechanicServiceReqsByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="userinfo" id={params.id}>
                <ServicesServedByUser serviceUserId={params.id} type="mechanic" />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default ListOfMechanicServiceReqsByUser;
