import ClientIdPage from "@/components/guards/ClientIdPage";
import SharedServiceViewWithLoader from "@/components/app_modules/services_performed/view/control_panels/SharedServiceViewWithLoader";

const Page = () => {
  return (
    <ClientIdPage>
      {(id) => <SharedServiceViewWithLoader id={id} type="mechanical" />}
    </ClientIdPage>
  );
};

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default Page;
