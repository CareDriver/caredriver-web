import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const SingleMechanicServiceDidByUserPage = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <div>
                user: {params.id} service: {params.serviceid}
            </div>
        </AdminWrapperWithSideBar>
    );
};

export default SingleMechanicServiceDidByUserPage;
