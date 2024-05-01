import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ListOfMechanicServiceReqsByUser = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <div>mechanic service by {params.id}</div>
        </AdminWrapperWithSideBar>
    );
};

export default ListOfMechanicServiceReqsByUser;
