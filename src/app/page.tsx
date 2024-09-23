import Home from "@/components/home/Home";
import { NAME_BUSINESS } from "@/models/Business";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `${NAME_BUSINESS} | Inicio`,
    description: "",
};

const Page = () => {
    return <Home />;
};

export default Page;
