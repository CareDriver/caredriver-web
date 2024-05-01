import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ListOfMechanicServiceDoneByUser = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <div>by: {params.id}</div>
        </AdminWrapperWithSideBar>
    );
};

export default ListOfMechanicServiceDoneByUser;
