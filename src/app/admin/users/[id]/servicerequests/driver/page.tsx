import { TypeOfServiceDone } from "@/components/done_services/constants/TypeOfServiceDone";
import ServicesRequestedByUser from "@/components/done_services/requested/ServicesRequestedByUser";
import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const ListOfDriveServiceDoneByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="userinfo" id={params.id}>
                <ServicesRequestedByUser
                    serviceUserId={params.id}
                    type="driver"
                    typeOfService={TypeOfServiceDone.Requested}
                />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default ListOfDriveServiceDoneByUser;
