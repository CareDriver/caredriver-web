import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ListOfTowServiceReqsByUser = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <div>services by {params.id}</div>
        </AdminWrapperWithSideBar>
    );
};

export default ListOfTowServiceReqsByUser;
