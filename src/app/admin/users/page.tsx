import UsersRenderer from "@/components/users/UsersRenderer";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ListOfUsersOntheApplicationPage = () => {
    return (
        <AdminWrapperWithSideBar>
            <UsersRenderer />
        </AdminWrapperWithSideBar>
    );
};

export default ListOfUsersOntheApplicationPage;
