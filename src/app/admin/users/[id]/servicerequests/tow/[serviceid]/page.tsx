import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const SingleTowServiceDidByUserPage = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <div>
                user: {params.id} service: {params.serviceid}
            </div>
        </AdminWrapperWithSideBar>
    );
};

export default SingleTowServiceDidByUserPage;
