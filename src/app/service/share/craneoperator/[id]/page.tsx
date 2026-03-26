"use client";

import { useParams } from "next/navigation";
import SharedServiceViewWithLoader from "@/components/app_modules/services_performed/view/control_panels/SharedServiceViewWithLoader";

const Page = () => {
  const { id } = useParams() as { id: string };
  return <SharedServiceViewWithLoader id={id} type="tow" />;
};

export default Page;
