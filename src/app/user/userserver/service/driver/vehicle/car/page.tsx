import ServiceContainer from "@/components/app_modules/server_users/views/containers/ServiceContainer";
import NewVehicleRegistrationAsIndependent from "@/components/app_modules/server_users/views/request_forms/requests_to_be_servers/for_driver/NewVehicleRegistrationAsIndependent";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";

const Page = () => {
  return (
    <GuardForServerUsers>
      <ServiceContainer>
        <NewVehicleRegistrationAsIndependent type="car" />
      </ServiceContainer>
    </GuardForServerUsers>
  );
};

export default Page;
