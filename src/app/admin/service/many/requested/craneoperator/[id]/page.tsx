import { TypeOfServicePerformed } from "@/components/app_modules/services_performed/model/models/TypeOfServicePerformed";
import ListOfServicesPerfByUser from "@/components/app_modules/services_performed/view/lists_of_cards/ListOfServicesPerfByUser";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardForReadOnlyUserInfo from "@/components/guards/views/page_guards/concrets/GuardForReadOnlyUserInfo";

const Page = ({ params }: { params: any }) => {
    return (
        <GuardForReadOnlyUserInfo>
            <ConsentForm moduleTarget="userinfo" id={params.id}>
                <ListOfServicesPerfByUser
                    userId={params.id}
                    typeOfService="tow"
                    typeOfPerf={TypeOfServicePerformed.Requested}
                />
            </ConsentForm>
        </GuardForReadOnlyUserInfo>
    );
};

export default Page;
