import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ListOfTowServiceDoneByUser = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <div>req by {params.id}</div>
        </AdminWrapperWithSideBar>
    );
};

export default ListOfTowServiceDoneByUser;
