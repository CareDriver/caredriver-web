import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ListOfDriveServiceDoneByUser = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <div>by: {params.id}</div>
        </AdminWrapperWithSideBar>
    );
};

export default ListOfDriveServiceDoneByUser;
