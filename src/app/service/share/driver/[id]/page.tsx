import SharedServiceViewWithLoader from "@/components/app_modules/services_performed/view/control_panels/SharedServiceViewWithLoader";

const Page = ({ params }: { params: any }) => {
  return <SharedServiceViewWithLoader id={params.id} type="driver" />;
};

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default Page;
