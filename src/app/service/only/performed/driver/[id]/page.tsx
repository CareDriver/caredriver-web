import ServicePerformedWithLoader from "@/components/app_modules/services_performed/view/control_panels/ServicePerformedWithLoader";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardForServices from "@/components/guards/views/page_guards/concrets/GuardForServices";

const Page = ({ params }: { params: any }) => {
    return (
        <GuardForServices serviceType="driver">
            <ConsentForm moduleTarget="driverserviceonly" id={params.id}>
                <ServicePerformedWithLoader id={params.id} type="driver" />
            </ConsentForm>
        </GuardForServices>
    );
};

export default Page;
