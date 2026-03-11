import UserRegistrationForm from "@/components/auth/views/sign_up/UserRegistrationForm";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";
import GuardOfPage from "@/components/guards/views/page_guards/base/GuardOfPage";
import { ROLES_TO_ADD_USERS } from "@/components/guards/models/PermissionsByUserRole";

const RegisterNewUserPage = () => {
  return (
    <GuardOfPage roles={ROLES_TO_ADD_USERS}>
      <WrapperWithSideBar>
        <UserRegistrationForm />
      </WrapperWithSideBar>
    </GuardOfPage>
  );
};

export default RegisterNewUserPage;
