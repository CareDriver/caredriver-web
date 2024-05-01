import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const SingleTowServiceReqByUser = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <div>
                user: {params.id} service: {params.serviceid}
            </div>
        </AdminWrapperWithSideBar>
    );
};

export default SingleTowServiceReqByUser;
