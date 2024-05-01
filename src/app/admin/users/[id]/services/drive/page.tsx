import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ListOfDriveServiceReqsByUser = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <div>Drive service by {params.id}</div>
        </AdminWrapperWithSideBar>
    );
};

export default ListOfDriveServiceReqsByUser;
