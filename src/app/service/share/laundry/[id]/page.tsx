"use client";

import { useRouteId } from "@/hooks/useRouteId";
import SharedServiceViewWithLoader from "@/components/app_modules/services_performed/view/control_panels/SharedServiceViewWithLoader";

const Page = () => {
  const id = useRouteId();
  return <SharedServiceViewWithLoader id={id} type="laundry" />;
};

export default Page;
