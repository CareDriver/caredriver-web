import SingleServiceDone from "@/components/services_performed/SingleServiceDone";
import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const SingleDriveServiceReqByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="userlaundryservice" id={params.serviceid}>
                <SingleServiceDone id={params.serviceid} type="laundry" />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default SingleDriveServiceReqByUser;
