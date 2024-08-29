import NewEnterpriseForm from "@/components/app_modules/enterprises/views/request_forms/to_create/NewEnterpriseForm";
import GuardOfEnterprises from "@/components/guards/views/page_guards/concrets/GuardOfEnterprises";
import { PageStateProviderContainer } from "@/context/PageStateContext";

const Page = () => {
    return (
        <GuardOfEnterprises>
            <PageStateProviderContainer>
                <NewEnterpriseForm enterpriseType="driver" />;
            </PageStateProviderContainer>
        </GuardOfEnterprises>
    );
};

export default Page;
