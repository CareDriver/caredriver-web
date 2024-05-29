import ServicesServedByUser from "@/components/done_services/served/ServicesServedByUser";
import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const ListOfTowServiceReqsByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="userinfo" id={params.id}>
                <ServicesServedByUser serviceUserId={params.id} type="tow" />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default ListOfTowServiceReqsByUser;
