import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const SingleDriveServiceReqByUser = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <div>
                user: {params.id} service: {params.serviceid}
            </div>
        </AdminWrapperWithSideBar>
    );
};

export default SingleDriveServiceReqByUser;
