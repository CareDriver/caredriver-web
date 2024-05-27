import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageRequestPermission from "@/components/permission/page/concrets/PageRequestPermission";
import SingleServiceReq from "@/components/requests/services/SingleServiceReq";

const SingleTowReqPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <FormToSeeInfo target="mechanicservicereq" id={params.id}>
                <SingleServiceReq reqId={params.id} type="tow" />
            </FormToSeeInfo>
        </PageRequestPermission>
    );
};

export default SingleTowReqPage;
