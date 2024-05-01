import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const SingleMechanicServiceReqByUser = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <div>
                user: {params.id} service: {params.serviceid}
            </div>
        </AdminWrapperWithSideBar>
    );
};

export default SingleMechanicServiceReqByUser;
