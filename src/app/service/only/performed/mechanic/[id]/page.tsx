import BaseRendererOfServicePerf from "@/components/app_modules/services_performed/view/single_views/BaseRendererOfServicePerf";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardForServices from "@/components/guards/views/page_guards/concrets/GuardForServices";

const Page = ({ params }: { params: any }) => {
    return (
        <GuardForServices serviceType="mechanical">
            <ConsentForm moduleTarget="mechanicserviceonly" id={params.id}>
                <BaseRendererOfServicePerf id={params.id} type="mechanical" />
            </ConsentForm>
        </GuardForServices>
    );
};

export default Page;
